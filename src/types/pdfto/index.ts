import type {DocumentInitParameters} from 'pdfjs-dist/types/src/display/api';

/** Parameters for configuring PDF document loading */
export type PDFDocumentParams = Omit<DocumentInitParameters, 'data' | 'url'>;

/**
 * Specifies which pages to process from a PDF document.
 * Can be 'first', 'last', 'all', a specific page number,
 * an array of page numbers, or a range with start/end.
 */
export type PDFPageSelection =
  | {
      start?: number;
      end?: number;
    }
  | 'first'
  | 'last'
  | 'all'
  | number
  | number[];

/**
 * Supported input types for PDF source documents.
 * Can be a string (base64/URL), URL object, ArrayBuffer, or File.
 */
export type PDFSource = string | URL | ArrayBuffer | File;
