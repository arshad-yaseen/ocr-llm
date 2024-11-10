import {ConcurrencyLimit} from '../../classes/concurrency-limit';
import {MAX_CONCURRENT_REQUESTS} from '../../constants';
import {_pm, report} from '../../logger';
import {InputSource, PageResult, Provider} from '../../types';
import {processImage} from './image';

/**
 * Processes an array of page images in parallel and returns results in order.
 * @param inputs - Array of image inputs representing pages
 * @param provider - The OCR provider to use
 * @param apiKey - API key for authentication
 * @returns Array of page results in the same order as inputs
 */
export async function processPages(
  inputs: InputSource[],
  provider: Provider,
  apiKey: string,
): Promise<PageResult[]> {
  const processingLimiter = new ConcurrencyLimit(MAX_CONCURRENT_REQUESTS);
  const processingPromises: Promise<PageResult>[] = [];

  // Process each page image in parallel with concurrency control
  for (let pageNum = 0; pageNum < inputs.length; pageNum++) {
    const input = inputs[pageNum];
    const pagePromise = processingLimiter.run(async () => {
      try {
        const result = await processImage(input, provider, apiKey);
        return {
          page: pageNum + 1,
          ...result,
        } satisfies PageResult;
      } catch (error: unknown) {
        report(error);
        return {
          page: pageNum + 1,
          content: '',
          metadata: {
            error: _pm(error),
          },
        } satisfies PageResult;
      }
    });
    processingPromises.push(pagePromise);
  }

  // Wait for all processing to complete and return results in order
  const results = await Promise.all(processingPromises);
  return results.sort((a, b) => a.page - b.page);
}
