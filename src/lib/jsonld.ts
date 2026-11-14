import type { CollectionEntry } from 'astro:content';
import { absoluteUrl } from './site';
import { yesPercent } from './format';

const PERSON_ID = 'https://itsj.im/#jim';

export function graph(nodes: Record<string, unknown>[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes,
  };
}

export function personNode(about: CollectionEntry<'about'>): Record<string, unknown> {
  const employer = about.data.roles.find((role) => role.org === about.data.worksFor);
  const affiliations = about.data.roles.filter((role) => role.org !== about.data.worksFor);

  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: about.data.name,
    url: absoluteUrl('/'),
    image: absoluteUrl(about.data.photo),
    jobTitle: about.data.jobTitle,
    description: about.data.positioning,
    homeLocation: {
      '@type': 'Place',
      name: about.data.location,
      address: {
        '@type': 'PostalAddress',
        addressLocality: about.data.location,
        addressCountry: 'US',
      },
    },
    worksFor: {
      '@type': 'Organization',
      name: about.data.worksFor,
      url: employer?.url,
    },
    affiliation: affiliations.map((role) => ({
      '@type': 'Organization',
      name: role.org,
      url: role.url,
    })),
    subjectOf: {
      '@type': 'PresentationDigitalDocument',
      name: about.data.talk.title,
      description: `Talk at ${about.data.talk.event}`,
      url: about.data.talk.url,
    },
    sameAs: about.data.links.filter((link) => link.rel === 'me').map((link) => link.href),
  };
}

export function websiteNode(about: CollectionEntry<'about'>): Record<string, unknown> {
  return {
    '@type': 'WebSite',
    '@id': 'https://itsj.im/#website',
    url: absoluteUrl('/'),
    name: about.data.name,
    description: about.data.positioning,
    inLanguage: 'en',
    publisher: { '@id': PERSON_ID },
  };
}

export function blogPostingNode(
  post: CollectionEntry<'writing'>,
  about: CollectionEntry<'about'>,
): Record<string, unknown> {
  const url = absoluteUrl(`/writing/${post.id}`);
  return {
    '@type': 'BlogPosting',
    '@id': `${url}#post`,
    mainEntityOfPage: url,
    headline: post.data.title,
    description: post.data.description,
    datePublished: post.data.publishedAt.toISOString(),
    dateModified: (post.data.updatedAt ?? post.data.publishedAt).toISOString(),
    inLanguage: 'en',
    image: absoluteUrl(about.data.photo),
    author: { '@id': PERSON_ID },
    publisher: { '@id': PERSON_ID },
    url,
  };
}

export function questionNode(market: CollectionEntry<'markets'>): Record<string, unknown> {
  const url = absoluteUrl(`/markets/${market.id}`);
  const node: Record<string, unknown> = {
    '@type': 'Question',
    '@id': `${url}#question`,
    name: market.data.title,
    text: market.data.thesis,
    url,
    dateCreated: market.data.publishedAt.toISOString(),
    author: { '@id': PERSON_ID },
    description: [
      market.data.thesis,
      `Seed yes probability ${yesPercent(market.data.yesProbability)}%.`,
      'Not a live or tradable market.',
      market.data.example ? 'Example content.' : '',
    ]
      .filter(Boolean)
      .join(' '),
  };

  if (market.data.status === 'resolved' && market.data.resolution) {
    node.acceptedAnswer = {
      '@type': 'Answer',
      text: market.data.resolution,
    };
  }

  return node;
}
