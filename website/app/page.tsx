'use client';

import {useRef, useState} from 'react';
import dynamic from 'next/dynamic';

import {Button} from '@/components/ui/button';
import {cn} from '@/lib/utils';
import {Loader2, XIcon} from 'lucide-react';
import type {ImageResult, PageResult} from 'ocr-llm';
import Markdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import {toast} from 'sonner';

const FileUpload = dynamic(() => import('@/components/file-upload'), {
  ssr: false,
});

const Loader = () => (
  <div className="flex flex-col h-full w-full items-center justify-center gap-4">
    <Loader2 className="size-5 animate-spin" />
    <div className="text-sm text-neutral-600">Extracting text</div>
  </div>
);

const ContentDisplay = ({
  contents,
}: {
  contents: PageResult[] | ImageResult[];
}) => {
  return (
    <div className="h-full overflow-auto">
      <div className="p-8 space-y-6">
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

export default function Home() {
  const [contents, setContents] = useState<PageResult[] | ImageResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleUpload = async (urls: string | string[]) => {
    // Abort any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController for this request
    abortControllerRef.current = new AbortController();
    setIsLoading(true);

    try {
      const response = await fetch('/api/extract', {
        method: 'POST',
        body: JSON.stringify({urls}),
        signal: abortControllerRef.current.signal,
      });

      const {result} = (await response.json()) ?? {};
      setContents(!Array.isArray(result) ? [result] : result);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        setContents([]);
      } else {
        toast.error('Error during extraction');
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleClose = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setContents([]);
  };

  const showContent = isLoading || contents.length > 0;

  return (
    <div className="w-full min-h-screen bg-neutral-50 flex overflow-hidden">
      <div
        className={cn(
          'space-y-10 flex-grow px-4 w-full py-8 sm:px-8 md:px-12 lg:px-20 flex items-center justify-center flex-col h-screen transition-all duration-500',
          {
            'w-1/2': showContent,
          },
        )}>
        <div className="space-y-6 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter">
            OcrLLM
          </h1>
          <p className="text-lg sm:text-xl text-neutral-500 leading-relaxed max-w-2xl mx-auto">
            Fast, ultra-accurate text extraction from any image or PDF—including
            challenging ones—with structured markdown output powered by vision
            models.
          </p>
        </div>
        <FileUpload onUpload={handleUpload} />
      </div>
      <div
        className={cn(
          'flex w-0 transition-all duration-500 h-screen justify-center border-l border-neutral-300 bg-background relative',
          {
            'w-1/2': showContent,
          },
        )}>
        {showContent && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="absolute top-4 right-4 rounded-full"
            aria-label="Close content panel">
            <XIcon className="!size-6" />
          </Button>
        )}
        {isLoading ? <Loader /> : <ContentDisplay contents={contents} />}
      </div>
    </div>
  );
}
