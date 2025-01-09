import {
  DEFAULT_MODEL_TEMPERATURE,
  DEFAULT_PROMPT_TEMPLATE,
} from '../constants/llm';
import type {
  OpenAIChatCompletion,
  OpenAIChatCompletionCreateParams,
  Provider,
} from '../types';

interface ProviderHandler<T extends Provider> {
  createRequestBody: (
    imageBase64: string,
  ) => T extends 'openai' ? OpenAIChatCompletionCreateParams : never;
  createHeaders: (apiKey: string) => Record<string, string>;
  parseCompletion: (
    completion: T extends 'openai' ? OpenAIChatCompletion : never,
  ) => string | null;
}

const openaiHandler: ProviderHandler<'openai'> = {
  createRequestBody: imageBase64 => {
    return {
      model: 'gpt-4o-mini',
      temperature: DEFAULT_MODEL_TEMPERATURE,
      messages: [
        {
          role: 'user',
          content: [
            {type: 'text', text: DEFAULT_PROMPT_TEMPLATE},
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`,
              },
            },
          ],
        },
      ],
    };
  },

  createHeaders: (apiKey: string) => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
  }),

  parseCompletion: (completion: OpenAIChatCompletion) => {
    if (!completion.choices?.length) {
      return null;
    }

    return completion.choices[0].message.content;
  },
};

const providerHandlers: {[P in Provider]: ProviderHandler<P>} = {
  openai: openaiHandler,
};

/**
 * Creates a request body for different providers.
 */
export const createRequestBody = <T extends Provider>(
  provider: T,
  imageBase64: string,
): T extends 'openai' ? OpenAIChatCompletionCreateParams : never => {
  const handler = providerHandlers[provider];
  return handler.createRequestBody(imageBase64);
};

/**
 * Creates headers for different providers.
 */
export const createProviderHeaders = <T extends Provider>(
  apiKey: string,
  provider: T,
): Record<string, string> => {
  const handler = providerHandlers[provider];
  return handler.createHeaders(apiKey);
};

/**
 * Parses the chat completion response from different providers.
 */
export const parseProviderChatCompletion = <T extends Provider>(
  completion: T extends 'openai' ? OpenAIChatCompletion : never,
  provider: T,
): string | null => {
  const handler = providerHandlers[provider];
  return handler.parseCompletion(completion);
};
