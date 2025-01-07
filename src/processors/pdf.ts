import {promises as fs} from 'fs';
import * as os from 'os';
import * as path from 'path';

import {PDFDocument} from 'pdf-lib';
import {fromPath} from 'pdf2pic';

import {ConcurrencyLimit} from '../classes/concurrency-limit';
import {MAX_CONCURRENT_REQUESTS} from '../constants';
import {_pm, report} from '../logger';
import {InputSource, PageResult, Provider} from '../types';
import {getBufferFromInput} from '../utils/buffer';
import {processImage} from './image';

export async function processPdf(
  input: InputSource,
  provider: Provider,
  apiKey: string,
): Promise<PageResult[]> {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ocr-llm-'));
  const tempPdfPath = path.join(tempDir, 'temp.pdf');

  const conversionLimiter = new ConcurrencyLimit(MAX_CONCURRENT_REQUESTS);
  const processingLimiter = new ConcurrencyLimit(MAX_CONCURRENT_REQUESTS);

  try {
    const pdfBuffer = await getBufferFromInput(input);

    await fs.writeFile(tempPdfPath, pdfBuffer);

    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const pageCount = pdfDoc.getPageCount();

    const convert = fromPath(tempPdfPath, {
      density: 300,
      saveFilename: 'page',
      savePath: tempDir,
      format: 'png',
      width: 2480,
      height: 3508,
    });

    const processingPromises: Promise<PageResult>[] = [];

    for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
      // Start conversion without waiting for processing to finish
      await conversionLimiter.run(async () => {
        try {
          // Convert page to image
          const conversionResult = await convert(pageNum);
          if (!conversionResult?.path) {
            throw new Error('Failed to convert PDF page to image');
          }
          const imageBuffer = await fs.readFile(conversionResult.path);
          await fs.unlink(conversionResult.path);

          // Start processing the image in the background
          const processingPromise = processingLimiter.run(async () => {
            try {
              const processResult = await processImage(
                imageBuffer,
                provider,
                apiKey,
              );
              return {
                page: pageNum,
                ...processResult,
              } satisfies PageResult;
            } catch (error: unknown) {
              report(error);
              return {
                page: pageNum,
                content: '',
                metadata: {
                  error: _pm(error),
                },
              } satisfies PageResult;
            }
          });

          // Collect the processing promise
          processingPromises.push(processingPromise);
        } catch (error: unknown) {
          report(error);
          // In case of conversion error, add a failed result
          processingPromises.push(
            Promise.resolve({
              page: pageNum,
              content: '',
              metadata: {
                error: _pm(error),
              },
            } satisfies PageResult),
          );
        }
      });
    }

    // Wait for all processing tasks to complete
    const results = await Promise.all(processingPromises);

    return results.sort((a, b) => a.page - b.page);
  } finally {
    // Clean up temporary directory
    try {
      await fs.rm(tempDir, {recursive: true, force: true});
    } catch (error) {
      report(error);
    }
  }
}
