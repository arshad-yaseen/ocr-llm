import {NextRequest, NextResponse} from 'next/server';

import {ImageResult, OcrLLM, PageResult} from 'ocr-llm';

const ocrllm = new OcrLLM({
  provider: 'openai',
  key: process.env.OPENAI_API_KEY!,
});

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
      const result = await ocrllm.image(url as string);
      results.push(result);
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
