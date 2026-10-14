import sharp from "sharp";

// The 1.75 MB master is not committed — the generated sizes below are. Drop
// the full-size portrait back at this path before re-running.
const SRC = "src/assets/profile.jpg";

// The hero renders the portrait inside a 120 CSS px circle with
// object-fit: cover, so a centre-cropped square is pixel-identical to the
// full 1109x1419 source. Ship 2x/3x only and leave the original as the master.
const SIZES = [240, 360];

for (const size of SIZES) {
  const square = () =>
    sharp(SRC).resize(size, size, { fit: "cover", position: "centre" });

  const webp = await square().webp({ quality: 82 }).toBuffer();
  const jpg = await square()
    .jpeg({ quality: 82, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toBuffer();

  await sharp(webp).toFile(`src/assets/profile-${size}.webp`);
  await sharp(jpg).toFile(`src/assets/profile-${size}.jpg`);

  console.log(`profile-${size}: webp ${webp.length} B · jpg ${jpg.length} B`);
}