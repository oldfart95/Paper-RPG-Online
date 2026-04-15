import { emberveilManifest } from '../../content/rulesets/emberveil';
import { exampleVoyagersManifest } from '../../content/rulesets/exampleVoyagers';
import { neonHollowsManifest } from '../../content/rulesets/neonHollows';
import type { RulesetId, RulesetManifest } from '../../core/types';

const manifests = [emberveilManifest, neonHollowsManifest, exampleVoyagersManifest];

export const rulesetRegistry: Record<RulesetId, RulesetManifest> = manifests.reduce(
  (registry, manifest) => {
    registry[manifest.id] = manifest;
    return registry;
  },
  {} as Record<RulesetId, RulesetManifest>,
);

export const orderedRulesets = manifests;

export const getRulesetManifest = (id: RulesetId): RulesetManifest => rulesetRegistry[id];
