export type ThemeId = 'parchment' | 'holo' | 'verdant';
export type RulesetId = 'emberveil' | 'neon-hollows' | 'example-voyagers';
export type CardType = 'omen' | 'hazard' | 'boon' | 'ritual' | 'asset' | 'event';
export type CardSizeId = 'poker' | 'mini-board' | 'token';
export type DiceMode = 'advantage' | 'neutral' | 'risk';

export type ActivityEntry = {
  id: string;
  label: string;
  detail: string;
};

export type DiceFace = 4 | 6 | 8 | 10 | 12 | 20 | 100;

export type DiceProfile = {
  id: string;
  label: string;
  notation: string;
  faces: DiceFace;
  defaultMode: DiceMode;
  modes: DiceMode[];
  successTarget?: number;
  criticalTarget?: number;
};

export type DiceRollResult = {
  notation: string;
  mode: DiceMode;
  rolls: number[];
  total: number;
  label: string;
};

export type CardEffect = {
  progress?: number;
  danger?: number;
  ward?: boolean;
  rollTarget?: number;
  rollProgress?: number;
  rollDanger?: number;
  preparedProgress?: number;
  stableProgress?: number;
  dangerRelief?: number;
};

export type DeckCardDefinition = {
  id: string;
  title: string;
  type: CardType;
  subtitle: string;
  rarity: 'common' | 'rare' | 'mythic';
  icon: string;
  feature: string;
  rulesText: string;
  artDirection: string;
  accent: string;
  effect?: CardEffect;
};

export type DeckDefinition = {
  id: string;
  name: string;
  description: string;
  cardBack: string;
  defaultSize: CardSizeId;
  cards: DeckCardDefinition[];
};

export type ZoneDefinition = {
  id: string;
  label: string;
  role: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type CounterDefinition = {
  id: 'progress' | 'danger' | 'ward';
  label: string;
  max: number;
  tone: 'warm' | 'threat' | 'cool';
};

export type RulesetAction = {
  id: string;
  label: string;
  detail: string;
  kind: 'draw' | 'roll' | 'cycle-dice' | 'reset';
};

export type RulesetTerminology = {
  progress: string;
  danger: string;
  deck: string;
  discard: string;
  table: string;
  ward: string;
};

export type RulesetAssetPack = {
  iconSet: string;
  cardBacks: Record<string, string>;
  tokenIcons: Record<string, string>;
  textureHints: string[];
};

export type RulesetVisualTheme = {
  themeId: ThemeId;
  accent: string;
  tableFelt: string;
  cardStock: string;
  glow: string;
};

export type RulesetModule = {
  id: string;
  label: string;
  status: 'ready' | 'scaffold' | 'planned';
  description: string;
};

export type RulesetManifest = {
  id: RulesetId;
  name: string;
  tagline: string;
  summary: string;
  objective: string;
  terminology: RulesetTerminology;
  dice: DiceProfile[];
  decks: DeckDefinition[];
  zones: ZoneDefinition[];
  counters: CounterDefinition[];
  assets: RulesetAssetPack;
  visualTheme: RulesetVisualTheme;
  modules: RulesetModule[];
  actions: RulesetAction[];
};

export type CardSpec = {
  sizeId: CardSizeId;
  widthPx: number;
  heightPx: number;
  widthMm: number;
  heightMm: number;
  purpose: string;
};

export type RuleSection = {
  title: string;
  body: string;
};

export type DemoRules = {
  winCondition: string;
  lossCondition: string;
  turnStructure: string[];
  cardSpecs: CardSpec[];
  cardTypeGuide: Array<{
    type: CardType;
    role: string;
    function: string;
    quantity: string;
  }>;
  sections: RuleSection[];
};

export type SessionSnapshot = {
  theme: ThemeId;
  rulesetId: RulesetId;
  diceProfileId: string;
  diceMode: DiceMode;
  deckCount: number;
  ritualProgress: number;
  dangerLevel: number;
  scenePulse: number;
  timestamp: string;
};

export type SaveSlot = {
  id: string;
  label: string;
  snapshot: SessionSnapshot | null;
};
