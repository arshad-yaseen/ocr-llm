/**
 * Supported OCR providers.
 */
export const SUPPORTED_PROVIDERS = ['openai'] as const;

/**
 * Supported image MIME types.
 */
export const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

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
export const API_ENDPOINTS = {
  openai: 'https://api.openai.com/v1/chat/completions',
};

/**
 * Prompt template for the LLM.
 */
export const PROMPT_TEMPLATE =
  'Extract all visible text from this image. Format the output as markdown. Include only the text content, no explanations or additional context.';
