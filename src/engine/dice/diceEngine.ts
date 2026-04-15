import type { DiceMode, DiceProfile, DiceRollResult } from '../../core/types';

const rollFace = (faces: number) => Math.ceil(Math.random() * faces);

export const rollDiceProfile = (profile: DiceProfile, mode: DiceMode): DiceRollResult => {
  const first = rollFace(profile.faces);
  const second = rollFace(profile.faces);
  const rolls = mode === 'neutral' ? [first] : [first, second];

  const total =
    mode === 'advantage'
      ? Math.max(first, second)
      : mode === 'risk'
        ? Math.min(first, second)
        : first;

  const label =
    profile.criticalTarget && total >= profile.criticalTarget
      ? 'Critical'
      : profile.successTarget && total >= profile.successTarget
        ? 'Success'
        : 'Result';

  return {
    notation: profile.notation,
    mode,
    rolls,
    total,
    label,
  };
};
