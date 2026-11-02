export const DELIVERY_AREAS = [
  'Canggu',
  'Seminyak',
  'Ubud',
  'Uluwatu',
  'Sanur',
  'Denpasar',
] as const;

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** yyyy-mm-dd in the visitor's own timezone, the format a date input expects. */
export function dateInputValue(date: Date): string {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
  return local.toISOString().slice(0, 10);
}

export function daysFromNow(days: number, now: Date = new Date()): string {
  return dateInputValue(new Date(now.getTime() + days * MS_PER_DAY));
}

export function formatDeliveryDate(value: string): string {
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}
