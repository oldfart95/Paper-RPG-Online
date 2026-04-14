export type ThemeId = 'parchment' | 'holo';

export type ActivityEntry = {
  id: string;
  label: string;
  detail: string;
};

export type SurfaceCard = {
  id: string;
  title: string;
  x: number;
  y: number;
  rotation: number;
  accent: number;
};

export type SurfaceToken = {
  id: string;
  label: string;
  x: number;
  y: number;
  color: number;
};

export type DiceMode = 'advantage' | 'neutral' | 'risk';
