# Art brief: Part 1 portfolio

Drop every generated image into this folder (`art-source/`) using the **exact filename** listed.
PNG or JPG are both fine at any resolution ≥ the one listed. Anything missing falls back to a
placeholder, so you can deliver in batches. After adding files, `npm run assets` converts them
into `public/art/` and the site picks them up.

**Tiers:** ★ = needed for the core experience · ☆ = nice to have.

**Look:** a traditional manga / comic page, JoJo-inspired: bold,
flamboyant, dramatic. Printed in the site's palette and nothing else:

| Role | Colour |
|---|---|
| Paper | `#FFFFFF` / `#F5F5F0` |
| Ink | `#111111`, greys only via screentone dots and hatching |
| Spot colour | crimson red `#E00B25` |

**Banned colours:** anything else, specifically beige, cream, sepia, gold, orange, peach, pink,
teal, cyan, green, purple, violet, indigo, navy, and any glow, gradient, bloom or neon.

**Suggested order:** `cover-islamabad` → `ch4-powers` (your Stand) → `burst-sfx` → the five
`ink-splat`s → `speedlines-radial` → the chapter plates → the rest.

**No people who could read as you.** None of these prompts depict you or use your photo. Any
figure is hands only, or a tiny anonymous figure seen from behind.

---

## 0. Style blocks

### `+PLATE`: paste at the end of every illustration prompt
```
STYLE: Classic 1990s Japanese shōnen manga page art — flamboyant, theatrical and intense. Bold, confident brush-pen contour lines with strong line-weight variation;
heavy spotted blacks; dense, energetic cross-hatching and parallel hatching on muscles, faces and
fabric; mechanical screentone dot shading for mid-tones. Figures strike theatrical, fashion-model
poses: twisted torsos, contrapposto, one hand splayed near the face, extreme foreshortening.
Stylised angular anatomy, sharp jawlines, strong brows, intense eyes, defined lips, high-fashion
clothing details. Radiating focus lines and speed lines for drama. Menacing atmosphere.

COLOUR: Black ink and screentone on pure white paper only. The ONLY colour is one flat crimson red
(#E00B25), used boldly on one or two elements (a scarf, a background slab, a sun, an aura) as flat
fill or red screentone dots — never as a gradient or glow.

AVOID: any colour other than black, white, screentone grey and crimson red; no beige, sepia,
gold, orange, pink, teal, green, purple or blue. No soft shading, airbrush, gradients, glow,
bloom, painterly rendering, 3D render look or photorealism. No text, letters, sound effects,
speech bubbles, logos, signatures or watermarks (all lettering is added by the site).
```

### `+UTILITY`: for textures, masks and FX sprites
```
Flat graphic design asset. Pure black, pure white and (only where stated) crimson red #E00B25.
No characters, no scenery, no text, no logos, no watermark. Even, shadowless lighting.
```

---

## 1. Textures and FX sprites

### ★ `paper-grain.png`
- **Use:** tiled texture across the whole site, multiplied over the page colour
- **Size:** 2048 × 2048, must tile seamlessly
```
Seamless tileable texture of smooth white manga paper (#F5F5F0), cool neutral with no warm or
yellow cast. Flat top-down scan, no lighting falloff, vignette or shadows. Very fine neutral-grey
fibres and a few extremely faint black ink specks. Very low contrast — barely visible. Edges wrap
perfectly on all four sides. No folds, stains or creases.
+UTILITY
```

### ★ `paper-back.png`
- **Use:** the back face of the cover as it turns over (the credits page sits on top)
- **Size:** 2752 × 1536 (16:9)
```
Flat scan of the inside of a manga volume cover: plain white paper with faint ghosted
show-through of bold black ink artwork and a red block bleeding through from the other side —
mirrored, blurred and very low contrast (about 8% visibility). No tint, no gradient, no creases,
no readable text.
+UTILITY
```

### ★ `ink-splat-01.png` … `ink-splat-05.png` (five files)
- **Use:** shapes for the *ink bleed* transition. **Pure black ink on pure white**, nothing else.
- **Size:** 2048 × 2048 each

Base prompt (same for all five, then append the variation line):
```
A single splash of thick black india ink on a pure white (#FFFFFF) background, photographed flat
from directly above. Pure black ink only, high contrast, razor-sharp organic edges with natural
satellite droplets and fine spatter. No grey tones, no paper texture, no shadow, no colour,
nothing else in frame. The ink shape is roughly centred and fills about 70% of the frame.
+UTILITY
```
| File | Variation line to append |
|---|---|
| `ink-splat-01.png` | `Shape: one large heavy round blot that burst on impact, with radiating splash arms and many small droplets around it.` |
| `ink-splat-02.png` | `Shape: a wide diagonal brush-flung spray from lower-left to upper-right, streaky and directional, with long tapering droplets.` |
| `ink-splat-03.png` | `Shape: ink poured from the top edge of the frame running downward in 6–8 long vertical drips of different lengths with rounded bulb ends; the top edge of the frame is fully black.` |
| `ink-splat-04.png` | `Shape: a cluster of three overlapping blots of different sizes merging together, with feathered bleeding edges as if soaking into absorbent paper.` |
| `ink-splat-05.png` | `Shape: a fine dense spatter field from a flicked brush, hundreds of tiny dots of varied size, denser in the centre and thinning toward the edges.` |

