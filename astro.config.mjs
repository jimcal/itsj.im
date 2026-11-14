import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

const unlisted = new Set(['/checkout', '/success', '/cancel', '/404']);

export default defineConfig({
  site: 'https://itsj.im',
  trailingSlash: 'never',
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => {
        const path = new URL(page).pathname.replace(/\/$/, '') || '/';
        return !unlisted.has(path);
      },
    }),
  ],
  redirects: {
    '/home': '/',
    '/canceled': '/cancel',
  },
});
