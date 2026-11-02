import {
  findProduct,
  products,
  type AccessoryId,
  type ChairId,
  type DeskId,
  type Product,
} from './catalog';
import { isRentalLength } from './rental-plans';

export const THEMES = ['coral', 'sage', 'lavender'] as const;
export type Theme = (typeof THEMES)[number];

export const TIMES_OF_DAY = ['day', 'golden', 'night'] as const;
export type TimeOfDay = (typeof TIMES_OF_DAY)[number];

export type AccessoryQuantities = Partial<Record<AccessoryId, number>>;

export type Setup = {
  deskId: DeskId;
  chairId: ChairId;
  accessories: AccessoryQuantities;
  weeks: number;
  theme: Theme;
  timeOfDay: TimeOfDay;
};

export const initialSetup: Setup = {
  deskId: 'electric-desk',
  chairId: 'ergonomic-chair',
  accessories: { monitor: 1, plant: 1 },
  weeks: 4,
  theme: 'coral',
  timeOfDay: 'day',
};

export type LineItem = { product: Product; quantity: number };

export function lineItems(setup: Setup): LineItem[] {
  return products.flatMap((product) => {
    const quantity = quantityOf(setup, product);
    return quantity > 0 ? [{ product, quantity }] : [];
  });
}

export function quantityOf(setup: Setup, product: Product): number {
  switch (product.category) {
    case 'desks':
      return setup.deskId === product.id ? 1 : 0;
    case 'chairs':
      return setup.chairId === product.id ? 1 : 0;
    case 'accessories':
      return setup.accessories[product.id as AccessoryId] ?? 0;
  }
}

/** Desks and chairs replace the current pick. Accessories toggle on and off. */
export function chooseProduct(setup: Setup, product: Product): Setup {
  switch (product.category) {
    case 'desks':
      return { ...setup, deskId: product.id as DeskId };
    case 'chairs':
      return { ...setup, chairId: product.id as ChairId };
    case 'accessories':
      return setQuantity(setup, product, quantityOf(setup, product) > 0 ? 0 : 1);
  }
}

export function setQuantity(setup: Setup, product: Product, quantity: number): Setup {
  const accessories = { ...setup.accessories };
  const clamped = Math.min(Math.max(quantity, 0), product.maxQuantity ?? 1);
  if (clamped === 0) delete accessories[product.id as AccessoryId];
  else accessories[product.id as AccessoryId] = clamped;
  return { ...setup, accessories };
}

function parseAccessories(value: unknown): AccessoryQuantities | null {
  if (!value || typeof value !== 'object') return null;

  const accessories: AccessoryQuantities = {};
  for (const [id, quantity] of Object.entries(value)) {
    const product = findProduct(id);
    if (product?.category !== 'accessories') return null;
    if (!Number.isInteger(quantity) || quantity < 1) return null;
    if (quantity > (product.maxQuantity ?? 1)) return null;
    accessories[id as AccessoryId] = quantity;
  }
  return accessories;
}

/**
 * Validates untrusted data from localStorage or a shared link against the catalog.
 * Returns null if anything is off, so a bad link can never produce a broken room.
 */
export function parseSetup(value: unknown): Setup | null {
  if (!value || typeof value !== 'object') return null;
  const candidate = value as Setup;
  const accessories = parseAccessories(candidate.accessories);

  const isValid =
    accessories !== null &&
    findProduct(candidate.deskId)?.category === 'desks' &&
    findProduct(candidate.chairId)?.category === 'chairs' &&
    isRentalLength(candidate.weeks) &&
    THEMES.includes(candidate.theme) &&
    TIMES_OF_DAY.includes(candidate.timeOfDay);
  if (!isValid) return null;

  return {
    deskId: candidate.deskId,
    chairId: candidate.chairId,
    accessories,
    weeks: candidate.weeks,
    theme: candidate.theme,
    timeOfDay: candidate.timeOfDay,
  };
}
