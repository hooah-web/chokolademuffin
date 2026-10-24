import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://chokolademuffin.dk',
  trailingSlash: 'always',
  build: { format: 'directory' },
  compressHTML: true,
});
