export const SITE_URL = 'https://itsj.im';

export function canonicalPath(pathname: string): string {
  if (!pathname || pathname === '/') return '/';
  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
}

export function absoluteUrl(pathname: string): string {
  return new URL(canonicalPath(pathname), SITE_URL).href;
}

export function twitterHandle(links: { href: string; rel?: 'me' }[]): string | undefined {
  const href = links.find((link) => link.rel === 'me' && /(twitter|x)\.com/i.test(link.href))?.href;
  if (!href) return undefined;
  try {
    const handle = new URL(href).pathname.split('/').filter(Boolean)[0];
    return handle ? `@${handle}` : undefined;
  } catch {
    return undefined;
  }
}
