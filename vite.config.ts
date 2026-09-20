import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  define: {
    __BUILD_TIMESTAMP__: JSON.stringify(new Date().toISOString())
  }
});
