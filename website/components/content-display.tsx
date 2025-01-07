import {cn} from '@/lib/utils';
import type {ImageResult, PageResult} from 'ocr-llm';
import Markdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

export const ContentDisplay = ({
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
