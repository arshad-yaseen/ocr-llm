'use client';

import {useState} from 'react';

import FileUpload from '@/components/file-upload';
import {Button} from '@/components/ui/button';
import {cn} from '@/lib/utils';
import {motion} from 'framer-motion';
import {ImageResult, PageResult} from 'ocr-llm';
import Markdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

const Preview = ({url, type}: {url: string; type: 'image' | 'pdf'}) => (
  <div className="h-full w-full overflow-auto">
    <div className="min-h-full w-full flex items-center justify-center p-4">
      {type === 'image' ? (
        <img
          src={url}
          alt="Preview"
          className="max-h-full max-w-full object-contain rounded-lg shadow-sm"
        />
      ) : (
        <object
          data={url}
          className="w-full h-full rounded-lg border-0 shadow-sm"
          type="application/pdf"
          aria-label="PDF preview">
          <p>PDF preview is not available.</p>
        </object>
      )}
    </div>
  </div>
);

const SkeletonLoader = () => (
  <div className="p-4 space-y-4">
    {[...Array(15)].map((_, i) => (
      <motion.div
        key={i}
        className="flex items-center space-x-2"
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        transition={{
          delay: i * 0.2,
          duration: 0.8,
          ease: [0.34, 1.56, 0.64, 1],
        }}>
        <motion.div
          className="h-4 bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 rounded-sm"
          style={{width: `${Math.random() * 20 + 40}%`}}
          animate={{
            opacity: [0.8, 0.4, 0.8],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="h-4 bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 rounded-sm"
          style={{width: `${Math.random() * 20 + 30}%`}}
          animate={{
            opacity: [0.8, 0.4, 0.8],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.2,
          }}
        />
      </motion.div>
    ))}
  </div>
);

const ContentDisplay = ({
  contents,
  isLoading,
}: {
  contents: PageResult[] | ImageResult[];
  isLoading: boolean;
}) => {
  if (isLoading) {
    return (
      <div className="h-full overflow-auto">
        <SkeletonLoader />
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto">
      <div className="p-4 space-y-6">
        {contents?.map((content, i) => (
          <div key={i} className="border-b pb-4 mb-4 last:border-b-0">
            {'page' in content && (
              <div className="text-sm text-neutral-500 mb-2">
                Page {content.page}
              </div>
            )}
            <Markdown
              className="prose max-w-none"
              remarkPlugins={[remarkMath, remarkGfm]}
              rehypePlugins={[rehypeKatex]}
              components={{
                table: ({
                  className,
                  ...props
                }: React.HTMLAttributes<HTMLTableElement>) => (
                  <div className="w-full overflow-hidden rounded-lg border border-neutral-200">
                    <table
                      className={cn('w-full !my-0', className)}
                      {...props}
                    />
                  </div>
                ),
                tr: ({
                  className,
                  ...props
                }: React.HTMLAttributes<HTMLTableRowElement>) => (
                  <tr className={cn('m-0  p-0', className)} {...props} />
                ),
                th: ({className, ...props}) => (
                  <th
                    className={cn(
                      ' px-4 py-2 text-left font-semibold  [&[align=center]]:text-center [&[align=right]]:text-right',
                      className,
                    )}
                    {...props}
                  />
                ),
                td: ({className, ...props}) => (
                  <td
                    className={cn(
                      'border-t px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right',
                      className,
                    )}
                    {...props}
                  />
                ),
              }}>
              {content.content}
            </Markdown>
          </div>
        ))}
      </div>
    </div>
  );
};

const Landing = ({onUpload}: {onUpload: (url: string | string[]) => void}) => (
  <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 sm:px-8 md:px-12 lg:px-20 bg-neutral-50">
    <div className="max-w-3xl w-full space-y-10">
      <div className="space-y-6 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
          OcrLLM
        </h1>
        <p className="text-lg sm:text-xl text-neutral-500 leading-relaxed max-w-2xl mx-auto">
          Fast, ultra-accurate text extraction from any image or PDF—including
          challenging ones—with structured markdown output powered by vision
          models.
        </p>
      </div>
      <FileUpload onUpload={onUpload} />
    </div>
  </div>
);

export default function Home() {
  const [contents, setContents] = useState<PageResult[] | ImageResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpload = async (url: string | string[]) => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/extract', {
        method: 'POST',
        body: JSON.stringify({url}),
      });

      const {result} = (await response.json()) ?? {};
      setContents(!Array.isArray(result) ? [result] : result);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setContents([]);
    setIsLoading(false);
  };

  if (contents.length > 0) {
    return (
      <div className="flex flex-col h-screen max-h-screen">
        <header className="flex-none flex items-center justify-between px-4 sm:px-6 md:px-8 lg:px-12 gap-6 pt-6">
          <h1 className="text-2xl font-bold">OcrLLM</h1>
          <Button onClick={handleReset} variant="outline">
            Upload New File
          </Button>
        </header>
        <main className="flex-1 min-h-0 px-4 sm:px-6 md:px-8 lg:px-12 py-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            <div className="bg-background rounded-xl border border-neutral-200 overflow-hidden">
              <ContentDisplay contents={contents} isLoading={isLoading} />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return <Landing onUpload={handleUpload} />;
}
