'use client';

import {ChangeEvent, FormEvent, useRef, useState} from 'react';

import {UploadIcon} from 'lucide-react';
import {pdfto} from 'ocr-llm/browser';

import {Button} from './ui/button';
import {Input} from './ui/input';

type FileUploadProps = {
  onUpload: (urls: string | string[]) => void;
};

const FileUpload = ({onUpload}: FileUploadProps) => {
  const [url, setUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (url) {
      onUpload(url);
      setUrl('');
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const urls = (await pdfto.images(file, {
      output: 'dataurl',
    })) as string[];

    console.log(urls);

    onUpload(urls);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center gap-4 mt-10">
      <div className="flex w-full max-w-lg gap-2">
        <Input
          placeholder="Enter image or PDF URL"
          value={url}
          onChange={e => setUrl(e.target.value)}
        />
        <Button type="submit" disabled={!url}>
          Submit
        </Button>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-neutral-500">or</div>
        <Input
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <Button
          type="button"
          variant="outline"
          className="gap-2"
          onClick={() => fileInputRef.current?.click()}>
          <UploadIcon className="size-4" />
          Upload File
        </Button>
      </div>
    </form>
  );
};

export default FileUpload;
