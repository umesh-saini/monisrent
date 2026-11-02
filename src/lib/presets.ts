import { productsIn, type AccessoryId, type ChairId, type DeskId } from './catalog';
import type { AccessoryQuantities, Setup } from './setup';

export type Preset = {
  id: string;
  name: string;
  deskId: DeskId;
  chairId: ChairId;
  accessories: AccessoryQuantities;
};

export const PRESETS: Preset[] = [
  {
    id: 'basics',
    name: 'Just the basics',
    deskId: 'electric-desk',
    chairId: 'ergonomic-chair',
    accessories: { monitor: 1, keyboard: 1, mouse: 1 },
  },
  {
    id: 'founder',
    name: 'The founder',
    deskId: 'dual-motor-desk',
    chairId: 'ergonomic-chair',
    accessories: {
      monitor: 2,
      keyboard: 1,
      mouse: 1,
      lamp: 1,
      whiteboard: 1,
      'coffee-machine': 1,
    },
  },
  {
    id: 'trader',
    name: 'The trader',
    deskId: 'dual-motor-desk',
    chairId: 'ergonomic-chair',
    accessories: { monitor: 3, keyboard: 1, mouse: 1, lamp: 1, 'tower-fan': 1 },
  },
  {
    id: 'bali-dream',
    name: 'The Bali dream',
    deskId: 'mechanical-desk',
    chairId: 'rattan-chair',
    accessories: {
      'laptop-stand': 1,
      lamp: 1,
      plant: 1,
      rug: 1,
      surfboard: 1,
      'coffee-machine': 1,
      speaker: 1,
    },
  },
];

export function applyPreset(setup: Setup, preset: Preset): Setup {
  return {
    ...setup,
    deskId: preset.deskId,
    chairId: preset.chairId,
    accessories: preset.accessories,
  };
}

export function matchesPreset(setup: Setup, preset: Preset): boolean {
  const sorted = (accessories: AccessoryQuantities) =>
    JSON.stringify(Object.entries(accessories).sort());
  return (
    setup.deskId === preset.deskId &&
    setup.chairId === preset.chairId &&
    sorted(setup.accessories) === sorted(preset.accessories)
  );
}

/** Rolls a random room. `random` is injectable so tests can pin the outcome. */
export function surpriseSetup(setup: Setup, random: () => number = Math.random): Setup {
  const pick = <T>(items: T[]): T => items[Math.floor(random() * items.length)];

  const accessories: AccessoryQuantities = {};
  for (const product of productsIn('accessories')) {
    if (random() < 0.45) {
      accessories[product.id as AccessoryId] =
        1 + Math.floor(random() * (product.maxQuantity ?? 1));
    }
  }

  return {
    ...setup,
    deskId: pick(productsIn('desks')).id as DeskId,
    chairId: pick(productsIn('chairs')).id as ChairId,
    accessories,
  };
}
