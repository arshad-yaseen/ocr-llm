import {PDFDocumentParams, PDFPageSelection} from '.';

export type PDFToImagesOptions = {
  format?: 'png' | 'jpg';
  scale?: number;
  pages?: PDFPageSelection;
  output?: 'buffer' | 'base64' | 'blob' | 'dataurl';
  docParams?: PDFDocumentParams;
};

export type PDFToImagesResult = (string | Blob | ArrayBuffer)[];
