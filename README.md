# monis.rent Workspace Studio

Design your Bali workspace in a live 3D room, then rent it.

A freelance developer lands in Bali and needs an office by next week. Instead of scrolling a
product list, they pick a desk, drop in three monitors, make the desk stand up, check how the
room feels at night, and go rent it.

**Live demo:** https://monisrent-three.vercel.app/

> This is a concept built for [monis.rent](https://monis.rent), not an official monis.rent site.
> It doesn't place orders or take payment.

## Write-up

**Approach.** The brief's user doesn't want a catalog, they want to get excited about a room. So the 3D room is the main event and the product list only feeds it: items drop in with a bounce, the desk really rises, and the room changes from day to night. It started from a working prototype whose code was minified and hard to follow. The first step was splitting that into small, readable files, checked by comparing screenshots pixel by pixel, and the new features came after. Using real monis.rent products and pricing rules keeps the tool honest, and anything invented is labelled.

**Tech choices.** Next.js and TypeScript for a fast static page and safe refactoring. React Three Fiber lets the room be ordinary React components driven by a single `Setup` object, so the room, price and checkout can't disagree. All furniture is built from code, so there are no model files to download. The canvas draws only while something is moving, which saves battery. CSS Modules keep the styles beside each component and the JSX easy to read.

**With more time.**

- Connect to monis.rent's real catalog and live availability, and pre-fill its cart so "Rent" takes one click instead of one link per item.
- Use its real delivery areas, fees and deposit rules in the checkout.
- Let people drag items to where they want them, rather than using fixed positions.
- Reduce the roughly 340 draw calls per frame by merging geometry, and test on real low-end phones. So far, automated tests have only run on software rendering.

## What it does

**Building a setup**

- Choose from 3 desks and 2 chairs, and stack up 12 extras. Monitors go up to three, and the row rearranges itself.
- Start from a preset ("The founder", "The Bali dream") or hit **Surprise me**.
- Watch each item drop into the room on a spring as you add it, and shrink away as you remove it.

**Playing with the room**

- **Stand up** raises the desk and everything on it, because real adjustable desks do that.
- Switch between daytime, golden hour and night. The lighting fades, the lamp starts to matter, and the Bali view outside the window changes.
- Click any object in the room to jump to it in the catalog.
- Orbit, zoom, and reset the camera. Pick a wall colour.

**Renting it**

- Review the setup with a picture of the room you actually built.
- Choose a delivery area and date.
- Finish with a direct link to each item on monis.rent, a shareable URL, and a poster image to save.

On phones the 3D preview stays pinned while you browse, so every pick is visible as you make it, and the Rent button is always in reach.

## Real data, labelled honestly

Product names, weekly prices and links come from monis.rent as listed on 2 Nov 2026. The pricing follows its published rules: a month is billed as four weeks, and stays of three months or more get 10% off.

monis.rent lists only one chair, and the brief asks for at least two. So the Rattan Chair, plus the plant, rug and surfboard, are our own **concept** items with illustrative prices. They're marked "Concept" everywhere they appear and have no rent link.

Prices are a snapshot, and availability isn't checked live. Delivery areas are examples, since monis.rent doesn't publish a list.

## Run it locally

Requires Node.js 20.9 or newer. No API keys or environment variables are needed.

```bash
npm ci
npm run dev
```

Then open http://localhost:3000.

| Command                | What it does                                  |
| ---------------------- | --------------------------------------------- |
| `npm test`             | Logic tests: pricing, validation, share links |
| `npm run test:browser` | Browser tests against the real app            |
| `npm run typecheck`    | TypeScript                                    |
| `npm run lint`         | ESLint                                        |
| `npm run format`       | Prettier                                      |
| `npm run build`        | Production build                              |

Browser tests need Google Chrome at `/usr/bin/google-chrome`, or set `CHROME_PATH`. They use software WebGL, so they don't need a GPU.

## How it's built

Next.js, React, TypeScript, Three.js through React Three Fiber, Framer Motion, and CSS Modules.

```text
src/
  lib/                 Pure logic, no React: easy to test
    catalog.ts         Every product and its price
    rental-plans.ts    Rental lengths and discounts
    pricing.ts         Turns a setup into a quote
    setup.ts           The Setup type, its changes, and validation
    presets.ts         Starter rooms and "Surprise me"
    share-link.ts      Setup <-> readable URL
    setup-card.ts      Draws the poster image
  hooks/               Saving the setup, loading shared links
  components/
    studio/            The page: catalog, preview panel, rental bar
    dialogs/           Checkout steps and help
    product-art/       SVG product illustrations, written as code
    scene/             The 3D room
      models/          Each piece of furniture, as code
      appear.tsx       The spring that drops items into the room
      lighting.tsx     Time-of-day lighting and fades
      window-view.ts   Paints the Bali view onto a canvas
      camera-rig.tsx   Orbit, framing, smooth reset
tests/                 Logic tests, and browser tests in tests/browser
```

A few decisions worth explaining:

- **One state object.** A single `Setup` drives the catalog, the room, the price and the checkout, so they can't disagree.
- **Everything 3D is code.** There are no model files to download, so the room loads quickly and changes instantly. The window view is painted at runtime too.
- **The canvas renders on demand.** It only draws while something is moving, so an idle tab doesn't drain a laptop battery.
- **Animation doesn't depend on frame rate.** Easing is time-based and the spring runs in fixed sub-steps, so a slow GPU sees fewer frames rather than slow motion.
- **Untrusted data gets validated.** Saved setups and share links both pass through `parseSetup`, so a tampered link can't produce a broken room.
- **Prices are integer cents.** That avoids floating-point rounding in totals.
