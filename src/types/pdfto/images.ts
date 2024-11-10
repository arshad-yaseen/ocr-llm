import {PDFDocumentParams, PDFPageSelection} from '.';

/**
 * Configuration options for converting PDF to images.
 */
export type PDFToImagesOptions = {
  /** Output image format - either PNG or JPEG */
  format?: 'png' | 'jpg';
  /** Scale factor for the output images. Default is 1.0 */
  scale?: number;
  /** Which pages to convert. Can be 'all', 'first', 'last', a page number, array of numbers, or range */
  pages?: PDFPageSelection;
  /** Desired output format of the converted images */
  output?: 'buffer' | 'base64' | 'blob' | 'dataurl';
  /** Additional PDF document parameters */
  docParams?: PDFDocumentParams;
};

/**
 * Result type for PDF to images conversion.
 * Returns an array where each element can be a string (base64/dataURL),
 * Blob, or ArrayBuffer depending on the output option.
 */
export type PDFToImagesResult = (string | Blob | ArrayBuffer)[];
