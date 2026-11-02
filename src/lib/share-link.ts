import type { AccessoryQuantities, Setup } from './setup';
import { parseSetup } from './setup';

const QUANTITY_SEPARATOR = '*';

/** Readable on purpose: ?desk=electric-desk&extras=monitor*2,lamp&weeks=4 */
export function setupToSearchParams(setup: Setup): URLSearchParams {
  const extras = Object.entries(setup.accessories).map(([id, quantity]) =>
    quantity === 1 ? id : `${id}${QUANTITY_SEPARATOR}${quantity}`,
  );
  return new URLSearchParams({
    desk: setup.deskId,
    chair: setup.chairId,
    extras: extras.join(','),
    weeks: String(setup.weeks),
    theme: setup.theme,
    time: setup.timeOfDay,
  });
}

export function setupFromSearchParams(params: URLSearchParams): Setup | null {
  if (!params.has('desk')) return null;

  const accessories: Record<string, number> = {};
  for (const entry of (params.get('extras') ?? '').split(',').filter(Boolean)) {
    const [id, quantity = '1'] = entry.split(QUANTITY_SEPARATOR);
    accessories[id] = Number(quantity);
  }

  return parseSetup({
    deskId: params.get('desk'),
    chairId: params.get('chair'),
    accessories: accessories as AccessoryQuantities,
    weeks: Number(params.get('weeks')),
    theme: params.get('theme'),
    timeOfDay: params.get('time'),
  });
}

export function shareUrl(setup: Setup, origin: string): string {
  return `${origin}/?${setupToSearchParams(setup)}`;
}
