#!/usr/bin/env node
/**
 * Updates ebikes.json with already-downloaded local images.
 * Run: node scripts/update-local-images.js
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ebikesFile = path.join(__dirname, '..', 'src', 'data', 'ebikes.json')

const updates = {
  '550e8400-e29b-41d4-a716-446655440109': {
    main: '/img/Brompton Electric P Line/Brompton-Electric-P-Line-Bolt-Blue-Mid-Bar-1.jpg',
    imgs: ['/img/Brompton Electric P Line/Brompton-Electric-P-Line-Bolt-Blue-Mid-Bar-1.jpg']
  },
  '550e8400-e29b-41d4-a716-446655440118': {
    main: '/img/Cube Stereo Hybrid 140 HPC SL 750/22_242.webp',
    imgs: ['/img/Cube Stereo Hybrid 140 HPC SL 750/22_242.webp']
  },
  '550e8400-e29b-41d4-a716-446655440112': {
    main: '/img/Gazelle Ultimate C380 HMB/product.webp',
    imgs: [
      '/img/Gazelle Ultimate C380 HMB/product.webp',
      '/img/Gazelle Ultimate C380 HMB/product (1).webp',
      '/img/Gazelle Ultimate C380 HMB/product (2).webp'
    ]
  },
  '550e8400-e29b-41d4-a716-446655440114': {
    main: '/img/Giant Trance E+ 3/MY22TranceXEplus3Pro29_ColorABlackDiamond.jpg',
    imgs: ['/img/Giant Trance E+ 3/MY22TranceXEplus3Pro29_ColorABlackDiamond.jpg']
  },
  '550e8400-e29b-41d4-a716-446655440119': {
    main: '/img/Kalkhoff Endeavour 7.B Move/kh0020030v2022_2023_27_di_gry_090_pre_endeavour-7-b-move-plus.jpg',
    imgs: ['/img/Kalkhoff Endeavour 7.B Move/kh0020030v2022_2023_27_di_gry_090_pre_endeavour-7-b-move-plus.jpg']
  },
  '550e8400-e29b-41d4-a716-446655440134': {
    main: '/img/Knaap LON/Knaaplon-600x600-1.webp',
    imgs: ['/img/Knaap LON/Knaaplon-600x600-1.webp']
  },
  '550e8400-e29b-41d4-a716-446655440133': {
    main: '/img/Knaap RTD X/KNAAP-RTD-X-Zwart-fatbikeskopen_nl.webp',
    imgs: [
      '/img/Knaap RTD X/KNAAP-RTD-X-Zwart-fatbikeskopen_nl.webp',
      '/img/Knaap RTD X/KNAAP-RTD-X-Zwart-fatbikeskopen_nl-2.webp',
      '/img/Knaap RTD X/KNAAP-RTD-X-Zwart-fatbikeskopen_nl-3.webp'
    ]
  },
  '550e8400-e29b-41d4-a716-446655440105': {
    main: '/img/Specialized Turbo Levo SL Comp/96820-50_LEVO-SL-COMP-DSTTUR-BLK_HERO.webp',
    imgs: [
      '/img/Specialized Turbo Levo SL Comp/96820-50_LEVO-SL-COMP-DSTTUR-BLK_HERO.webp',
      '/img/Specialized Turbo Levo SL Comp/96820-50_LEVO-SL-COMP-DSTTUR-BLK_RDSQ.webp',
      '/img/Specialized Turbo Levo SL Comp/96820-50_LEVO-SL-COMP-DSTTUR-BLK_FDSQ.webp'
    ]
  },
  '550e8400-e29b-41d4-a716-446655440101': {
    main: '/img/Specialized Turbo Vado SL 5.0 EQ/93920-32_VADO-SL-50-EQ-BRSH-BLKREFL_HERO.webp',
    imgs: [
      '/img/Specialized Turbo Vado SL 5.0 EQ/93920-32_VADO-SL-50-EQ-BRSH-BLKREFL_HERO.webp',
      '/img/Specialized Turbo Vado SL 5.0 EQ/93920-32_VADO-SL-50-EQ-BRSH-BLKREFL_FDSQ.webp',
      '/img/Specialized Turbo Vado SL 5.0 EQ/93920-32_VADO-SL-50-EQ-BRSH-BLKREFL_RDSQ.webp'
    ]
  },
  '550e8400-e29b-41d4-a716-446655440124': {
    main: '/img/SUPER73 ZX/SUPER73_MY24_ZX_SE_Bandit_FrontHero_7dd10438-c2c5-4e79-b2e9-0fa9caafe79f_800x.webp',
    imgs: [
      '/img/SUPER73 ZX/SUPER73_MY24_ZX_SE_Bandit_FrontHero_7dd10438-c2c5-4e79-b2e9-0fa9caafe79f_800x.webp',
      '/img/SUPER73 ZX/SUPER73_MY24_ZX_SE_Bandit_StudioRight_ed0b2277-3ef1-4849-a46d-d4bdda14e1b1_800x.webp',
      '/img/SUPER73 ZX/SUPER73_MY24_ZX_SE_Bandit_RearHero_eea32f4b-ee83-45a1-9d83-dedeb917218e_800x.webp'
    ]
  }
}

const data = JSON.parse(fs.readFileSync(ebikesFile, 'utf8'))
let changed = 0
data.forEach(e => {
  const u = updates[e.id]
  if (u) {
    e.image_url = u.main
    e.images = u.imgs
    changed++
  }
})

fs.writeFileSync(ebikesFile, JSON.stringify(data, null, 2))
console.log(`Updated entries: ${changed}`)


