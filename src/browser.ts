import * as pdfjs from 'pdfjs-dist';

export {pdfto} from './core/pdfto';

// Set the workerSrc for pdfjsLib
if (!pdfjs.GlobalWorkerOptions.workerSrc) {
  pdfjs.GlobalWorkerOptions.workerSrc =
    'https://unpkg.com/pdfjs-dist@4.8.69/build/pdf.worker.min.mjs';
}
