export type RentalPlan = {
  weeks: number;
  label: string;
  hint: string;
  discount: number;
};

/**
 * Mirrors monis.rent's published rules: a month is billed as four weeks,
 * and stays of three months or more get 10% off.
 */
export const RENTAL_PLANS: RentalPlan[] = [
  { weeks: 1, label: '1 week', hint: 'Just landed', discount: 0 },
  { weeks: 4, label: '1 month', hint: 'Settling in', discount: 0 },
  { weeks: 12, label: '3 months', hint: 'Save 10%', discount: 0.1 },
  { weeks: 24, label: '6 months', hint: 'Save 10%', discount: 0.1 },
];

export function isRentalLength(weeks: unknown): weeks is number {
  return RENTAL_PLANS.some((plan) => plan.weeks === weeks);
}

export function planFor(weeks: number): RentalPlan {
  return RENTAL_PLANS.find((plan) => plan.weeks === weeks) ?? RENTAL_PLANS[0];
}
