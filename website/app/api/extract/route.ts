import {NextRequest, NextResponse} from 'next/server';

import {ImageResult, OcrLLM, PageResult} from 'ocr-llm';

const ocrllm = new OcrLLM({
  provider: 'openai',
  key: process.env.OPENAI_API_KEY!,
});

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const images = formData.getAll('images');
    const url = formData.get('url');

    let results: (ImageResult | PageResult)[] = [];

    // Process each image and extract text
    if (images.length > 0) {
      results = await Promise.all(
        images.map(async image => {
          const buffer = Buffer.from(await (image as Blob).arrayBuffer());
          return ocrllm.image(buffer);
        }),
      );
    }

    if (url) {
      const urlStr = url as string;
      const isPdf = urlStr.toLowerCase().endsWith('.pdf');
      const result = await (isPdf ? ocrllm.pdf(urlStr) : ocrllm.image(urlStr));
      if (isPdf) {
        results.push(...(result as PageResult[]));
      } else {
        results.push(result as ImageResult);
      }
    }

    return NextResponse.json({results});
  } catch (error) {
    console.error('Failed to process images:', error);
    return NextResponse.json(
      {error: 'Failed to process images'},
      {status: 500},
    );
  }
}
