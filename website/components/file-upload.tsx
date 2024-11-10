'use client';

import {ChangeEvent, FormEvent, useRef, useState} from 'react';

import {Loader2, UploadIcon} from 'lucide-react';
import {pdfto} from 'ocr-llm/browser';
import {toast} from 'sonner';

import {Button} from './ui/button';
import {Input} from './ui/input';

type FileUploadProps = {
  onUpload: (urls: string | string[]) => void;
};

const FileUpload = ({onUpload}: FileUploadProps) => {
  const [url, setUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isConverting, setIsConverting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (url) {
      try {
        setUrl('');
        setIsConverting(true);
        if (url.toLowerCase().endsWith('.pdf')) {
          const urls = (await pdfto.images(url, {
            output: 'dataurl',
          })) as string[];
          if (urls.length >= 25) {
            toast.error(
              'PDF must be less than 25 pages. Please try again with a shorter document.',
            );
          } else {
            onUpload(urls);
          }
        } else {
          onUpload(url);
        }
      } catch (error) {
        setUrl('');
      } finally {
        setIsConverting(false);
      }
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsConverting(true);

    if (file.type === 'application/pdf') {
      const urls = (await pdfto.images(file, {
        output: 'dataurl',
      })) as string[];
      if (urls.length >= 25) {
        toast.error(
          'PDF must be less than 25 pages. Please try again with a shorter document.',
        );
      } else {
        onUpload(urls);
      }
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        onUpload(dataUrl);
      };
      reader.readAsDataURL(file);
    }

    setIsConverting(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col w-full items-center gap-4 mt-10">
      <div className="flex w-full max-w-lg gap-2">
        <Input
          placeholder="Enter image or PDF URL"
          value={url}
          onChange={e => setUrl(e.target.value)}
        />
        <Button type="submit" disabled={!url || isConverting}>
          {isConverting && <Loader2 className="size-4 animate-spin" />}
          {isConverting ? 'Rendering' : 'Submit'}
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
          disabled={isConverting}
          onClick={() => fileInputRef.current?.click()}>
          {isConverting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <UploadIcon className="size-4" />
          )}
          {isConverting ? 'Rendering' : 'Upload File'}
        </Button>
      </div>
    </form>
  );
};

export default FileUpload;
