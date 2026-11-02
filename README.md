# monis.rent — Workspace Studio

A responsive, interactive workspace rental concept for digital nomads in Bali. Build a setup in a live 3D room, change its mood, and download an itemized rental estimate.

## Run locally

Requires Node.js 20.9+ (Node 22 or 24 recommended) and npm.

```bash
npm ci
npm run dev
```

Open http://localhost:3000. No API keys or environment variables are needed.

```bash
npm run typecheck
npm test
npm run build
npm start
```

Browser integration tests cover selections, duration pricing, accessory removal, downloads, persistence, and mobile overflow. Run `npx playwright test` with Google Chrome installed at `/usr/bin/google-chrome`, or set `CHROME_PATH` to its executable. The test configuration starts a development server automatically or reuses one on port 3000. Screenshots are saved to `/tmp/monis-desktop.png` and `/tmp/monis-mobile.png`.

## Features

- Two desks and two chairs, with distinct original models and illustrations.
- Toggle monitor, lamp, plant, and rug accessories in the live Three.js room.
- Orbit, zoom, reset the camera, and expand the preview; Escape closes the expanded view.
- Coral, sage, and lavender themes update CSS variables and the room materials.
- One, three, and six month estimates, including illustrative long-stay discounts.
- Itemized review dialog with accessory removal and downloadable text estimate.
- Validated localStorage persistence; start fresh restores defaults.
- Responsive desktop/mobile layout, labeled controls, native modal focus handling, and reduced-motion support.
- Framer Motion category transitions and shared tab indicator.

## Stack and structure

Next.js App Router, React, TypeScript, Framer Motion, Three.js, React Three Fiber, Drei, and Lucide icons. Styling uses CSS with theme variables. All furniture illustrations and 3D geometry are authored in the source; no model downloads are needed. Google Fonts supplies DM Sans and Manrope, with system fallbacks if unavailable.

```text
src/app/                  Page shell, metadata, and responsive styles
src/components/studio.tsx Builder state, catalog, theme and checkout interactions
src/components/workspace-scene.tsx  Procedural 3D room, lights, camera controls
src/components/product-art.tsx      Original SVG product illustrations
src/lib/catalog.ts        Product data, pricing, saved-state validation
tests/catalog.test.ts     Pricing and persistence validation tests
```

The server-rendered page loads the interactive builder as a client component. The WebGL scene is dynamically imported without SSR. A single typed setup state drives the catalog, room, and checkout. Prices are stored as integer Indonesian rupiah and formatted for the Indonesian locale. The pure pricing function makes discount calculations independently testable. Saved browser data is validated against allowed catalog items, durations, and themes before use.

The room uses procedural geometry instead of external assets to keep the experience self-contained and make equipment changes immediate. An error boundary keeps the catalog and checkout usable if WebGL fails. Furniture is positioned intentionally rather than freely draggable; users orbit the room to inspect their selections.

## Scope and demo assumptions

This is a frontend prototype, not a live rental service. Product names, prices, dimensions, discount rules, and delivery statements are illustrative, not verified monis.rent offers. The estimate explicitly excludes unconfirmed delivery fees, taxes, and deposits. Downloading an estimate does not create a booking, charge a payment, or contact monis.rent. Preferences stay in this browser only.

Before production, integrate the real catalog/inventory, authoritative server-side pricing, delivery availability, booking API, payment provider, and applicable terms. No credentials should be placed in client code.

## Deployment and GitHub handoff

Deployment and repository management are intentionally left to you. On Vercel, import your GitHub repository, select the Next.js framework, keep the root directory at the repository root, and use `npm run build`. Other Node-compatible Next.js hosts can run `npm ci`, `npm run build`, and `npm start`.

After publishing, add the public URL to this README and the GitHub repository description. Add `desent-bot` through the repository's **Settings → Collaborators** and verify the invitation. Review the existing Git changes before committing: this checkout already contained deletions of an older frontend/backend project before this implementation.

## Manual acceptance check

1. Switch between both desks and both chairs and inspect their 3D geometry.
2. Toggle every accessory and confirm the preview and price change together.
3. Change themes, orbit/zoom, reset the camera, and expand/close the room.
4. Select 3 or 6 months and verify the discount in the review dialog.
5. Remove an accessory in the dialog and download the updated estimate.
6. Reload to confirm persistence; start fresh to restore defaults.
7. Check at a narrow mobile width and navigate controls with a keyboard.
