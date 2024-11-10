import type {Metadata} from 'next';
import {DM_Mono, Inter} from 'next/font/google';

import './globals.css';

import {Toaster} from '@/components/ui/sonner';

const fontSans = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
});

const fontMono = DM_Mono({
  variable: '--font-mono',
  weight: '400',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'OcrLLM',
  description:
    'Fast, ultra-accurate text extraction from any image or PDF—including challenging ones—with structured markdown output powered by vision models.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fontSans.variable} ${fontMono.variable} antialiased font-sans`}>
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}
