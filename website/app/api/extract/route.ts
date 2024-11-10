import {OcrLLM} from 'ocr-llm';

export const maxDuration = 60;

const ocrllm = new OcrLLM({
  provider: 'openai',
  key: process.env.OPENAI_API_KEY!,
});

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        {error: 'OpenAI API key not configured'},
        {status: 500},
      );
    }

    const {url} = await request.json();

    const result =
      typeof url === 'string'
        ? await ocrllm.image(url)
        : await ocrllm.pages(url);

    return Response.json({result});
  } catch (error) {
    console.error('Error processing request:', error);
    return Response.json(
      {error: 'An error occurred while processing your request'},
      {status: 500},
    );
  }
}
