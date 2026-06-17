import { mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const iconsDir = join(root, "public", "icons");
const svg = readFileSync(join(root, "public", "logo.svg"));
const background = "#1B1B1D";

mkdirSync(iconsDir, { recursive: true });

async function createIcon(size, paddingRatio) {
  const padding = Math.round(size * paddingRatio);
  const inner = size - padding * 2;

  const logo = await sharp(svg).resize(inner, inner, { fit: "inside" }).png().toBuffer();

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background,
    },
  })
    .composite([{ input: logo, gravity: "center" }])
    .png()
    .toFile(join(iconsDir, `icon-${size}.png`));
}

async function createMaskableIcon(size) {
  const padding = Math.round(size * 0.2);
  const inner = size - padding * 2;

  const logo = await sharp(svg).resize(inner, inner, { fit: "inside" }).png().toBuffer();

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background,
    },
  })
    .composite([{ input: logo, gravity: "center" }])
    .png()
    .toFile(join(iconsDir, "icon-maskable-512.png"));
}

await createIcon(192, 0.18);
await createIcon(512, 0.18);
await createIcon(180, 0.18);
await createMaskableIcon(512);

await sharp(join(iconsDir, "icon-192.png"))
  .resize(32, 32)
  .toFile(join(root, "public", "favicon.ico"));

console.log("PWA icons generated in public/icons/");