### ★ `burst-sfx.png`
- **Use:** the impact burst behind the "ドドドド!" smash transition
- **Size:** 2048 × 2048, **pure white background**
```
A manga impact explosion burst, centred, filling 85% of the frame. Jagged irregular starburst
with 14–18 sharp spikes of uneven length, hand-inked with a thick bold black brush outline. The
interior is flat crimson red (#E00B25) with red screentone dots, and a smaller jagged white
starburst at the centre. Black debris shards and speed flecks fly outward around it. Pure white
background, nothing else. The centre is EMPTY — no lettering.
+UTILITY
```

### ☆ `speedlines-radial.png`
- **Use:** focus lines rushing past during the *panel dive* zoom
- **Size:** 2752 × 1536 (16:9), **pure white background**
```
Hand-inked manga focus lines (radial speed lines) converging toward an empty white oval at the
exact centre of the frame (the oval takes up about 35% of the width). Hundreds of tapered black
ink strokes of varied length and thickness radiating inward from the frame edges, thick at the
edges and tapering to needle points, irregular spacing. Pure black on pure white only.
+UTILITY
```

---

## 2. Cover

### ★ `cover-islamabad.png`
- **Use:** the illustrated backdrop of the cover, behind the masthead and portrait
- **Size:** 2752 × 1536 (16:9)
- **Readability rule:** the black "HAMZA" masthead sits over the **left 55%**, so keep that region mostly white with light focus lines.
```
Dramatic manga splash-page backdrop: the Faisal Mosque in Islamabad on the right third of the
frame, drawn in bold black ink with dense hatching on its tent-like roof and four needle-sharp
minarets, seen from a low, heroic angle. Behind it, a huge flat crimson red sun disc cut by
jagged black clouds. Radiating focus lines burst outward from the mosque across the whole frame.
The left 55% of the frame is white paper with only thin focus lines and a band of screentone
along the bottom edge.
+PLATE
```

### ☆ `og-cover.png`
- **Use:** preview image when the site link is shared (LinkedIn, WhatsApp…)
- **Size:** 1200 × 630
```
Manga volume cover composition, landscape, no people. On the right half, a dip pen and a
stylus crossed like two swords, drawn in bold black ink with hatched shadows, ink dripping from
the pen nib. A flat crimson red slab slashes diagonally behind them with radiating focus lines.
The left half is plain white paper (a title will be added later).
+PLATE
```

---

## 3. Chapter plates

### ★ `ch1-origin.png`: Part 1 · Origin Story
- **Use:** tall panel beside the About text
- **Size:** 2048 × 2560 (4:5 portrait)
```
A dramatic still-life on a rooftop ledge at night, no people: an open laptop whose screen is
pure white negative space, and a dip pen standing upright in an ink pot beside it, both seen from
a heroic low angle. Behind them the frame splits down the middle with a jagged line: the left
half is a storm of fine geometric circuit lines and code brackets erupting from the laptop, the
right half a storm of ink splashes and brush strokes erupting from the pen. Dense black night sky
with white focus lines. The largest ink splash is flat crimson red.
+PLATE
```

### ★ `ch2-journey.png`: Part 2 · The Story So Far (title card)
- **Use:** the full-screen card that opens the comic strip (the panel the camera dives into)
- **Size:** 2752 × 1536 (16:9)
- **Readability rule:** the black chapter title sits over the **left half**, so keep it white and quiet.
```
Wide manga establishing panel: a tiny, faceless lone figure seen from far behind, walking down a long road toward
three towering, ornate stone gateways on the right half of the frame, each gate darker and more
menacing than the last, drawn in heavy ink with hatching. A long hatched shadow trails behind
him; his scarf is flat crimson red. A huge white sky with streaming horizontal speed lines. The
left half of the frame is white paper with only a thin horizon line.
+PLATE
```

### ★ `exp-kdd.png`: Computer Vision Intern
- **Size:** 2048 × 1536 (4:3)
```
Manga action panel, no faces: a single hand thrusts toward the viewer in dramatic
foreshortening in a dark lab; floating in front of the palm is a giant mechanical eye made of
lens rings and aperture blades, drawn in precise black ink, with targeting brackets and scan
lines crackling around it. Heavy black shadows, screentone on the walls, focus lines from the eye.
The iris of the mechanical eye is flat crimson red.
+PLATE
```

### ★ `exp-mlabs.png`: Game Designer Intern
- **Size:** 2048 × 1536 (4:3)
```
Manga action panel: two hands in extreme foreshortening pull back a carved slingshot toward the
viewer, aiming at a miniature floating game world of stacked blocks and platforms hovering above
a desk of sketches, dice and a game controller. Speed lines and impact flecks, heavy hatching,
screentone on the desk. The projectile in the slingshot's pouch is a flat crimson red ball.
+PLATE
```

