'use client';

import {ChangeEvent, FormEvent, useRef, useState} from 'react';

import {Loader2, UploadIcon} from 'lucide-react';
import pdfToImages from 'pdf-to-images-browser';
import {toast} from 'sonner';

import {Button} from './ui/button';
import {Input} from './ui/input';

type FileUploadProps = {
  onUpload: (formData: FormData) => void;
};

const FileUpload = ({onUpload}: FileUploadProps) => {
  const [url, setUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isConverting, setIsConverting] = useState(false);

  const handleConvert = async ({
    pdfFile,
    url,
  }: {
    pdfFile?: File;
    url?: string;
  }) => {
    try {
      setIsConverting(true);
      if (!pdfFile) {
        toast.error('No file found');
        return;
      }

      let images: Blob[] = [];
      if (pdfFile) {
        images = (await pdfToImages(pdfFile, {
          output: 'blob',
        })) as Blob[];
      }

      const formData = new FormData();
      images.forEach((image, index) => {
        formData.append('images', image as Blob, `page-${index + 1}.png`);
      });

      if (url) {
        formData.append('url', url);
      }

      onUpload(formData);
    } catch (error) {
      toast.error('Error processing PDF');
    } finally {
      setIsConverting(false);
    }
  };

  const handleUrlSubmit = async (e: FormEvent) => {
    e.preventDefault();
    handleConvert({url});
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUrl('');
    const file = e.target.files?.[0];
    if (file) {
      handleConvert({pdfFile: file});
    }
  };

  return (
    <form
      onSubmit={handleUrlSubmit}
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
