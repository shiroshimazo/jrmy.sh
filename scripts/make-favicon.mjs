import sharp from "sharp";

const SRC = "src/assets/logo.png";
const OUT = "public/logo.png";
const SIZE = 256; // favicon canvas
const MARGIN = 0.1; // 10% breathing room around the logo

// 1) Trim the empty padding down to the actual logo content.
const trimmed = await sharp(SRC).trim({ threshold: 10 }).toBuffer();
const meta = await sharp(trimmed).metadata();

// 2) Scale content to fill the canvas minus a small margin, keeping aspect ratio.
const inner = Math.round(SIZE * (1 - MARGIN * 2));
const resized = await sharp(trimmed)
  .resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .toBuffer();

// 3) Center on a square transparent canvas.
await sharp({
  create: {
    width: SIZE,
    height: SIZE,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  },
})
  .composite([{ input: resized, gravity: "center" }])
  .png()
  .toFile(OUT);

console.log(`Trimmed content: ${meta.width}x${meta.height} -> favicon ${SIZE}x${SIZE} (margin ${MARGIN * 100}%)`);
