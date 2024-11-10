# OcrLLM

Fast, ultra-accurate text extraction from any image or PDF—including challenging ones—with structured Markdown output powered by vision models.

## Features

- 🔮 Extracts text from any image or PDF, even low-quality ones
- ✨ Outputs clean Markdown
- 🎨 Handles tables, equations, handwriting, complex layouts, etc.
- 🚄 Processes multiple pages in parallel
- 🎯 Retries failed extractions automatically
- 🖋️ Recognizes any font or writing style
- ⚡ Caches results for faster reprocessing

## Table of Contents

- [Features](#features)
- [Table of Contents](#table-of-contents)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
    - [macOS](#macos)
    - [Windows](#windows)
    - [Linux](#linux)
  - [Installing OcrLLM](#installing-ocrllm)
- [Quick Start](#quick-start)
- [Input Sources](#input-sources)
- [API Reference](#api-reference)
  - [`OcrLLM` Class](#ocrllm-class)
    - [`new OcrLLM(config)`](#new-ocrllmconfig)
  - [Image Processing](#image-processing)
    - [`ocrllm.image(input)`](#ocrllmimageinput)
  - [PDF Processing](#pdf-processing)
    - [`ocrllm.pdf(input)`](#ocrllmpdfinput)
    - [`ocrllm.pdfImages(inputs)`](#ocrllmpdfimagesinputs)
- [Error Handling](#error-handling)
- [Used Models](#used-models)
- [Browser-Specific Implementation](#browser-specific-implementation)
  - [`pdfto.images` API Reference](#pdftoimages-api-reference)
  - [Limitations](#limitations)
- [Contributing](#contributing)

## Installation

### Prerequisites

OcrLLM requires **GraphicsMagick** and **Ghostscript** for PDF processing. These dependencies are typically installed automatically when you install the package, especially on macOS. However, if the automatic installation fails, you may need to install them manually.

To verify that they are installed, run the following commands:

For **GraphicsMagick**:

```bash
gm version
```

For **Ghostscript**:

```bash
gs -version
```

If these commands return errors, you can install the dependencies using the following methods:

#### macOS

```bash
brew install graphicsmagick ghostscript
```

#### Windows

Download and install the following:

- [GraphicsMagick](http://www.graphicsmagick.org/)
- [Ghostscript](https://www.ghostscript.com/download/gsdnld.html)

Ensure that both executables are added to your system's `PATH` environment variable.

#### Linux

```bash
sudo apt-get update && sudo apt-get install -y graphicsmagick ghostscript
```

These are the most common installation methods, but feel free to install GraphicsMagick and Ghostscript in any way that suits you best. The important thing is to ensure that both are successfully installed on your system.

### Installing OcrLLM

Install the `ocr-llm` package via npm:

```bash
npm install ocr-llm
```

## Quick Start

```typescript
import {OcrLLM} from 'ocr-llm';

const ocrllm = new OcrLLM({
  provider: 'openai',
  key: 'your-api-key',
});

// Extract text from an image
const imageResult = await ocrllm.image('path/to/image.jpg');
console.log(imageResult.content);

// Process a PDF document
const pdfResults = await ocrllm.pdf('path/to/document.pdf');
pdfResults.forEach(page => {
  console.log(`Page ${page.page}:`, page.content);
});
```

## Input Sources

OcrLLM accepts multiple input formats:

| Input Type     | Example                                                               |
| -------------- | --------------------------------------------------------------------- |
| File paths     | `'/path/to/image.jpg'`, `'C:\\Documents\\scan.pdf'`                   |
| URLs           | `'https://example.com/image.png'`, `'https://files.com/document.pdf'` |
| Base64 strings | `'data:image/jpeg;base64,/9j/4AAQSkZJRg...'`                          |
| Buffer objects | `Buffer.from(imageData)`, `fs.readFileSync('image.jpg')`              |

## API Reference

### `OcrLLM` Class

#### `new OcrLLM(config)`

Creates a new instance of OcrLLM.

- **Parameters**:
  - `config` (Object):
    - `provider` (string): OCR provider (currently only `'openai'` is supported)
    - `key` (string): API key for the provider
- **Returns**: `OcrLLM` instance

### Image Processing

#### `ocrllm.image(input)`

Processes a single image.

- **Parameters**:
  - `input` (string | Buffer): File path, URL, base64 string, or Buffer
- **Returns**: `Promise<ImageResult>`
  - **ImageResult**:
    - `content` (string): Extracted text in Markdown format
    - `metadata` (Object): Processing metadata

### PDF Processing

#### `ocrllm.pdf(input)`

Processes a PDF document.

- **Parameters**:
  - `input` (string | Buffer): File path, URL, base64 string, or Buffer
- **Returns**: `Promise<PageResult[]>`
  - **PageResult**:
    - `page` (number): Page number
    - `content` (string): Extracted text in Markdown format
    - `metadata` (Object): Processing metadata

#### `ocrllm.pdfImages(inputs)`

Processes multiple PDF page images.

- **Parameters**:
  - `inputs` (Array<string | Buffer>): Array of image URLs, base64 strings, or Buffers
- **Returns**: `Promise<PageResult[]>`
  - **PageResult**:
    - `page` (number): Page number
    - `content` (string): Extracted text in Markdown format
    - `metadata` (Object): Processing metadata

## Error Handling

OcrLLM includes built-in error handling with detailed error messages and automatic retries for transient failures.

```typescript
try {
  const result = await ocrllm.image('path/to/image.jpg');
} catch (error) {
  console.error('Processing failed:', error.message);
}
```

## Used Models

OcrLLM uses the following model:

| Provider | Model         | Description                                                                                       |
| -------- | ------------- | ------------------------------------------------------------------------------------------------- |
| OpenAI   | `gpt-4o-mini` | High-performance model optimized for efficient text extraction with excellent accuracy and speed. |

## Browser-Specific Implementation

When using OcrLLM in serverless environments like Vercel (for example, when hosting a Next.js application that implements text extraction in an API route handler), the core library's PDF processing requires system-level dependencies (GraphicsMagick, Ghostscript) that cannot be installed. However, OcrLLM provides a browser-specific implementation that can handle the PDF-to-image conversion step directly in the browser.

By using the browser package for PDF conversion and the main OcrLLM package for text extraction, you can maintain full functionality without needing system dependencies on your server. This hybrid approach gives you the best of both worlds: client-side PDF handling and server-side OCR processing.

First, convert the PDF to images in the browser:

```typescript
import {pdfto} from 'ocr-llm/browser';

const dataUrls = await pdfto.images(pdfFile, {
  output: 'dataurl',
});
```

Then, send the image data URLs to your API and process them:

```typescript
import {OcrLLM} from 'ocr-llm';

const ocrllm = new OcrLLM({
  provider: 'openai',
  key: 'your-api-key',
});

const results = await ocrllm.pdfImages(dataUrls);
results.forEach(page => {
  console.log(`Page ${page.page}:`, page.content);
});
```

### `pdfto.images` API Reference

```typescript
pdfto.images(pdfFile, options);
```

### Limitations

- Remember that we are sending the data URL of each PDF page as an array to the API or Next.js API route handler. When hosting on providers like Vercel, processing PDFs with more than 25 pages (depending on the content size of each page) may trigger a `FUNCTION_PAYLOAD_TOO_LARGE` error due to their 4.5MB function body size limit. Similar limitations may exist on other hosting platforms.

**Parameters**:

- `pdfFile`: The PDF file as a `File` object.
- `options` (optional):
  - `format` (string): Output image format. Options are `'png'` or `'jpg'`. Default is `'png'`.
  - `scale` (number): Scale factor for the output images. Increase for better quality. Default is `1.0`.
  - `pages` (string | number | number[] | object): Page selection. Options are `'all'`, `'first'`, `'last'`, a page number, an array of page numbers, or an object `{ start?: number, end?: number }`. Default is `'all'`.
  - `output` (string): Output format. Options are `'buffer'`, `'base64'`, `'blob'`, or `'dataurl'`. Default is `'base64'`.
  - `docParams` (object): Additional PDF document parameters.

**Returns**: `Promise<string[]>` - An array of image data in the specified output format.

**Example Usage with Options**:

```typescript
const urls = await pdfto.images(pdfFile, {
  format: 'png',
  scale: 2.0,
  pages: {start: 1, end: 5},
  output: 'dataurl',
});
```

## Contributing

We welcome contributions from the community to enhance OcrLLM's capabilities and make it even more powerful. ❤️

For guidelines on contributing, please read the [Contributing Guide](https://github.com/arshad-yaseen/ocr-llm/blob/main/CONTRIBUTING.md).
