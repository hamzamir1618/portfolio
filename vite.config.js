import { defineConfig } from 'vite';

// Served from https://hamzamir1618.github.io/portfolio/
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/portfolio/' : '/',
  build: { assetsInlineLimit: 0 },
});
