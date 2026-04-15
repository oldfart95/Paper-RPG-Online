import { emberveilCards } from '../demoGame';
import type { DeckDefinition, RulesetManifest } from '../../core/types';

const signalDeck: DeckDefinition = {
  id: 'signal-cache',
  name: 'Signal Cache',
  description: 'A reskinned deck proving that the shell can swap terminology, visuals, and tone.',
  cardBack: 'neon-card-back',
  defaultSize: 'poker',
  cards: emberveilCards.map((card) => ({
    ...card,
    subtitle: card.type === 'hazard' ? 'Spike' : card.type === 'ritual' ? 'Patch' : card.subtitle,
  })),
};

export const neonHollowsManifest: RulesetManifest = {
  id: 'neon-hollows',
  name: 'Neon Hollows',
  tagline: 'Signal-soaked scavenging with holo markers and tactical deck pressure.',
  summary:
    'A clean sci-fi ruleset variant that keeps the same engine primitives while changing action tone, theme, and zone language.',
  objective: 'Stabilize the signal grid before the cascade consumes the crew lane.',
  terminology: {
    progress: 'Signal',
    danger: 'Cascade',
    deck: 'Signal Cache',
    discard: 'Burn Pile',
    table: 'Signal Grid',
    ward: 'Firewall',
  },
  dice: [
    {
      id: 'signal-d20',
      label: 'Signal d20',
      notation: '1d20',
      faces: 20,
      defaultMode: 'neutral',
      modes: ['advantage', 'neutral', 'risk'],
      successTarget: 12,
      criticalTarget: 20,
    },
  ],
  decks: [signalDeck],
  zones: [
    { id: 'deck', label: 'Cache', role: 'Draw stack', x: 0.08, y: 0.56, width: 0.16, height: 0.28 },
    { id: 'table', label: 'Signal Grid', role: 'Active card and tokens', x: 0.29, y: 0.2, width: 0.42, height: 0.56 },
    { id: 'discard', label: 'Burn Pile', role: 'Discard fan', x: 0.75, y: 0.56, width: 0.17, height: 0.28 },
    { id: 'player', label: 'Crew Lane', role: 'Future crew sheets and tools', x: 0.14, y: 0.82, width: 0.72, height: 0.1 },
  ],
  counters: [
    { id: 'progress', label: 'Signal', max: 7, tone: 'cool' },
    { id: 'danger', label: 'Cascade', max: 5, tone: 'threat' },
    { id: 'ward', label: 'Firewall', max: 1, tone: 'cool' },
  ],
  assets: {
    iconSet: 'holo-crest',
    cardBacks: {
      'neon-card-back': '/assets/card-backs/neon.png',
    },
    tokenIcons: {
      firewall: '/assets/tokens/firewall.png',
      cascade: '/assets/tokens/cascade.png',
      signal: '/assets/tokens/signal.png',
    },
    textureHints: ['smoked acrylic', 'scanline glass', 'cyan edge light'],
  },
  visualTheme: {
    themeId: 'holo',
    accent: '#55e6d8',
    tableFelt: '#081c24',
    cardStock: '#d8fff8',
    glow: '#29e9d7',
  },
  modules: [
    {
      id: 'crew-sheets',
      label: 'Crew Sheets',
      status: 'scaffold',
      description: 'Reserved for role cards, stress boxes, and inventory rails.',
    },
    {
      id: 'loot-generator',
      label: 'Loot Generator',
      status: 'planned',
      description: 'Future module for cache tables, salvage tags, and quick rewards.',
    },
  ],
  actions: [
    {
      id: 'scan-cache',
      label: 'Scan Cache',
      detail: 'Flip a signal card and expose the next tactical opportunity.',
      kind: 'draw',
    },
    {
      id: 'resolve-spike',
      label: 'Test Signal',
      detail: 'Roll through an overload moment with strong visual payoff.',
      kind: 'roll',
    },
    {
      id: 'cycle-dice',
      label: 'Dice Mode',
      detail: 'Rotate the active signal handling profile.',
      kind: 'cycle-dice',
    },
    {
      id: 'reset-grid',
      label: 'Reset Grid',
      detail: 'Rebuild the signal cache and clear counters.',
      kind: 'reset',
    },
  ],
};
