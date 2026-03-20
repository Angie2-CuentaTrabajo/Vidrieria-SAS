export type ThemePaletteId = 'oceano' | 'esmeralda' | 'terracota' | 'grafito';

export type ThemePalette = {
  id: ThemePaletteId;
  name: string;
  description: string;
  accent: string;
  accentSoft: string;
  accentStrong: string;
  accentContrast: string;
  surfaceTint: string;
  heroFrom: string;
  heroVia: string;
  heroTo: string;
};

export const themePalettes: ThemePalette[] = [
  {
    id: 'oceano',
    name: 'Oceano',
    description: 'Azules sobrios para un look moderno y profesional.',
    accent: '#2563eb',
    accentSoft: '#dbeafe',
    accentStrong: '#1d4ed8',
    accentContrast: '#ffffff',
    surfaceTint: '#eff6ff',
    heroFrom: '#0f172a',
    heroVia: '#172554',
    heroTo: '#0c4a6e',
  },
  {
    id: 'esmeralda',
    name: 'Esmeralda',
    description: 'Verdes limpios para una apariencia fresca y comercial.',
    accent: '#059669',
    accentSoft: '#d1fae5',
    accentStrong: '#047857',
    accentContrast: '#ffffff',
    surfaceTint: '#ecfdf5',
    heroFrom: '#052e2b',
    heroVia: '#065f46',
    heroTo: '#0f766e',
  },
  {
    id: 'terracota',
    name: 'Terracota',
    description: 'Tonos calidos con personalidad para una marca cercana.',
    accent: '#c2410c',
    accentSoft: '#ffedd5',
    accentStrong: '#9a3412',
    accentContrast: '#ffffff',
    surfaceTint: '#fff7ed',
    heroFrom: '#431407',
    heroVia: '#9a3412',
    heroTo: '#b45309',
  },
  {
    id: 'grafito',
    name: 'Grafito',
    description: 'Neutro elegante con acento oscuro y serio.',
    accent: '#334155',
    accentSoft: '#e2e8f0',
    accentStrong: '#1e293b',
    accentContrast: '#ffffff',
    surfaceTint: '#f8fafc',
    heroFrom: '#0f172a',
    heroVia: '#1e293b',
    heroTo: '#334155',
  },
];

const STORAGE_KEY = 'vidrieria-theme-palette';

export function getThemePaletteById(id?: string | null) {
  return themePalettes.find((palette) => palette.id === id) || themePalettes[0];
}

export function getStoredThemePalette() {
  if (typeof window === 'undefined') {
    return themePalettes[0];
  }

  return getThemePaletteById(window.localStorage.getItem(STORAGE_KEY));
}

export function applyThemePalette(paletteId: ThemePaletteId) {
  if (typeof document === 'undefined') {
    return;
  }

  document.documentElement.setAttribute('data-theme-palette', paletteId);
  window.localStorage.setItem(STORAGE_KEY, paletteId);
}
