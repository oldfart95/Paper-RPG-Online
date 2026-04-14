import type { RulesetManifest } from '../../core/types';

export const neonHollowsManifest: RulesetManifest = {
  id: 'neon-hollows',
  name: 'Neon Hollows',
  tagline: 'Signal-soaked scavenging with holo markers and tactical deck pressure.',
  summary:
    'A cleaner sci-fi ruleset variant that keeps the same engine primitives while changing action tone, theme, and zone language.',
  supportedDice: ['d8', 'd12', 'd20'],
  zoneLabels: ['Cache', 'Signal Grid', 'Burn Pile', 'Crew Lane'],
  starterDeck: 'Signal Cache',
  themeHint: 'holo',
  actions: [
    {
      id: 'scan-cache',
      label: 'Scan Cache',
      detail: 'Flip a signal card and expose the next tactical opportunity.',
    },
    {
      id: 'resolve-spike',
      label: 'Resolve Spike',
      detail: 'Roll through an overload moment with strong visual payoff.',
    },
  ],
};
