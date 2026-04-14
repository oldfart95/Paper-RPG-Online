export type ThemeId = 'parchment' | 'holo';
export type RulesetId = 'emberveil' | 'neon-hollows';

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

export type RulesetAction = {
  id: string;
  label: string;
  detail: string;
};

export type RulesetManifest = {
  id: RulesetId;
  name: string;
  tagline: string;
  summary: string;
  supportedDice: string[];
  zoneLabels: string[];
  starterDeck: string;
  themeHint: ThemeId;
  actions: RulesetAction[];
};

export type SessionSnapshot = {
  theme: ThemeId;
  rulesetId: RulesetId;
  diceMode: DiceMode;
  deckCount: number;
  scenePulse: number;
  timestamp: string;
};

export type SaveSlot = {
  id: string;
  label: string;
  snapshot: SessionSnapshot | null;
};
