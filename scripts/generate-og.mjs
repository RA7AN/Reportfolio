// renders the site's og share card (app/opengraph-image.png) from the same
// textbook-style feedforward net that the boot curtain uses — keep the geometry
// in sync with components/layout/IntroGate.tsx.
// run: node scripts/generate-og.mjs
import sharp from 'sharp';

const R = 8;
const RING = 2.5;
const EDGE = 1.5;
// platform colors, layer by layer: muted -> foreground -> note
const RING_COLORS = ['#a1a099', '#edebe6', '#edebe6', '#e8b923'];
const LAYERS = [
  { x: 12, ys: [19, 37, 55, 73] },
  { x: 54, ys: [10, 28, 46, 64, 82] },
  { x: 96, ys: [28, 46, 64] },
  { x: 138, ys: [37, 55] },
];
const PULSE = [
  [12, 37, 54, 28],
  [54, 28, 96, 28],
  [96, 28, 138, 37],
];

const edgeLines = LAYERS.slice(0, -1)
  .flatMap((layer, li) =>
    layer.ys.flatMap((y1) =>
      LAYERS[li + 1].ys.map((y2) => ({ x1: layer.x, y1, x2: LAYERS[li + 1].x, y2 })),
    ),
  )
  .map(
    ({ x1, y1, x2, y2 }) =>
      `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#2c2c2c" stroke-width="${EDGE}"/>`,
  )
  .join('');
// the forward pass, drawn brighter than the passive synapses
const signal = PULSE.map(
  ([x1, y1, x2, y2]) =>
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#e8b923" stroke-width="3"/>`,
).join('');
const rings = LAYERS.flatMap((layer, li) =>
  layer.ys.map(
    (y) =>
      `<circle cx="${layer.x}" cy="${y}" r="${R}" fill="#0a0a0a" stroke="${RING_COLORS[li]}" stroke-width="${RING}"/>`,
  ),
).join('');

// faint pixel field, like the site's empty contribution cells
const field = [
  [96, 96],
  [1104, 88],
  [180, 476],
  [1016, 452],
  [80, 300],
  [1128, 264],
  [520, 60],
  [664, 556],
  [276, 156],
  [936, 132],
]
  .map(([x, y]) => `<rect x="${x}" y="${y}" width="16" height="16" fill="#171717"/>`)
  .join('');

// glyph is 150x92; scale 3.7 makes it 555x340, centered at x=322.5
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0a0a0a"/>
  ${field}
  <g transform="translate(322.5 48) scale(3.7)">${edgeLines}${signal}${rings}</g>
  <text x="600" y="492" text-anchor="middle" font-family="-apple-system,'Helvetica Neue',Arial,sans-serif" font-size="76" font-weight="600" letter-spacing="-2" fill="#edebe6">abdul jawwad</text>
  <text x="600" y="548" text-anchor="middle" font-family="Menlo,'SF Mono',monospace" font-size="30" fill="#a1a099">&gt; work in progress — rooms unfurnished</text>
  <g fill="#e8b923">
    <rect x="1122" y="548" width="14" height="14"/>
    <rect x="1140" y="548" width="14" height="14" opacity="0.65"/>
    <rect x="1122" y="566" width="14" height="14" opacity="0.65"/>
    <rect x="1140" y="566" width="14" height="14" opacity="0.4"/>
  </g>
  <g fill="#e8b923">
    <rect x="56" y="56" width="10" height="10" opacity="0.5"/>
    <rect x="72" y="56" width="10" height="10" opacity="0.3"/>
  </g>
</svg>`;

await sharp(Buffer.from(svg))
  .png()
  .toFile(new URL('../app/opengraph-image.png', import.meta.url).pathname);
console.log('wrote app/opengraph-image.png');
