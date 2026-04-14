import { useEffect, useRef } from 'react';
import { Application, Container, Graphics, Text, TextStyle } from 'pixi.js';
import { useAppStore } from '../../core/state/appStore';

const CARD_LAYOUT = [
  { title: 'Ashen Rite', x: 0.27, y: 0.37, rotation: -0.12, accent: 0xcda56a },
  { title: 'Glass Sky', x: 0.51, y: 0.45, rotation: 0.03, accent: 0x63d8cb },
  { title: 'Last Lantern', x: 0.75, y: 0.36, rotation: 0.14, accent: 0xef7d57 },
];

const TOKEN_LAYOUT = [
  { label: 'GM', x: 0.16, y: 0.74, color: 0x9d6eff },
  { label: 'P1', x: 0.43, y: 0.77, color: 0x5ad0ff },
  { label: 'P2', x: 0.66, y: 0.78, color: 0x83d483 },
];

export function TabletopSurface() {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const appRef = useRef<Application | null>(null);
  const deckCount = useAppStore((state) => state.deckCount);
  const theme = useAppStore((state) => state.theme);
  const scenePulse = useAppStore((state) => state.scenePulse);

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
      stage.addChild(glow);

      const field = new Graphics();
      stage.addChild(field);

      const cards = new Container();
      stage.addChild(cards);

      const tokens = new Container();
      stage.addChild(tokens);

      const textStyle = new TextStyle({
        fill: theme === 'holo' ? 0xdffef9 : 0xf9e8cb,
        fontFamily: 'Georgia',
        fontSize: 20,
        fontWeight: '700',
      });

      const deckText = new Text({ text: '', style: textStyle });
      stage.addChild(deckText);

      const renderScene = (time: number) => {
        const width = app.renderer.width;
        const height = app.renderer.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const wave = Math.sin(time / 450) * 0.5 + 0.5;

        glow.clear();
        glow.circle(centerX, centerY * 0.82, Math.min(width, height) * (0.3 + scenePulse * 0.05));
        glow.fill({ color: theme === 'holo' ? 0x29e9d7 : 0xd49b47, alpha: 0.08 + wave * 0.08 });

        field.clear();
        field.roundRect(width * 0.08, height * 0.1, width * 0.84, height * 0.76, 28);
        field.fill({ color: theme === 'holo' ? 0x0a1f29 : 0x26180f, alpha: 0.96 });
        field.stroke({ color: theme === 'holo' ? 0x50ecd9 : 0xe0b36d, width: 2, alpha: 0.7 });

        cards.removeChildren();
        CARD_LAYOUT.forEach((card, index) => {
          const cardGraphic = new Graphics();
          const cardWidth = width * 0.16;
          const cardHeight = height * 0.34;
          const pulse = 1 + Math.sin(time / 600 + index) * 0.015;
          cardGraphic.roundRect(-cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight, 18);
          cardGraphic.fill({ color: 0xf7ecd8, alpha: 0.94 });
          cardGraphic.stroke({ color: card.accent, width: 4, alpha: 0.9 });
          cardGraphic.position.set(width * card.x, height * card.y);
          cardGraphic.rotation = card.rotation + Math.sin(time / 900 + index) * 0.02;
          cardGraphic.scale.set(pulse);

          const title = new Text({
            text: card.title,
            style: new TextStyle({
              fill: 0x2c2118,
              fontFamily: 'Georgia',
              fontSize: 16,
              fontWeight: '700',
            }),
          });
          title.anchor.set(0.5);
          title.position.set(0, 0);

          cardGraphic.addChild(title);
          cards.addChild(cardGraphic);
        });

        tokens.removeChildren();
        TOKEN_LAYOUT.forEach((token, index) => {
          const chip = new Graphics();
          const radius = Math.min(width, height) * 0.042;
          chip.circle(0, 0, radius);
          chip.fill({ color: token.color, alpha: 0.9 });
          chip.stroke({ color: 0xffffff, width: 3, alpha: 0.6 });
          chip.position.set(width * token.x, height * token.y + Math.sin(time / 500 + index) * 4);

          const label = new Text({
            text: token.label,
            style: new TextStyle({
              fill: 0x041016,
              fontFamily: 'Arial',
              fontSize: 15,
              fontWeight: '700',
            }),
          });
          label.anchor.set(0.5);
          chip.addChild(label);
          tokens.addChild(chip);
        });

        deckText.text = `Omen Deck: ${deckCount}`;
        deckText.position.set(width * 0.12, height * 0.14);
      };

      app.ticker.add(() => renderScene(performance.now()));
    };

    void createApp();

    return () => {
      disposed = true;
      appRef.current?.destroy(true, true);
      appRef.current = null;
    };
  }, [deckCount, scenePulse, theme]);

  return <div className="surface-host" ref={hostRef} />;
}
