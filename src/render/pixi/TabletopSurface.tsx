import { useEffect, useRef } from 'react';
import { Application, Container, Graphics, Text, TextStyle } from 'pixi.js';
import { useAppStore } from '../../core/state/appStore';
import { getRulesetManifest } from '../../engine/rulesets/registry';

export function TabletopSurface() {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const appRef = useRef<Application | null>(null);
  const deckCount = useAppStore((state) => state.deckCount);
  const rulesetId = useAppStore((state) => state.rulesetId);
  const theme = useAppStore((state) => state.theme);
  const scenePulse = useAppStore((state) => state.scenePulse);
  const currentCard = useAppStore((state) => state.currentCard);
  const discard = useAppStore((state) => state.discard.slice(0, 3));
  const ritualProgress = useAppStore((state) => state.ritualProgress);
  const dangerLevel = useAppStore((state) => state.dangerLevel);
  const boonWard = useAppStore((state) => state.boonWard);

  useEffect(() => {
    let disposed = false;

    const createApp = async () => {
      const app = new Application();
      await app.init({
        antialias: true,
        autoDensity: true,
        backgroundAlpha: 0,
        resizeTo: hostRef.current ?? undefined,
      });

      if (disposed || !hostRef.current) {
        app.destroy(true, true);
        return;
      }

      hostRef.current.appendChild(app.canvas);
      appRef.current = app;

      const stage = new Container();
      app.stage.addChild(stage);

      const glow = new Graphics();
      const field = new Graphics();
      const tracks = new Graphics();
      const cards = new Container();
      const textLayer = new Container();
      const zoneLabels = new Container();

      stage.addChild(glow, field, tracks, cards, zoneLabels, textLayer);

      const createText = (
        fontSize: number,
        fill: number,
        weight: '400' | '500' | '600' | '700' = '700',
      ) =>
        new TextStyle({
          fill,
          fontFamily: 'Georgia',
          fontSize,
          fontWeight: weight,
        });

      const deckText = new Text({ text: '', style: createText(20, theme === 'holo' ? 0xdffef9 : 0xf9e8cb) });
      const statusText = new Text({ text: '', style: createText(16, theme === 'holo' ? 0xaaf9ee : 0xf0d8b0, '500') });
      textLayer.addChild(deckText, statusText);

      const renderTrackDots = (originX: number, originY: number, count: number, active: number, fill: number) => {
        for (let index = 0; index < count; index += 1) {
          tracks.circle(originX + index * 28, originY, 9);
          tracks.fill({ color: fill, alpha: index < active ? 0.95 : 0.18 });
        }
      };

      const renderZones = (width: number, height: number) => {
        const ruleset = getRulesetManifest(rulesetId);
        const zoneStyle = createText(12, theme === 'holo' ? 0xaaf9ee : 0xf0d8b0, '600');
        zoneLabels.removeChildren().forEach((child) => child.destroy());

        ruleset.zones.forEach((zone) => {
          const x = width * zone.x;
          const y = height * zone.y;
          const zoneWidth = width * zone.width;
          const zoneHeight = height * zone.height;

          tracks.roundRect(x, y, zoneWidth, zoneHeight, 18);
          tracks.stroke({ color: theme === 'holo' ? 0x50ecd9 : 0xe0b36d, width: 1, alpha: 0.18 });

          const label = new Text({ text: zone.label.toUpperCase(), style: zoneStyle });
          label.alpha = 0.48;
          label.position.set(x + 12, y + 10);
          zoneLabels.addChild(label);
        });
      };

      const renderCard = (
        x: number,
        y: number,
        title: string,
        subtitle: string,
        feature: string,
        accent: string,
        scale: number,
        rotation: number,
        alpha: number,
      ) => {
        const playingCardRatio = 63 / 88;
        const baseHeight = Math.min(app.renderer.height * 0.58, app.renderer.width * 0.3 / playingCardRatio);
        const cardHeight = baseHeight * scale;
        const cardWidth = cardHeight * playingCardRatio;
        const card = new Graphics();
        card.roundRect(-cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight, 10);
        card.fill({ color: 0xf6ead3, alpha });
        card.stroke({ color: Number.parseInt(accent.replace('#', '0x'), 16), width: 4, alpha: 0.9 });
        card.position.set(x, y);
        card.rotation = rotation;

        const titleText = new Text({
          text: title,
          style: createText(18 * scale, 0x25170e),
        });
        titleText.anchor.set(0.5, 0);
        titleText.position.set(0, -cardHeight * 0.36);

        const subtitleText = new Text({
          text: subtitle.toUpperCase(),
          style: createText(10 * scale, 0x6f4b24, '600'),
        });
        subtitleText.anchor.set(0.5, 0);
        subtitleText.position.set(0, -cardHeight * 0.22);

        const featureText = new Text({
          text: feature,
          style: new TextStyle({
            fill: 0x362617,
            fontFamily: 'Trebuchet MS',
            fontSize: 12 * scale,
            fontWeight: '600',
            wordWrap: true,
            wordWrapWidth: cardWidth * 0.72,
          }),
        });
        featureText.anchor.set(0.5);
        featureText.position.set(0, 10 * scale);

        card.addChild(titleText, subtitleText, featureText);
        cards.addChild(card);
      };

      const renderScene = (time: number) => {
        const width = app.renderer.width;
        const height = app.renderer.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const wave = Math.sin(time / 450) * 0.5 + 0.5;

        glow.clear();
        glow.circle(centerX, centerY * 0.82, Math.min(width, height) * (0.3 + scenePulse * 0.06));
        glow.fill({ color: theme === 'holo' ? 0x29e9d7 : 0xd49b47, alpha: 0.08 + wave * 0.08 });

        field.clear();
        field.roundRect(width * 0.05, height * 0.08, width * 0.9, height * 0.82, 34);
        field.fill({ color: theme === 'holo' ? 0x081c24 : 0x1d120d, alpha: 0.96 });
        field.stroke({ color: theme === 'holo' ? 0x50ecd9 : 0xe0b36d, width: 2, alpha: 0.8 });

        tracks.clear();
        renderZones(width, height);
        renderTrackDots(width * 0.12, height * 0.16, 7, ritualProgress, 0xf0c16b);
        renderTrackDots(width * 0.12, height * 0.22, 5, dangerLevel, theme === 'holo' ? 0x50ecd9 : 0xf26b5a);

        cards.removeChildren();

        if (currentCard) {
          renderCard(
            width * 0.5,
            height * 0.52 + Math.sin(time / 900) * 5,
            currentCard.title,
            currentCard.subtitle,
            currentCard.feature,
            currentCard.accent,
            1,
            Math.sin(time / 1400) * 0.02,
            0.96,
          );
        }

        discard.forEach((card, index) => {
          renderCard(
            width * (0.18 + index * 0.09),
            height * (0.72 - index * 0.018),
            card.title,
            card.subtitle,
            card.feature,
            card.accent,
            0.46,
            -0.16 + index * 0.08,
            0.72 - index * 0.12,
          );
        });

        const ruleset = getRulesetManifest(rulesetId);
        deckText.text = `${ruleset.terminology.deck} ${deckCount} / ${ruleset.terminology.progress} ${ritualProgress} / ${ruleset.terminology.danger} ${dangerLevel}`;
        deckText.position.set(width * 0.11, height * 0.1);

        statusText.text = boonWard
          ? `${ruleset.terminology.ward} active: next hazard is ignored.`
          : `${ruleset.terminology.ward} inactive: hazards resolve normally.`;
        statusText.position.set(width * 0.11, height * 0.255);
      };

      app.ticker.add(() => renderScene(performance.now()));
    };

    void createApp();

    return () => {
      disposed = true;
      appRef.current?.destroy(true, true);
      appRef.current = null;
    };
  }, [boonWard, currentCard, dangerLevel, deckCount, discard, ritualProgress, rulesetId, scenePulse, theme]);

  return <div className="surface-host" ref={hostRef} />;
}
