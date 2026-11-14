import { getCollection, type CollectionEntry } from 'astro:content';

function isPublic(draft: boolean | undefined): boolean {
  return import.meta.env.DEV || draft !== true;
}

export async function getAbout(): Promise<CollectionEntry<'about'>> {
  const entries = await getCollection('about');
  if (entries.length !== 1) {
    throw new Error(`Expected exactly one about entry, found ${entries.length}.`);
  }
  const about = entries[0];
  if (!about) throw new Error('Missing about entry.');
  return about;
}

export async function getMarkets(): Promise<CollectionEntry<'markets'>[]> {
  const markets = await getCollection('markets', ({ data }) => isPublic(data.draft));
  return markets.sort((a, b) => {
    const byDate = b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf();
    if (byDate !== 0) return byDate;
    return a.id.localeCompare(b.id);
  });
}

export async function getFeaturedMarkets(limit = 3): Promise<CollectionEntry<'markets'>[]> {
  const markets = await getMarkets();
  return markets.filter((market) => market.data.featured).slice(0, limit);
}

export async function getPosts(): Promise<CollectionEntry<'writing'>[]> {
  const posts = await getCollection('writing', ({ data }) => isPublic(data.draft));
  return posts.sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());
}
