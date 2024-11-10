import * as pdfjsLib from 'pdfjs-dist';
import type {
  DocumentInitParameters,
  PDFDocumentProxy,
} from 'pdfjs-dist/types/src/display/api';

import {PDFSource} from '../../types/pdfto';
import {PDFToImagesOptions, PDFToImagesResult} from '../../types/pdfto/images';
import {extractBase64FromDataURL} from '../../utils/common';
import {convertPDFBase64ToBuffer, generatePDFPageRange} from '../../utils/pdf';
import {configurePDFToImagesParameters} from '../../utils/pdfto/images';

/**
 * Converts a single PDF file to images.
 * @param source - The source PDF file. Accepts File, ArrayBuffer, URL, or string (base64/URL)
 * @param options - Configuration options for the conversion
 * @param options.format - Output image format ('png' or 'jpg'). Defaults to 'png'
 * @param options.scale - Scale factor for the output images. Defaults to 1
 * @param options.pages - Page selection ('all', 'first', 'last', page number, array of numbers, or range object). Defaults to 'all'
 * @param options.output - Output format ('buffer', 'base64', 'blob', 'dataurl'). Defaults to 'dataurl'
 * @param options.docParams - Additional PDF document parameters
 * @returns Promise resolving to an array of images
 */
async function images(
  source: PDFSource,
  options?: PDFToImagesOptions,
): Promise<PDFToImagesResult> {
  const {documentParams, opts} = configurePDFToImagesParameters(
    source,
    options,
  );
  return await processPDF(documentParams, opts);
}

async function processPDF(
  documentParams: DocumentInitParameters,
  options: PDFToImagesOptions,
): Promise<(string | Blob | ArrayBuffer)[]> {
  const pdfDoc = await pdfjsLib.getDocument(documentParams).promise;
  const numPages = pdfDoc.numPages;
  const pages = options.pages || 'all';

  let pageNumbers: number[] = [];

  if (pages === 'all') {
    pageNumbers = Array.from({length: numPages}, (_, i) => i + 1);
  } else if (pages === 'first') {
    pageNumbers = [1];
  } else if (pages === 'last') {
    pageNumbers = [numPages];
  } else if (typeof pages === 'number') {
    pageNumbers = [Math.max(pages, 1)];
  } else if (Array.isArray(pages)) {
    pageNumbers = pages.length ? pages : [1];
  } else if (typeof pages === 'object') {
    const start = pages.start ?? 1;
    const end = pages.end ?? numPages;
    pageNumbers = generatePDFPageRange(start, end);
  } else {
    throw new Error('Invalid pages option');
  }

  const images = await Promise.all(
    pageNumbers.map(async pageNumber =>
      renderPageToImage(pdfDoc, pageNumber, options),
    ),
  );

  return images;
}

async function renderPageToImage(
  pdfDoc: PDFDocumentProxy,
  pageNumber: number,
  options: PDFToImagesOptions,
): Promise<string | Blob | ArrayBuffer> {
  const {scale = 1.0, format = 'png', output = 'base64'} = options;

  const page = await pdfDoc.getPage(pageNumber);
  const viewport = page.getViewport({scale});

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d') as CanvasRenderingContext2D;

  canvas.height = viewport.height;
  canvas.width = viewport.width;

  const renderContext = {canvasContext: context, viewport};

  await page.render(renderContext).promise;

  const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
  const dataURL = canvas.toDataURL(mimeType);

  switch (output) {
    case 'dataurl':
      return dataURL;
    case 'base64':
      return extractBase64FromDataURL(dataURL);
    case 'buffer':
      return convertPDFBase64ToBuffer(extractBase64FromDataURL(dataURL));
    case 'blob':
      return new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          blob =>
            blob ? resolve(blob) : reject(new Error('Canvas toBlob failed')),
          mimeType,
        );
      });
    default:
      throw new Error('Invalid output option');
  }
}

export default images;
