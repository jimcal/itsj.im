import type { CollectionEntry } from 'astro:content';
import { absoluteUrl } from './site';
import { marketPath, postPath, yesPercent } from './format';

function roleLine(role: { title: string; org: string }): string {
  return `${role.title} at ${role.org}`;
}

export function renderLlms(
  about: CollectionEntry<'about'>,
  markets: CollectionEntry<'markets'>[],
  posts: CollectionEntry<'writing'>[],
): string {
  const lines = [
    `# ${about.data.name}`,
    '',
    `> ${about.data.positioning} ${about.data.location}.`,
    '',
    "Personal site. Markets are opinion prompts with a seed yes-probability. They are not a live exchange, not tradable, and not financial advice. Votes are stored in the browser only. Entries marked example are placeholders and are not Jim's views.",
    '',
    '## About',
    '',
    `- [About](${absoluteUrl('/about')}): ${about.data.location}. ${about.data.roles.map(roleLine).join('; ')}. Talk "${about.data.talk.title}" at ${about.data.talk.event}.`,
    '',
    '## Markets',
    '',
  ];

  for (const market of markets) {
    const flag = market.data.example ? ' Example.' : '';
    const resolution =
      market.data.status === 'resolved' && market.data.resolution
        ? ` Resolution: ${market.data.resolution}`
        : '';
    lines.push(
      `- [${market.data.title}](${absoluteUrl(marketPath(market.id))}): ${market.data.thesis} Status ${market.data.status}. Seed yes ${yesPercent(market.data.yesProbability)}%.${flag}${resolution}`,
    );
  }

  lines.push('', '## Writing', '');

  if (posts.length === 0) {
    lines.push('- No posts yet.');
  }

  for (const post of posts) {
    const flag = post.data.example ? ' Example.' : '';
    lines.push(
      `- [${post.data.title}](${absoluteUrl(postPath(post.id))}): ${post.data.description}${flag}`,
    );
  }

  lines.push('', '## Optional', '');
  lines.push(
    `- [Full text](${absoluteUrl('/llms-full.txt')}): About, markets, and writing in one file.`,
  );
  lines.push(`- [RSS](${absoluteUrl('/rss.xml')}): Writing feed.`);

  for (const link of about.data.links) {
    lines.push(`- [${link.label}](${link.href})`);
  }

  lines.push('');
  return lines.join('\n');
}

export function renderLlmsFull(
  about: CollectionEntry<'about'>,
  markets: CollectionEntry<'markets'>[],
  posts: CollectionEntry<'writing'>[],
): string {
  const parts: string[] = [
    `# ${about.data.name}`,
    '',
    about.data.positioning,
    '',
    `Location: ${about.data.location}`,
    '',
    ...about.data.roles.map(
      (role) => `- ${role.title} — ${role.org}${role.url ? ` (${role.url})` : ''}`,
    ),
    '',
    `Talk: "${about.data.talk.title}" at ${about.data.talk.event} (${about.data.talk.url})`,
    '',
    about.body?.trim() ?? '',
    '',
  ];

  for (const market of markets) {
    parts.push(
      `# ${market.data.title}`,
      '',
      `URL: ${absoluteUrl(marketPath(market.id))}`,
      `Status: ${market.data.status}`,
      `Seed yes probability: ${yesPercent(market.data.yesProbability)}%`,
      `Example: ${market.data.example ? 'yes' : 'no'}`,
      '',
      market.data.thesis,
      '',
    );
    if (market.data.status === 'resolved' && market.data.resolution) {
      parts.push(`Resolution: ${market.data.resolution}`, '');
    }
    parts.push(market.body?.trim() ?? '', '');
  }

  for (const post of posts) {
    parts.push(
      `# ${post.data.title}`,
      '',
      `URL: ${absoluteUrl(postPath(post.id))}`,
      `Published: ${post.data.publishedAt.toISOString().slice(0, 10)}`,
      `Example: ${post.data.example ? 'yes' : 'no'}`,
      '',
      post.data.description,
      '',
      post.body?.trim() ?? '',
      '',
    );
  }

  return parts.join('\n').replace(/\n{3,}/g, '\n\n');
}
