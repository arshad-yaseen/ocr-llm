import {Provider} from '../types';

/**
 * Supported OCR providers.
 */
export const SUPPORTED_PROVIDERS = ['openai'] as const;

/**
 * Maximum number of concurrent API requests.
 */
export const MAX_CONCURRENT_REQUESTS = 10;

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
