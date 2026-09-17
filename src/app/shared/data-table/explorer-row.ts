export type Dataset = 'movies' | 'weather';

export interface ExplorerRow {
  id: string;
  name: string;
  subtitle: string;
  image?: string;
  icon?: string;
  year?: number;
  director?: string;
  rating?: number;
  duration?: number;
  temperature?: number | null;
  condition?: string;
  localTime?: string;
}

export function normalizeSearch(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase()
    .trim();
}
