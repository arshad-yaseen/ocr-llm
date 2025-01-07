import {createHash} from 'crypto';

import LRUCache from '../classes/lru-cache';
import {_pm, report} from '../logger';
import {ImageResult, InputSource, Provider} from '../types';
import {getBufferFromInput} from '../utils/buffer';
import {callLLM} from '../utils/call-llm';
import {removeCodeBlockMarkers} from '../utils/string';

const CACHE_CAPACITY = 500; // Maximum number of items in the cache

const cache = new LRUCache<string, ImageResult>(CACHE_CAPACITY);

export async function processImage(
  input: InputSource,
  provider: Provider,
  apiKey: string,
): Promise<ImageResult> {
  try {
    const imageBuffer = await getBufferFromInput(input);

    const hash = createHash('sha256').update(imageBuffer).digest('hex');

    const cachedResult = cache.get(hash);

    if (cachedResult) {
      return cachedResult;
    }

    const base64Image = imageBuffer.toString('base64');
    const content = await callLLM(apiKey, base64Image, provider);

    const result: ImageResult = {
      content: removeCodeBlockMarkers(content),
      metadata: {
        size: imageBuffer.length,
        timestamp: new Date().toISOString(),
      },
    };

    cache.set(hash, result);

    return result;
  } catch (error: unknown) {
    report(error);
    return {
      content: '',
      metadata: {
        error: _pm(error),
        timestamp: new Date().toISOString(),
      },
    };
  }
}
