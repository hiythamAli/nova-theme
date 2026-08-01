import { defineConfig } from 'vite';
import { resolve } from 'path';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

/**
 * NOVA Theme — Vite Build Configuration
 *
 * Salla's Twilight engine ships with Webpack by default, but explicitly allows
 * any other static module bundler (see "Develop a Theme" — Twilight Docs).
 * Vite is used here for faster builds; output paths match what src/views/layouts/
 * master.twig references via the `asset()` Twig filter (dist/main.js, dist/main.css).
 */
export default defineConfig({
  root: '.',
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2020',
    sourcemap: false,
    minify: 'esbuild',
    cssCodeSplit: false,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/scripts/main.ts'),
        home: resolve(__dirname, 'src/scripts/pages/home.ts'),
        listing: resolve(__dirname, 'src/scripts/pages/listing.ts'),
        product: resolve(__dirname, 'src/scripts/pages/product.ts'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name].[hash].js',
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name ?? '';
          if (name.endsWith('.css')) return 'main[extname]';
          if (/\.(woff2?|ttf|otf)$/.test(name)) return 'fonts/[name][extname]';
          if (/\.(png|jpe?g|webp|avif|svg)$/.test(name)) return 'images/[name][extname]';
          return '[name][extname]';
        },
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
  resolve: {
    alias: {
      '@components': resolve(__dirname, 'src/scripts/components'),
      '@hooks': resolve(__dirname, 'src/scripts/hooks'),
      '@services': resolve(__dirname, 'src/scripts/services'),
      '@utils': resolve(__dirname, 'src/scripts/utils'),
      '@config': resolve(__dirname, 'src/scripts/config'),
      '@types': resolve(__dirname, 'src/scripts/types'),
      '@styles': resolve(__dirname, 'src/assets/styles'),
    },
  },
  plugins: [
    ViteImageOptimizer({
      png: { quality: 80 },
      jpeg: { quality: 80 },
      webp: { quality: 80 },
      avif: { quality: 70 },
    }),
  ],
});
