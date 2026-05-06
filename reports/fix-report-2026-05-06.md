# Fix Report

Generated: 2026-05-06

## Fixed

- Replaced the global `App.vue` `<main>` wrapper with a non-landmark wrapper so route-level `<main>` elements are no longer nested or duplicated.
- Added accessible names to e-bike list filter selects, review filter controls, review star buttons, contact preference radios, the Google Maps iframe, and icon-only e-bike list buttons.
- Added a screen-reader-only H1 to the default e-bike list route.
- Repointed broken Reviews page image URLs to assets that exist in `public/img`.
- Fixed case-sensitive CUBE Longtail image paths in `src/data/ebikes.json`.
- Added `jsdom` and `@vue/test-utils` test dependencies.
- Updated npm scripts to call local Node entry points directly, avoiding broken Windows `.bin` shims in workspace paths with spaces.
- Aligned Vite and Playwright development server ports on `5173`.
- Removed accidental Vite/Vitest config code from `src/test/setup.ts`.

## Verification

- `npm run build`: passed.
- `npm run test:unit`: starts and collects tests, but fails because existing tests assert stale APIs/components that are no longer present or no longer behave as written.

## Deployment

- Production deployment completed with Vercel CLI using a temporary token.
- Production URL: https://ebikes-vergelijker-ztl7-6tifgwfcd-digital-team-one.vercel.app
- Inspect URL: https://vercel.com/digital-team-one/ebikes-vergelijker-ztl7/9QxSBEZVT8tUG3DH3g55qdGWDq16

## Manual Tasks

- Replace or update stale unit tests for the removed `EBikeCard.vue`, current auth store API, current e-bike store behavior, and current event tracking service behavior.
- Review existing npm audit findings: 13 vulnerabilities were reported after dependency install.
- Rotate or revoke the Vercel token after this deployment if it was intended as a one-time credential.
