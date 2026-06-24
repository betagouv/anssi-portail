import svelte from '@astrojs/svelte';
import { defineConfig } from 'astro/config';

export default defineConfig({
  integrations: [svelte()],
  output: 'server',
  vite: {
    server: {
      hmr: {
        clientPort: 3000,
        port: 4321,
      },
    },
  },
});
