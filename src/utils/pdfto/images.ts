import type {DocumentInitParameters} from 'pdfjs-dist/types/src/display/api';

import {DEFAULT_PDF_TO_IMAGES_OPTIONS} from '../../constants/pdfto';
import {PDFSource} from '../../types/pdfto';
import {PDFToImagesOptions} from '../../types/pdfto/images';

export function configurePDFToImagesParameters(
  source: PDFSource,
  options?: PDFToImagesOptions,
) {
  const {docParams, ...rest} = {
    ...DEFAULT_PDF_TO_IMAGES_OPTIONS,
    ...options,
  };

  let documentParams: DocumentInitParameters;

  if (source instanceof ArrayBuffer) {
    documentParams = {data: source, ...docParams};
  } else if (source instanceof File) {
    const objectUrl = URL.createObjectURL(source);
    documentParams = {url: objectUrl, ...docParams};
  } else {
    documentParams = {url: source, ...docParams};
  }

  const opts: PDFToImagesOptions = {...rest};

  return {documentParams, opts};
}
