// Generates PWA icons from an SVG source
// Run with: node scripts/generate-pwa-icons.js
import sharp from 'sharp'
import { mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = join(__dirname, '..', 'public')

// SVG source - simple "TP" logo on gradient background
const createLogoSVG = (size, isMaskable = false) => {
  const padding = isMaskable ? size * 0.2 : 0
  const innerSize = size - padding * 2
  const fontSize = innerSize * 0.45

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#1e40af;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="${size}" height="${size}" rx="${isMaskable ? size * 0.15 : size * 0.2}" fill="url(#bg)" />
    <text
      x="50%"
      y="50%"
      text-anchor="middle"
      dominant-baseline="central"
      font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      font-size="${fontSize}"
      font-weight="700"
      fill="white"
      letter-spacing="${fontSize * 0.05}"
    >TP</text>
  </svg>`
}

async function generateIcon(size, filename, isMaskable = false) {
  const svg = Buffer.from(createLogoSVG(size, isMaskable))
  const outputPath = join(publicDir, filename)

  await sharp(svg)
    .resize(size, size)
    .png()
    .toFile(outputPath)

  console.log(`✓ Generated ${filename} (${size}x${size}${isMaskable ? ', maskable' : ''})`)
}

async function main() {
  if (!existsSync(publicDir)) {
    mkdirSync(publicDir, { recursive: true })
  }

  console.log('Generating PWA icons...\n')

  await generateIcon(192, 'pwa-192x192.png', false)
  await generateIcon(512, 'pwa-512x512.png', false)
  await generateIcon(192, 'pwa-maskable-192x192.png', true)
  await generateIcon(512, 'pwa-maskable-512x512.png', true)

  console.log('\n✅ All PWA icons generated successfully!')
}

main().catch(console.error)
