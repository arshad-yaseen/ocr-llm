import {defineConfig} from 'tsup';

export default defineConfig({
  outDir: 'build',
  entry: ['src/index.ts'],
  target: 'es2021',
  minify: true,
  format: ['esm', 'cjs'],
  clean: true,
  dts: true,
  external: ['openai', 'sharp', 'pdf2pic', 'pdf-lib', 'p-limit'],
});
