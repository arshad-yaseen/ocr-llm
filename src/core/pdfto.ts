import * as pdfjsLib from 'pdfjs-dist';

import images from '../processors/pdfto/images';
import {isBrowser} from '../utils/platform';

// Set the workerSrc for pdfjsLib
if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

if (!isBrowser()) {
  throw new Error(
    'PDFTo utilities are only available in browser environments.',
  );
}

/**
 * PDF conversion utilities
 * @throws Error if not run in browser environment
 */
export const pdfto = {
  images,
};
