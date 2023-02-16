/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { defineConfig } from 'astro/config';
import svelte from "@astrojs/svelte";
import cloudflare from "@astrojs/cloudflare";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  output: 'server',
  integrations: [svelte(), react()],
  adapter: cloudflare(),
  vite: {
    define: {
      "process.env.UPSTASH_REDIS_REST_URL": JSON.stringify(process.env.UPSTASH_REDIS_REST_URL),
      "process.env.UPSTASH_REDIS_REST_TOKEN": JSON.stringify(process.env.UPSTASH_REDIS_REST_TOKEN)
    }
  }
});