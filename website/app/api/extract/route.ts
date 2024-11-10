import {NextRequest, NextResponse} from 'next/server';

import {OcrLLM} from 'ocr-llm';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
  maxDuration: 60,
};

const ocrllm = new OcrLLM({
  provider: 'openai',
  key: process.env.OPENAI_API_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {error: 'OpenAI API key not configured'},
        {status: 500},
      );
    }

    const {urls} = await request.json();

    const result =
      typeof urls === 'string'
        ? await ocrllm.image(urls)
        : await ocrllm.pdfImages(urls);

    return NextResponse.json({result});
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      {error: 'An error occurred while processing your request'},
      {status: 500},
    );
  }
}
