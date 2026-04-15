import type { ThemeId } from '../core/types';

export const themes: Record<
  ThemeId,
  {
    name: string;
    surfaceGradient: string;
    panelClass: string;
    hue: string;
  }
> = {
  parchment: {
    name: 'Parchment Arcana',
    surfaceGradient:
      'radial-gradient(circle at top, rgba(214, 183, 126, 0.22), transparent 34%), linear-gradient(145deg, #231a12, #0f0b08)',
    panelClass: 'theme-parchment',
    hue: '#d8b77f',
  },
  holo: {
    name: 'Signal Holo',
    surfaceGradient:
      'radial-gradient(circle at top, rgba(58, 226, 197, 0.18), transparent 30%), linear-gradient(160deg, #06131d, #02060a)',
    panelClass: 'theme-holo',
    hue: '#55e6d8',
  },
  verdant: {
    name: 'Verdant Expedition',
    surfaceGradient:
      'radial-gradient(circle at top, rgba(118, 198, 127, 0.16), transparent 31%), linear-gradient(155deg, #102018, #070b08)',
    panelClass: 'theme-verdant',
    hue: '#9bd486',
  },
};
