#!/usr/bin/env node
/**
 * Simple downloader to fetch the first image from given product pages
 * and wire them into src/data/ebikes.json.
 *
 * Usage: node scripts/download-missing-images.js
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const projectRoot = path.join(__dirname, '..')
const publicImgRoot = path.join(projectRoot, 'public', 'img')
const ebikesFile = path.join(projectRoot, 'src', 'data', 'ebikes.json')

// Per-bike simple list; we will process one by one in the terminal to avoid hangs.
const targets = [
  {
    id: '550e8400-e29b-41d4-a716-446655440115', // RadCity 5 Plus
    url: 'https://fietstest.nl/fietsen/elektrische-stadsfietsen/rad-power-bikes-radcity-5-plus-2022/',
    folder: 'Rad Power Bikes RadCity 5 Plus'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440116', // Aventon Soltera 2
    url: 'https://www.aventon.com/en-ca/products/soltera-2-ebike?srsltid=AfmBOorbxENkgm_B1f6bKaXQ_Mt-3n2Fjxtl9Yx2O_-LuEW072y3mJRN&variant=42472444952771',
    folder: 'Aventon Soltera 2'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440107', // Urban Arrow Family
    url: 'https://www.hetzwartefietsenplan.com/nl/urban-arrow-fietsmerk/35712-27326-urban-arrow-family-active-plus-connected-2025-zwart-bes3.html#/1730-maat-uni_155_200cm/2234-kleur-zwart',
    folder: 'Urban Arrow Family'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440108', // Riese & Müller Load 75
    url: 'https://www.urbanebikes.nl/riese-muller-load-75?srsltid=AfmBOoow9BFUanCwkBiYSlBEyJ78kyBMgrye78-1qZVjxpZyA8YnKWue',
    folder: 'Riese & Müller Load 75'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440110', // Tern Vektron S10
    url: 'https://www.debakfietsenspecialist.nl/tn-0019-vektron-s10-forest-green',
    folder: 'Tern Vektron S10'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440117', // Tern GSD S00
    url: 'https://www.debakfietsenspecialist.nl/tn-0019-vektron-s10-forest-green', // same page; manual curation later if needed
    folder: 'Tern GSD S00'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440128', // Cube Longtail Sport Hybrid 725
    url: 'https://fietsenwinkel.nl/cube-longtail-sport-hybrid-725',
    folder: 'Cube Longtail Sport Hybrid 725'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440118', // Cube Stereo Hybrid 140 HPC SL 750
    url: 'https://www.cubestores.nl/products/cube-stereo-hybrid-140-hpc-slx-750-carbon-reflex-2023',
    folder: 'Cube Stereo Hybrid 140 HPC SL 750'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440100', // Trek FX+ 1
    url: 'https://www.trekbikes.com/nl/nl_NL/fietsen/mountainbikes/elektrische-mountainbikes/fuel-exe/fuel-exe-9-7/p/36360/',
    folder: 'Trek FX+ 1'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440106', // Trek Fuel EXe 9.7
    url: 'https://www.trekbikes.com/nl/nl_NL/fietsen/mountainbikes/elektrische-mountainbikes/fuel-exe/fuel-exe-9-7/p/36360/',
    folder: 'Trek Fuel EXe 9.7'
  }
]

const imageRegex = /https?:[^"']+\\.(?:jpg|jpeg|png|webp|avif)/gi

async function fetchText(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed fetch ${url} ${res.status}`)
  return res.text()
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

function cleanFilename(url) {
  const parsed = new URL(url)
  const base = path.basename(parsed.pathname)
  const safe = base.replace(/[^a-zA-Z0-9._-]/g, '_')
  return safe || 'image.jpg'
}

async function downloadImage(url, destPath) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Download failed ${url} ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  fs.writeFileSync(destPath, buf)
}

function updateEbikesJson(updates) {
  const data = JSON.parse(fs.readFileSync(ebikesFile, 'utf8'))
  let changed = 0
  data.forEach(e => {
    const u = updates[e.id]
    if (u) {
      e.image_url = u.main
      e.images = u.images
      changed++
    }
  })
  fs.writeFileSync(ebikesFile, JSON.stringify(data, null, 2))
  return changed
}

async function run() {
  const updates = {}
  for (const target of targets) {
    try {
      console.log(`Fetching page for ${target.folder} ...`)
      const html = await fetchText(target.url)
      const matches = [...html.matchAll(imageRegex)].map(m => m[0])
      const first = matches.find(m => !m.toLowerCase().includes('icon') && !m.toLowerCase().includes('logo'))
      if (!first) {
        console.warn(`No image found for ${target.folder}`)
        continue
      }
      const folderPath = path.join(publicImgRoot, target.folder)
      ensureDir(folderPath)
      const filename = cleanFilename(first)
      const dest = path.join(folderPath, filename)
      console.log(`Downloading ${first} -> ${dest}`)
      await downloadImage(first, dest)
      const relPath = `/img/${target.folder}/${filename}`
      updates[target.id] = { main: relPath, images: [relPath] }
    } catch (err) {
      console.warn(`Failed ${target.folder}:`, err.message)
    }
  }

  const changed = updateEbikesJson(updates)
  console.log(`Updated ${changed} entries in ebikes.json`)
}

run()
  .then(() => console.log('Done'))
  .catch(err => {
    console.error(err)
    process.exit(1)
  })

