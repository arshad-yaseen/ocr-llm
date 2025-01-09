export const DEFAULT_MODEL_TEMPERATURE = 0.1;

/**
 * Prompt template for the LLM.
 */
export const DEFAULT_PROMPT_TEMPLATE =
  'Extract all visible text from this image and format the output as markdown. Include only the text content; no explanations or additional text should be included. If the image is empty, return an empty string. Fix any formatting issues or inconsistencies found in the extracted content.';
