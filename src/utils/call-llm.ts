import {
  API_ENDPOINTS,
  REQUEST_TIMEOUT,
  RETRY_ATTEMPTS,
  RETRY_DELAY,
} from '../constants';
import {_pm} from '../logger';
import type {ChatCompletion, Provider} from '../types';
import {delay} from '../utils/delay';
import {fetchWithTimeout} from './fetch-with-timeout';
import {
  createProviderHeaders,
  createRequestBody,
  parseProviderChatCompletion,
} from './provider';

/**
 * Calls the Language Model to extract text from the image.
 * @param apiKey - API key for authentication.
 * @param imageBase64 - Base64-encoded image string.
 * @returns Extracted text content.
 */
export async function callLLM(
  apiKey: string,
  imageBase64: string,
  provider: Provider,
): Promise<string> {
  let lastError: unknown | null = null;

  for (let attempt = 0; attempt < RETRY_ATTEMPTS; attempt++) {
    try {
      const response = await fetchWithTimeout(
        API_ENDPOINTS[provider],
        {
          method: 'POST',
          headers: createProviderHeaders(apiKey, provider),
          body: JSON.stringify(createRequestBody(provider, imageBase64)),
        },
        REQUEST_TIMEOUT,
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data: ChatCompletion = await response.json();
      return parseProviderChatCompletion(data, provider) ?? '';
    } catch (error: unknown) {
      lastError = error;
      if (attempt < RETRY_ATTEMPTS - 1) {
        await delay(RETRY_DELAY * (attempt + 1)); // Exponential backoff
        continue;
      }
      throw new Error(`Failed after ${RETRY_ATTEMPTS} attempts: ${_pm(error)}`);
    }
  }

  throw lastError;
}
