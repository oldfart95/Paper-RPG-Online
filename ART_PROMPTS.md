# Paper RPG Online Art Prompt Pack

Use this file to generate premium art consistently across the prototype deck.

## Base prompt

```text
luxury dark fantasy tabletop card illustration, premium boutique board game art, richly painted, dramatic focal composition, elegant negative space for title and rules overlay, ornate but restrained filigree, ceremonial mood, tactile materials, vellum, gilt foil, incense smoke, candle bloom, cathedral scale lighting, painterly realism with stylized clarity, highly readable silhouette, premium collectible card feel, no UI text, no watermark, no logo, vertical tarot card composition, print-ready illustration, occult cathedral fantasy, ash, brass, candlelight, soot, velvet black, bone ivory, reliquary gold, silver dust, ritual geometry, sacred melancholy, ember glow, elegant dread, old stone, thin smoke, luminous iconography
```

## Negative prompt

```text
cheap mobile game art, cartoon style, anime style, flat vector look, low detail, cluttered composition, muddy focal point, distorted anatomy, duplicate limbs, cropped subject, visible text, UI labels, watermark, logo, oversaturated neon, blurry details, generic fantasy stock art
```

## Frame rules

- `omen`: moon-silver cresting, fractured glass motifs, cool halo accents
- `hazard`: iron-black frame, scarlet ash cracks, sharper corners
- `boon`: warm gold and ivory frame, reliquary ornament, softened glow
- `ritual`: gilded cathedral frame, centered sigil plate, strongest symmetry

## Rarity rules

- `common`: restrained palette, one luminous accent
- `rare`: stronger contrast, richer atmosphere, secondary magical detail
- `mythic`: centerpiece composition, strongest silhouette, gallery-quality finish

## Layout rules

- tarot aspect ratio, `70 x 120 mm`
- keep focal point in upper-middle half
- preserve clean top band for title and rarity
- preserve clean lower-middle zone for feature line and rules
- one dominant subject per card

## Prompt formula

```text
[BASE PROMPT], [RARITY RULE], [FRAME RULE], [CARD PROMPT]. [NEGATIVE PROMPT]
```

## Deck prompts

### Omen

- `Glass Sky`: cracked celestial mirror over a storm horizon, pale moons reflected in splintered glass, silver dust, prophetic calm
- `Choir of Cinders`: choir robes dissolving into sparks above an altar of ash and gold, sacred music implied through ember motion
- `Mirror Saint`: saint statue reflected in black chapel water, moonlit stillness, serene supernatural presence
- `Eclipsed Belfry`: bell tower against a ringed eclipse, ember haze, solemn prophetic dread
- `Inkwater Orbit`: black ritual water spinning in concentric orbits under candlelight, silver chalk sigils above the surface

### Boon

- `Lantern Oath`: brass lantern lifted in oath above parchment dust and ribbon-bound vows, warm stabilizing light
- `Mercy Salt`: luminous salt circle drawn by careful hands on dark stone, pale blue protective sparks
- `Vow Needle`: silver ritual needle piercing vellum script beside a wax seal, delicate sacred precision
- `Sunlit Reliquary`: reliquary of gold and glass opening with internal dawn light, smoke and lace details
- `Pilgrim Choir`: cream-robed pilgrims singing beside a cliff chapel at dawn, communal protection and hope
- `Crown of Wax`: molten candle crown hovering over black silk, jeweled wax drips glowing like sacred fire

### Hazard

- `Grave Wind`: obsidian fog sweeping through grave markers, cold cyan edge light, predatory motion
- `Veil Crack`: jagged dimensional wound across cathedral floorstone, violet-black ash leaking from the tear
- `Starved Bells`: silent bronze bells over a soot-covered courtyard, tension like a sound about to happen
- `Char Veil Procession`: black-veiled figures advancing through ember dust under a torn ceremonial canopy
- `Hollow Index`: ruined archive drawers opened into darkness, pale labels fluttering like dead moths
- `Midnight Abbot`: towering abbot silhouette in velvet black robes with a halo of extinguished gold

### Ritual

- `Ashen Rite`: molten sigil burning into soot-black vellum over a ritual altar, controlled ember bloom
- `Saintless Hour`: cathedral nave split by one immaculate beam of dawn, dust and ritual geometry in suspension
- `Gilded Thurible`: ornate gold incense thurible swinging over marble ash, smoke halos forming sacred circles
- `Cathedral Engine`: immense ritual machine of brass, relic ivory, and stained-light fire dominating the sanctuary
- `Ember Vigil`: lone candle vigil in a narrow stone corridor lined with smoky murals, intimate ceremonial stillness
- `Orison of Iron`: iron prayer strips hanging above a forge-lit altar, sparks and incense mixing in heavy air

## Card back prompt

```text
luxury boutique tabletop card back design, symmetrical occult cathedral emblem, black velvet background, reliquary gold linework, moon-silver glass motifs, ember core sigil, subtle smoke rings, no text, centered masterpiece layout, print-ready tarot card back
```

## Token prompts

- `Danger`: molten red-black enamel medallion, cracked ash surface, embossed hazard sigil
- `Ward`: pale ivory and gold medallion, luminous salt-circle sigil, sacred protective finish
- `Ritual Progress`: gilded brass marker with centered ceremonial star and ember glow

## Best workflow

1. Generate `Glass Sky`, `Mercy Salt`, `Veil Crack`, and `Cathedral Engine` first.
2. Tune the style until those four feel like one product line.
3. Batch the rest of the deck with the same prompt skeleton and style settings.
4. Bring the images back here and I’ll wire them into the live cards.
