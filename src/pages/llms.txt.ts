import type { APIRoute } from 'astro';
import { getAbout, getMarkets, getPosts } from '../lib/content';
import { renderLlms } from '../lib/llms';

export const GET: APIRoute = async () => {
  const [about, markets, posts] = await Promise.all([getAbout(), getMarkets(), getPosts()]);
  return new Response(renderLlms(about, markets, posts), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
