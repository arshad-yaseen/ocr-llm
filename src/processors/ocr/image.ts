import {_pm, report} from '../../logger';
import {ImageResult, InputSource, Provider} from '../../types';
import {getBufferFromInput} from '../../utils/buffer';
import {callLLM} from '../../utils/call-llm';
import {removeCodeBlockMarkers} from '../../utils/string';

/**
 * Processes an image input and extracts text content.
 * @param input - Image input source.
 * @param apiKey - API key for authentication.
 * @returns The extracted text and metadata.
 */
export async function processImage(
  input: InputSource,
  provider: Provider,
  apiKey: string,
): Promise<ImageResult> {
  try {
    const imageBuffer = await getBufferFromInput(input);

    const base64Image = imageBuffer.toString('base64');
    const content = await callLLM(apiKey, base64Image, provider);

    return {
      content: removeCodeBlockMarkers(content),
      metadata: {
        size: imageBuffer.length,
        timestamp: new Date().toISOString(),
      },
    };
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
