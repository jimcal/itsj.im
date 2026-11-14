import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getAbout, getPosts } from '../lib/content';
import { postPath } from '../lib/format';

export const GET: APIRoute = async (context) => {
  const about = await getAbout();
  const posts = await getPosts();

  return rss({
    title: `${about.data.name} — Writing`,
    description: `Writing by ${about.data.name}. ${about.data.positioning}`,
    site: context.site ?? 'https://itsj.im',
    trailingSlash: false,
    items: posts.map((post) => ({
      title: post.data.example ? `[Example] ${post.data.title}` : post.data.title,
      description: post.data.example ? `Example. ${post.data.description}` : post.data.description,
      pubDate: post.data.publishedAt,
      link: postPath(post.id),
    })),
    customData: '<language>en-us</language>',
  });
};
