/**
 * Génère les icônes de l'application sans dépendance externe.
 *
 * La marque est le point : « ● une course a eu lieu » est tout le
 * vocabulaire du design system, et un disque reste lisible à 16 px là où
 * un mot ne l'est plus.
 *
 *   node scripts/make-icons.mjs
 */

import { deflateSync } from 'node:zlib'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public')

const INK = [0x17, 0x18, 0x1a]
const PAPER = [0xf2, 0xf3, 0xf2]

const CRC_TABLE = (() => {
  const table = new Int32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    table[n] = c
  }
  return table
})()

function crc32(buffer) {
  let c = 0xffffffff
  for (const byte of buffer) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const length = Buffer.alloc(4)
  length.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([length, body, crc])
}

/** PNG truecolore 8 bits, sans transparence — l'icône est toujours pleine. */
function encodePng(size, pixels) {
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8 // profondeur
  ihdr[9] = 2 // truecolor
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(pixels, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

/**
 * Dessine un disque centré, anticrénelé par sur-échantillonnage 4×4.
 * @param {number} size côté de l'image en pixels
 * @param {number} ratio diamètre du point, en fraction du côté
 */
function drawDot(size, ratio) {
  const stride = size * 3 + 1
  const pixels = Buffer.alloc(stride * size)
  const centre = size / 2
  const radius = (size * ratio) / 2
  const SUB = 4

  for (let y = 0; y < size; y++) {
    const row = y * stride
    pixels[row] = 0 // filtre « none »
    for (let x = 0; x < size; x++) {
      let inside = 0
      for (let sy = 0; sy < SUB; sy++) {
        for (let sx = 0; sx < SUB; sx++) {
          const px = x + (sx + 0.5) / SUB - centre
          const py = y + (sy + 0.5) / SUB - centre
          if (px * px + py * py <= radius * radius) inside++
        }
      }
      const alpha = inside / (SUB * SUB)
      const offset = row + 1 + x * 3
      for (let c = 0; c < 3; c++) {
        pixels[offset + c] = Math.round(INK[c] + (PAPER[c] - INK[c]) * alpha)
      }
    }
  }
  return encodePng(size, pixels)
}

const FAVICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="#17181a"/>
  <circle cx="16" cy="16" r="6" fill="#f2f3f2"/>
</svg>
`

mkdirSync(OUT, { recursive: true })

const files = [
  ['icon-192.png', drawDot(192, 0.38)],
  ['icon-512.png', drawDot(512, 0.38)],
  // Maskable : le point tient dans la zone sûre de 80 %.
  ['icon-maskable-512.png', drawDot(512, 0.28)],
  ['apple-touch-icon.png', drawDot(180, 0.38)],
  ['favicon.svg', Buffer.from(FAVICON, 'utf8')],
]

for (const [name, data] of files) {
  writeFileSync(join(OUT, name), data)
  console.log(`${name} — ${data.length} o`)
}
