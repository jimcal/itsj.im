export const SKIN_STORAGE_KEY = 'itsjim:skin';
export const DEFAULT_SKIN = 'default';

export const SKINS = [
  { id: 'default', label: 'Clean', themeColor: '#f7f4ee' },
  { id: 'polymarket', label: 'Polymarket', themeColor: '#0e1218' },
] as const;

export type SkinId = (typeof SKINS)[number]['id'];

export function isSkinId(value: string | null | undefined): value is SkinId {
  return SKINS.some((skin) => skin.id === value);
}
