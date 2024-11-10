import {SUPPORTED_PROVIDERS} from '../constants';
import {InvalidProviderError} from '../errors';
import {processImage} from '../processors/ocr/image';
import {processPdf} from '../processors/ocr/pdf';
import {processPdfImages} from '../processors/ocr/pdf-images';
import {ImageResult, InputSource, OcrLLMConfig, PageResult} from '../types';

/**
 * Main class for the OcrLLM OCR engine.
 */
export class OcrLLM {
  private readonly config: OcrLLMConfig;

  /**
   * @param config - Configuration options for OcrLLM.
   */
  constructor(config: OcrLLMConfig) {
    if (!SUPPORTED_PROVIDERS.includes(config.provider)) {
      throw new InvalidProviderError(config.provider);
    }
    this.config = config;
  }

  /**
   * Processes a single image and extracts text content using OCR.
   * @param input - Image input source (file path, URL, base64 string, or Buffer)
   * @returns Promise resolving to an ImageResult containing:
   *  - content: Extracted text in markdown format
   *  - metadata: Processing metadata like timestamp and file size
   */
  async image(input: InputSource): Promise<ImageResult> {
    return processImage(input, this.config.provider, this.config.key);
  }

  /**
   * Processes a PDF document and extracts text content from each page using OCR.
   * @param input - PDF input source (file path, URL, base64 string, or Buffer)
   * @returns Promise resolving to an array of PageResult objects, each containing:
   *  - page: Page number in the document
   *  - content: Extracted text in markdown format
   *  - metadata: Processing metadata like timestamp and file size
   */
  async pdf(input: InputSource): Promise<PageResult[]> {
    return processPdf(input, this.config.provider, this.config.key);
  }

  /**
   * Processes multiple PDF page images in parallel using OCR.
   * This method is useful when you already have individual page images extracted from a PDF.
   * Processing happens concurrently for better performance.
   * @param inputs - Array of image input sources (file paths, URLs, base64 strings, or Buffers), each representing a PDF page
   * @returns Promise resolving to an array of PageResult objects in the same order as inputs, each containing:
   *  - page: Page number in the document
   *  - content: Extracted text in markdown format
   *  - metadata: Processing metadata like timestamp and file size
   */
  async pdfImages(inputs: InputSource[]): Promise<PageResult[]> {
    return processPdfImages(inputs, this.config.provider, this.config.key);
  }
}
