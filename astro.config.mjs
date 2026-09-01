import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  integrations: [mdx(), sitemap()],
  site: 'https://formray.github.io',
  base: '/software-engineering-3.0',
  // Nota: Astro antepone `base` alla rotta sorgente ma NON alla destinazione,
  // quindi le destinazioni portano il base path esplicito.
  redirects: {
    '/articles/claude-code-vs-cursor-comparison': '/software-engineering-3.0/guides/claude-code-vs-cursor-2026',
    '/articles/ai-developer-roadmap-2026': '/software-engineering-3.0/',
  },
  markdown: {
    shikiConfig: {
      theme: 'vesper',
    },
  },
});
