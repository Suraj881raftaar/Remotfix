import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig} from 'vite';

function copyRootHeadersPlugin() {
  return {
    name: 'copy-root-headers',
    closeBundle() {
      const src = path.resolve(__dirname, '_headers');
      const destDir = path.resolve(__dirname, 'dist');
      const dest = path.resolve(destDir, '_headers');
      if (fs.existsSync(src) && fs.existsSync(destDir)) {
        fs.copyFileSync(src, dest);
      }
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), copyRootHeadersPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
