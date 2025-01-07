export class OcrLLMError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OcrLLMError';
  }
}

export class InvalidProviderError extends OcrLLMError {
  constructor(provider: string) {
    super(`Invalid provider: ${provider}`);
    this.name = 'InvalidProviderError';
  }
}
