import {Provider} from '../types';

/**
 * Supported OCR providers.
 */
export const SUPPORTED_PROVIDERS = ['openai'] as const;

/**
 * Maximum number of concurrent API requests.
 */
export const MAX_CONCURRENT_REQUESTS = 100;

/**
 * Request timeout in milliseconds.
 */
export const REQUEST_TIMEOUT = 30_000;

/**
 * Number of retry attempts for API requests.
 */
export const RETRY_ATTEMPTS = 3;

/**
 * Delay between retry attempts in milliseconds.
 */
export const RETRY_DELAY = 1_000;

/**
 * API endpoints for supported providers.
 */
export const API_ENDPOINTS: Record<Provider, string> = {
  openai: 'https://api.openai.com/v1/chat/completions',
};

/**
 * Prompt template for the LLM.
 */
export const DEFAULT_PROMPT_TEMPLATE =
  'Extract all visible text from this image. Format the output as markdown. Include only the text content, no explanations or additional context. Fix any formatting issues, typos, or inconsistencies found in the extracted content.';
