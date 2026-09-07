// Builds the email-signature assets that ship in /public/signature-assets.
//
// Why this exists: email clients download signature images on every open, and
// Outlook ignores object-fit/border-radius. So headshots must arrive already
// small and already circular — the source photos are 2000x2000 PNGs (3-6 MB),
// which is ~100x more than a 64px avatar needs.
//
// Sources live in /assets/signature-sources (not served). Run after adding a
// new teammate photo:  node scripts/build-signature-assets.mjs

import { readdir, mkdir, stat } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const SRC_DIR = 'assets/signature-sources'
const OUT_DIR = 'public/signature-assets'

// Displayed at 64px / 38px in the signature — 2x for retina, no more.
const HEADSHOT_PX = 128
const LOGO_PX = 76 // displayed at 38px, 2x for retina
const LOGO_MARK_PX = 76 // mark fills the canvas; gravity:'center' does the centring
const LINKEDIN_PX = 28 // displayed at 14px

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`

async function buildHeadshot(sourceFile) {
  const id = path.basename(sourceFile).replace(/-headshot-source\.png$/, '')
  const outPath = path.join(OUT_DIR, `${id}-headshot.png`)

  // Circular alpha mask, applied even though the sources are already cut out —
  // it guarantees a clean edge for any future photo dropped in as a square.
  const mask = Buffer.from(
    `<svg width="${HEADSHOT_PX}" height="${HEADSHOT_PX}">` +
      `<circle cx="${HEADSHOT_PX / 2}" cy="${HEADSHOT_PX / 2}" r="${HEADSHOT_PX / 2}" fill="#fff"/>` +
      `</svg>`
  )

  await sharp(path.join(SRC_DIR, sourceFile))
    .resize(HEADSHOT_PX, HEADSHOT_PX, { fit: 'cover', position: 'attention' })
    .composite([{ input: mask, blend: 'dest-in' }])
    .png({ compressionLevel: 9, palette: true, quality: 90 })
    .toFile(outPath)

  const before = (await stat(path.join(SRC_DIR, sourceFile))).size
  const after = (await stat(outPath)).size
  console.log(`  ${id.padEnd(6)} ${kb(before).padStart(10)} -> ${kb(after)}`)
}

async function buildLogo() {
  const outPath = path.join(OUT_DIR, 'khyte-logo.png')

  // Rendered from the site's own mark so the signature never drifts from brand.
  // trim() strips the SVG's transparent margin and position:'left' pushes the
  // leftover slack to the right edge, so the mark's ink lines up with the
  // headshot above it instead of floating ~2px off the signature's left rail.
  const mark = await sharp('public/khyte-logo.svg', { density: 600 })
    .trim({ threshold: 1 })
    .resize(LOGO_MARK_PX, LOGO_MARK_PX, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .toBuffer()

  // Centre the trimmed mark on a square canvas matching the headshot's width,
  // so the logo and the photo above it share the same vertical centre line.
  await sharp({
    create: {
      width: LOGO_PX,
      height: LOGO_PX,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: mark, gravity: 'center' }])
    .png({ compressionLevel: 9 })
    .toFile(outPath)

  console.log(`  logo   ${kb((await stat(outPath)).size).padStart(10 + 4)}`)
}

// LinkedIn glyph. Drawn here rather than fetched so the build stays offline and
// there is no remote asset to rot. Inline SVG and CSS masks are stripped by
// Gmail and Outlook, so the icon has to arrive as a flat PNG at an absolute URL
// — and the rounded corner is baked in because Outlook's Word engine renders
// border-radius square. #0A66C2 is LinkedIn's official brand blue.
async function buildLinkedInIcon() {
  const outPath = path.join(OUT_DIR, 'linkedin.png')
  const svg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56">` +
      `<rect width="56" height="56" rx="6" fill="#0A66C2"/>` +
      `<circle cx="15.5" cy="14.5" r="4.3" fill="#fff"/>` +
      `<rect x="11.6" y="22" width="7.8" height="23" fill="#fff"/>` +
      `<path d="M24 22h7.5v3.2c1.2-1.9 3.4-3.7 6.9-3.7 6.1 0 9.1 3.7 9.1 10.6V45h-7.8V33.2c0-3.3-1.2-5.4-4.1-5.4-2.3 0-3.6 1.5-4.2 3-.2.5-.2 1.3-.2 2.1V45H24V22z" fill="#fff"/>` +
      `</svg>`
  )

  await sharp(svg, { density: 600 })
    .resize(LINKEDIN_PX, LINKEDIN_PX, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toFile(outPath)

  console.log(`  li     ${kb((await stat(outPath)).size).padStart(10 + 4)}`)
}

await mkdir(OUT_DIR, { recursive: true })

console.log('Building signature assets...')
const sources = (await readdir(SRC_DIR)).filter((f) => f.endsWith('-headshot-source.png'))
for (const file of sources.sort()) await buildHeadshot(file)
await buildLogo()
await buildLinkedInIcon()
console.log(`Done. ${sources.length} headshot(s) + logo + icon -> ${OUT_DIR}`)