### ★ `exp-societies.png`: Graphic Designer (FAST societies)
- **Use:** panel art
- **Size:** 2048 × 1536 (4:3)
```
Manga panel, no people: a cluttered design desk late at night, a single brush standing upright
like a sword stuck in the desk, with posters and magazine pages (layout blocks only, NO readable
text) swirling around it in a vortex. A single desk lamp throws a hard white cone of light into dense black
shadow and hatching. One poster in the swirl carries a bold flat crimson red shape.
+PLATE
```

### ★ `ch3-arsenal.png`: Part 3 · The Arsenal (banner)
- **Size:** 2752 × 1180 (wide banner, ~21:9)
```
Wide manga banner panel of an armoury wall: tools hung in rows like legendary weapons — a
mechanical keyboard, a game controller, a microchip, a magnifying glass, a soldering iron, a
stylus, a router with antennae, an arcade joystick, a floppy disk — each drawn in bold ink with
dramatic hatched shadows and a halo of focus lines. In the centre, an empty bracket wrapped in a
flat crimson red ribbon. Black background with white speed lines.
+PLATE
```

### ★ `ch4-powers.png`: Part 5 · Powers & Abilities (your Stand, on its own)
- **Use:** shown in the dossier card above the Stand stats chart (your real photo stays above it)
- **Size:** 1536 × 1536 (1:1), **plain white background**
```
A tall humanoid guardian spirit floating in a flamboyant pose — torso twisted, one arm extended
with fingers splayed — its body split down the middle: one half built from sleek circuit-board
plating and code-bracket shapes, the other half from flowing ink brush strokes and curling paper.
Its face is a sharp, featureless mask (no human likeness). Drawn in bold ink with screentone and
hatching; a flat crimson red aura outlines the whole figure. Plain white background with a few
radiating focus lines behind it.
+PLATE
```

### ★ `epilogue-signal.png`: Final Part · Send a Signal
- **Size:** 2752 × 1536 (16:9)
- **Readability rule:** white "SEND A SIGNAL" lettering sits over the **left half**, so keep that side solid black.
```
Night manga panel, no people: on the right, a huge searchlight mounted on a rooftop ledge, its beam a slash of pure white cutting diagonally up through a black sky of
dense cross-hatched clouds and striking an empty white circle on them. A city skyline silhouette
below with small white windows. A flat crimson red pennant whips from the searchlight. The left
half of the frame is almost solid black.
+PLATE
```

### ★ `back-cover.png`: the back cover (revealed as the last page turns)
- **Size:** 2752 × 1536 (16:9)
- **Rule:** keep the **lower-left third** plain (a "Next issue" box sits there).
```
Manga volume back cover, no people: a flat crimson red background with red screentone, and on
the right a bold black ink silhouette of the Islamabad skyline with the Faisal Mosque's minarets,
focus lines bursting from behind it. The lower-left third is plain flat red.
+PLATE
```

---

## 4. Optional: project card art (☆)

- **Use:** illustrated header on each project card in The Arsenal
- **Size:** 1536 × 1024 (3:2) each
- **Composition rule for all:** one dramatic central subject, focus lines behind it, bold ink and screentone, ONE flat crimson red element. End each with `+PLATE`.

| File | Subject line |
|---|---|
| `proj-echo.png` | `A megaphone erupting a storm of paper notices and empty speech-bubble shapes over a crowd of tiny students; one notice is red.` |
| `proj-retinaverse.png` | `A huge staring human eye seen front-on, its retina a branching web of vessels, a lens ring around it; the iris is red.` |
| `proj-tumorscope.png` | `A brain in profile under a magnifying glass, one region filled red, scan lines cutting across it.` |
| `proj-emotrack.png` | `Four manga faces in a 2×2 grid showing joy, anger, surprise and sadness, each in thin tracking brackets; the angry face is red.` |
| `proj-resling.png` | `A slingshot mid-release in extreme foreshortening, a small round red character-ball flying out with speed lines.` |
| `proj-spaceshooter.png` | `A chunky retro spaceship firing twin red beams at an asteroid against a black starfield with speed lines.` |
| `proj-pacman.png` | `A round chomping red maze-runner charging along a maze corridor of dots, a menacing ghost behind it.` |
| `proj-peersync.png` | `Two laptops facing off like duelists, a stream of folders blasting between them along a dotted arc; one folder is red.` |
| `proj-dupcleaner.png` | `Two identical photographs, one being smashed into a bin by a sweeping broom with impact lines; the broom is red.` |

---

## Tips for Nano Banana
- **Never name a franchise, series or artist in the prompt** (e.g. JoJo, Araki). Gemini refuses
  style-imitation requests that name copyrighted works with a generic "I don't seem to have access
  to that content". The style block describes the look instead, and that's enough.
- Set the aspect ratio in the tool before generating rather than relying on the prompt.
- Keep `+PLATE` word for word across the set; consistency is what makes it read as one volume.
- If results drift into colour or soft shading, put "black ink, screentone and one flat crimson
  red only — manga page, no other colours" at the START of the prompt and regenerate.
- Ink splats, the burst and the speed lines need a true white background: the code uses them
  as masks or blends the white away.
