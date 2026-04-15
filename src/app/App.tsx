import { AnimatePresence, motion } from 'motion/react';
import type { CSSProperties } from 'react';
import { cardSpecs, demoRules } from '../content/demoGame';
import { themes } from '../content/themes';
import { formatSnapshotStamp } from '../core/persistence/sessionStorage';
import { useAppStore } from '../core/state/appStore';
import { getRulesetManifest, orderedRulesets } from '../engine/rulesets/registry';
import { TabletopSurface } from '../render/pixi/TabletopSurface';

export function App() {
  const theme = useAppStore((state) => state.theme);
  const rulesetId = useAppStore((state) => state.rulesetId);
  const diceMode = useAppStore((state) => state.diceMode);
  const diceProfileId = useAppStore((state) => state.diceProfileId);
  const activity = useAppStore((state) => state.activity);
  const deckCount = useAppStore((state) => state.deckCount);
  const ritualProgress = useAppStore((state) => state.ritualProgress);
  const dangerLevel = useAppStore((state) => state.dangerLevel);
  const currentCard = useAppStore((state) => state.currentCard);
  const saveSlots = useAppStore((state) => state.saveSlots);
  const lastRoll = useAppStore((state) => state.lastRoll);
  const boonWard = useAppStore((state) => state.boonWard);
  const rollDice = useAppStore((state) => state.rollDice);
  const drawCard = useAppStore((state) => state.drawCard);
  const cycleDiceMode = useAppStore((state) => state.cycleDiceMode);
  const cycleRuleset = useAppStore((state) => state.cycleRuleset);
  const resetRun = useAppStore((state) => state.resetRun);
  const setTheme = useAppStore((state) => state.setTheme);
  const saveSession = useAppStore((state) => state.saveSession);
  const restoreSession = useAppStore((state) => state.restoreSession);

  const themeMeta = themes[theme];
  const ruleset = getRulesetManifest(rulesetId);
  const activeDeck = ruleset.decks[0];
  const activeDice = ruleset.dice.find((profile) => profile.id === diceProfileId) ?? ruleset.dice[0];
  const progressCounter = ruleset.counters.find((counter) => counter.id === 'progress');
  const dangerCounter = ruleset.counters.find((counter) => counter.id === 'danger');
  const encounterState =
    ritualProgress >= (progressCounter?.max ?? 7)
      ? 'Victory'
      : dangerLevel >= (dangerCounter?.max ?? 5) || deckCount === 0
        ? 'Defeat'
        : 'In Progress';

  const runAction = (kind: (typeof ruleset.actions)[number]['kind']) => {
    if (kind === 'roll') {
      rollDice();
      return;
    }

    if (kind === 'draw') {
      drawCard();
      return;
    }

    if (kind === 'reset') {
      resetRun();
      return;
    }

    cycleDiceMode();
  };

  return (
    <div
      className={`app-shell ${themeMeta.panelClass}`}
      style={
        {
          ['--surface-gradient' as string]: themeMeta.surfaceGradient,
          ['--theme-hue' as string]: themeMeta.hue,
          ['--ruleset-accent' as string]: ruleset.visualTheme.accent,
        } as CSSProperties
      }
    >
      <motion.header
        className="hero"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="hero-copy-block">
          <p className="eyebrow">Static Tabletop Framework</p>
          <h1>Paper RPG Online</h1>
          <p className="hero-copy">
            A plugin-friendly companion shell for dice, decks, counters, zones, saves, assets, and a
            Pixi-powered play surface. The loaded ruleset decides the table language and visual mood.
          </p>
          <div className="hero-actions">
            <button className="hero-button" onClick={drawCard}>
              Draw From {ruleset.terminology.deck}
            </button>
            <button className="ghost-button" onClick={cycleRuleset}>
              Switch Ruleset
            </button>
            <button
              className="ghost-button"
              onClick={() => setTheme(theme === 'parchment' ? 'holo' : theme === 'holo' ? 'verdant' : 'parchment')}
            >
              Switch Theme
            </button>
          </div>
        </div>

        <div className="hero-rail" role="list" aria-label="Current session state">
          <span>{ruleset.name}</span>
          <span>{encounterState}</span>
          <span>
            {activeDice.notation} / {diceMode}
          </span>
          <span>
            {deckCount} {ruleset.terminology.deck.toLowerCase()} cards left
          </span>
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
              <h2>{ruleset.terminology.table}</h2>
            </div>
            <div className="table-status">
              <span>
                {ruleset.terminology.progress} {ritualProgress}/{progressCounter?.max ?? 7}
              </span>
              <span>
                {ruleset.terminology.danger} {dangerLevel}/{dangerCounter?.max ?? 5}
              </span>
            </div>
          </div>
          <TabletopSurface />
        </motion.section>

        <section className="side-column">
          <motion.section
            className="panel encounter-panel"
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.16, duration: 0.45 }}
          >
            <div className="panel-header">
              <p className="section-kicker">Ruleset</p>
              <h2>{ruleset.name}</h2>
            </div>
            <p className="panel-copy">{ruleset.summary}</p>
            <div className="score-grid">
              <article className="score-card">
                <span>{ruleset.terminology.progress}</span>
                <strong>{ritualProgress}</strong>
              </article>
              <article className="score-card danger">
                <span>{ruleset.terminology.danger}</span>
                <strong>{dangerLevel}</strong>
              </article>
              <article className="score-card">
                <span>Last Roll</span>
                <strong>{lastRoll ? lastRoll.total : '--'}</strong>
              </article>
              <article className="score-card">
                <span>{ruleset.terminology.ward}</span>
                <strong>{boonWard ? 'Active' : 'Down'}</strong>
              </article>
            </div>
            {currentCard ? (
                <article className="featured-card" style={{ ['--card-accent' as string]: currentCard.accent } as CSSProperties}>
                <div className="featured-topline">
                  <p className="featured-type">{currentCard.subtitle}</p>
                  <span className={`rarity-pill rarity-${currentCard.rarity}`}>{currentCard.rarity}</span>
                </div>
                <h3>{currentCard.title}</h3>
                <div className="featured-icon">{currentCard.icon}</div>
                <p>{currentCard.feature}</p>
                <small>{currentCard.rulesText}</small>
                <em>{currentCard.artDirection}</em>
              </article>
            ) : null}
          </motion.section>

          <motion.section
            className="panel controls-panel"
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.45 }}
          >
            <div className="panel-header">
              <p className="section-kicker">Controls</p>
              <h2>Table Inputs</h2>
            </div>
            <div className="control-list">
              {ruleset.actions.map((control, index) => (
                <motion.button
                  className="action-card"
                  key={control.id}
                  onClick={() => runAction(control.kind)}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.14 + index * 0.05 }}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <strong>{control.label}</strong>
                  <span>{control.detail}</span>
                </motion.button>
              ))}
            </div>
          </motion.section>

          <motion.section
            className="panel framework-panel"
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.24, duration: 0.45 }}
          >
            <div className="panel-header">
              <p className="section-kicker">Plugin Contract</p>
              <h2>Manifest Surface</h2>
            </div>
            <div className="manifest-grid">
              <article>
                <span>Dice</span>
                <strong>{activeDice.label}</strong>
                <p>{activeDice.notation} with {activeDice.modes.join(', ')} modes.</p>
              </article>
              <article>
                <span>Deck</span>
                <strong>{activeDeck.name}</strong>
                <p>{activeDeck.cards.length} cards, {activeDeck.defaultSize} format.</p>
              </article>
              <article>
                <span>Theme</span>
                <strong>{themes[ruleset.visualTheme.themeId].name}</strong>
                <p>{ruleset.assets.textureHints.join(', ')}.</p>
              </article>
              <article>
                <span>Assets</span>
                <strong>{ruleset.assets.iconSet}</strong>
                <p>{Object.keys(ruleset.assets.tokenIcons).length} token hooks registered.</p>
              </article>
            </div>
          </motion.section>

          <motion.section
            className="panel modules-panel"
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.28, duration: 0.45 }}
          >
            <div className="panel-header">
              <p className="section-kicker">Roadmap Slots</p>
              <h2>Optional Modules</h2>
            </div>
            <div className="module-list">
              {ruleset.modules.map((module) => (
                <article className="module-item" key={module.id}>
                  <span className={`status-dot status-${module.status}`}>{module.status}</span>
                  <strong>{module.label}</strong>
                  <p>{module.description}</p>
                </article>
              ))}
            </div>
          </motion.section>

          <motion.section
            className="panel rulebook-panel"
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.32, duration: 0.45 }}
          >
            <div className="panel-header">
              <p className="section-kicker">Rules</p>
              <h2>Core Loop</h2>
            </div>
            <div className="rule-callouts">
              <article className="callout">
                <span>Win</span>
                <p>{demoRules.winCondition}</p>
              </article>
              <article className="callout">
                <span>Lose</span>
                <p>{demoRules.lossCondition}</p>
              </article>
            </div>
            <div className="turn-list">
              {demoRules.turnStructure.map((step, index) => (
                <div className="turn-step" key={step}>
                  <strong>{index + 1}</strong>
                  <p>{step}</p>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section
            className="panel taxonomy-panel"
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.36, duration: 0.45 }}
          >
            <div className="panel-header">
              <p className="section-kicker">Assets</p>
              <h2>Cards and Zones</h2>
            </div>
            <div className="taxonomy-list">
              {ruleset.zones.map((zone) => (
                <article className="taxonomy-item" key={zone.id}>
                  <strong>{zone.label}</strong>
                  <p>{zone.role}</p>
                  <small>
                    {Math.round(zone.width * 100)}% x {Math.round(zone.height * 100)}% surface slot
                  </small>
                </article>
              ))}
            </div>
            <div className="spec-grid">
              {cardSpecs.map((spec) => (
                <article className="spec-item" key={spec.sizeId}>
                  <strong>{spec.sizeId}</strong>
                  <p>
                    {spec.widthMm} x {spec.heightMm} mm
                  </p>
                  <small>
                    {spec.widthPx} x {spec.heightPx} px target
                  </small>
                </article>
              ))}
            </div>
          </motion.section>

          <motion.section
            className="panel gallery-panel"
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.45 }}
          >
            <div className="panel-header">
              <p className="section-kicker">Deck Gallery</p>
              <h2>{activeDeck.name}</h2>
            </div>
            <div className="gallery-grid">
              {activeDeck.cards.map((card) => (
                <article
                  className={`gallery-card type-${card.type}`}
                  key={card.id}
                  style={{ ['--card-accent' as string]: card.accent } as CSSProperties}
                >
                  <div className="gallery-top">
                    <span className="gallery-icon">{card.icon}</span>
                    <span className={`rarity-pill rarity-${card.rarity}`}>{card.rarity}</span>
                  </div>
                  <strong>{card.title}</strong>
                  <p>{card.feature}</p>
                  <small>{card.subtitle}</small>
                </article>
              ))}
            </div>
          </motion.section>

          <motion.section
            className="panel saves-panel"
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.44, duration: 0.45 }}
          >
            <div className="panel-header">
              <p className="section-kicker">Saves</p>
              <h2>Session Slots</h2>
            </div>
            <div className="save-list">
              {saveSlots.map((slot) => (
                <article className="save-item" key={slot.id}>
                  <div>
                    <strong>{slot.label}</strong>
                    <p>
                      {slot.snapshot
                        ? `${getRulesetManifest(slot.snapshot.rulesetId).name} / ${formatSnapshotStamp(slot.snapshot)}`
                        : 'No snapshot stored yet.'}
                    </p>
                  </div>
                  <div className="save-actions">
                    <button className="ghost-button" onClick={() => saveSession(slot.id)}>
                      Save
                    </button>
                    <button className="ghost-button" onClick={() => restoreSession(slot.id)}>
                      Load
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </motion.section>

          <motion.section
            className="panel log-panel"
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.48, duration: 0.45 }}
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

          <motion.section
            className="panel registry-panel"
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.52, duration: 0.45 }}
          >
            <div className="panel-header">
              <p className="section-kicker">Registry</p>
              <h2>Installed Rulesets</h2>
            </div>
            <div className="registry-list">
              {orderedRulesets.map((manifest) => (
                <article className="registry-item" key={manifest.id}>
                  <strong>{manifest.name}</strong>
                  <p>{manifest.tagline}</p>
                </article>
              ))}
            </div>
          </motion.section>
        </section>
      </main>
    </div>
  );
}
