export function yesPercent(probability: number): number {
  return Math.round(probability * 100);
}

export function noPercent(probability: number): number {
  return 100 - yesPercent(probability);
}

export function marketPath(id: string): string {
  return `/markets/${id}`;
}

export function postPath(id: string): string {
  return `/writing/${id}`;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function exampleDescription(example: boolean, text: string): string {
  return example ? `Example. ${text}` : text;
}

export function exampleTitle(example: boolean, title: string): string {
  return example ? `Example: ${title}` : title;
}
