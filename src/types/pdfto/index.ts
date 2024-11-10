import type {DocumentInitParameters} from 'pdfjs-dist/types/src/display/api';

export type PDFDocumentParams = Omit<DocumentInitParameters, 'data' | 'url'>;

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

export type PDFSource = string | URL | ArrayBuffer | File;
