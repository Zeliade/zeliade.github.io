import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.zeliade.com',
  // Emits /team/index.html rather than /team.html, so every legacy URL
  // (/zqf/, /whitepapers/, /contact-us/, ...) resolves exactly as before.
  trailingSlash: 'always',
  build: { format: 'directory' },
  compressHTML: true,
  integrations: [sitemap()],
});
