import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        dormWalk: resolve(__dirname, 'dorm-walk.html'),
        auditLog: resolve(__dirname, 'audit-log.html'),
        assessments: resolve(__dirname, 'assessments.html'),
      },
    },
  },
});
