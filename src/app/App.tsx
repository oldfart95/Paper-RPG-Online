import { AnimatePresence, motion } from 'motion/react';
import { themes } from '../content/themes';
import { useAppStore } from '../core/state/appStore';
import { TabletopSurface } from '../render/pixi/TabletopSurface';

const controls = [
  {
    label: 'Roll Dice',
    hint: 'Trigger a d20 result and pulse the play surface.',
    action: 'roll',
  },
  {
    label: 'Draw Card',
    hint: 'Advance the omen deck and refresh the table energy.',
    action: 'draw',
  },
  {
    label: 'Cycle Dice Mode',
    hint: 'Switch between advantage, neutral, and risk profiles.',
    action: 'cycle',
  },
] as const;

export function App() {
  const theme = useAppStore((state) => state.theme);
  const diceMode = useAppStore((state) => state.diceMode);
  const activity = useAppStore((state) => state.activity);
  const deckCount = useAppStore((state) => state.deckCount);
  const rollDice = useAppStore((state) => state.rollDice);
  const drawCard = useAppStore((state) => state.drawCard);
  const cycleDiceMode = useAppStore((state) => state.cycleDiceMode);
  const setTheme = useAppStore((state) => state.setTheme);

  const themeMeta = themes[theme];

  const runAction = (action: (typeof controls)[number]['action']) => {
    if (action === 'roll') {
      rollDice();
      return;
    }

    if (action === 'draw') {
      drawCard();
      return;
    }

    cycleDiceMode();
  };

  return (
    <div className={`app-shell ${themeMeta.panelClass}`} style={{ ['--surface-gradient' as string]: themeMeta.surfaceGradient, ['--theme-hue' as string]: themeMeta.hue }}>
      <motion.header
        className="hero"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div>
          <p className="eyebrow">Static-first tabletop engine</p>
          <h1>Paper RPG Online</h1>
          <p className="hero-copy">
            A polished GitHub Pages-ready vertical slice with a React shell, Pixi play surface, Motion transitions, and a content-driven core.
          </p>
        </div>

        <div className="hero-chips" role="list" aria-label="Current session state">
          <span>{themeMeta.name}</span>
          <span>{diceMode} dice</span>
          <span>{deckCount} cards live</span>
        </div>
      </motion.header>

      <main className="dashboard">
        <motion.section
          className="table-panel"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.08, duration: 0.55, ease: 'easeOut' }}
        >
          <div className="table-topbar">
            <div>
              <p className="section-kicker">Play Surface</p>
              <h2>Demo Encounter Table</h2>
            </div>
            <button className="ghost-button" onClick={() => setTheme(theme === 'parchment' ? 'holo' : 'parchment')}>
              Switch Theme
            </button>
          </div>
          <TabletopSurface />
        </motion.section>

        <section className="side-column">
          <motion.section
            className="panel controls-panel"
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.16, duration: 0.45 }}
          >
            <div className="panel-header">
              <p className="section-kicker">Controls</p>
              <h2>Interaction Slice</h2>
            </div>
            <div className="control-list">
              {controls.map((control, index) => (
                <motion.button
                  className="action-card"
                  key={control.label}
                  onClick={() => runAction(control.action)}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.07 }}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <strong>{control.label}</strong>
                  <span>{control.hint}</span>
                </motion.button>
              ))}
            </div>
          </motion.section>

          <motion.section
            className="panel log-panel"
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.22, duration: 0.45 }}
          >
            <div className="panel-header">
              <p className="section-kicker">Activity</p>
              <h2>Session Log</h2>
            </div>
            <AnimatePresence initial={false}>
              <div className="activity-list">
                {activity.map((entry) => (
                  <motion.article
                    className="activity-item"
                    key={entry.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.22 }}
                  >
                    <strong>{entry.label}</strong>
                    <p>{entry.detail}</p>
                  </motion.article>
                ))}
              </div>
            </AnimatePresence>
          </motion.section>
        </section>
      </main>
    </div>
  );
}
