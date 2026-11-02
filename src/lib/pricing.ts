import { planFor } from './rental-plans';
import { lineItems, type Setup } from './setup';

export function quote(setup: Setup) {
  const plan = planFor(setup.weeks);
  const weeklyCents = lineItems(setup).reduce(
    (sum, { product, quantity }) => sum + product.weeklyCents * quantity,
    0,
  );
  const discountedWeeklyCents = Math.round(weeklyCents * (1 - plan.discount));

  return {
    plan,
    weeklyCents,
    discountedWeeklyCents,
    savedCents: (weeklyCents - discountedWeeklyCents) * plan.weeks,
    totalCents: discountedWeeklyCents * plan.weeks,
  };
}

export type Quote = ReturnType<typeof quote>;

export function money(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}
