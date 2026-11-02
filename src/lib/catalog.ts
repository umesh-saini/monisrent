export type Category = 'desks' | 'chairs' | 'accessories';
export type Product = { id: string; name: string; subtitle: string; price: number; category: Category; badge?: string; color: string };
export const products: Product[] = [
  { id: 'oak', name: 'The Everyday Desk', subtitle: 'Natural oak · 120 × 60 cm', price: 350000, category: 'desks', badge: 'THE CROWD FAVORITE', color: '#d1a16d' },
  { id: 'standing', name: 'The Rise Desk', subtitle: 'Sit-to-stand · 140 × 70 cm', price: 550000, category: 'desks', badge: 'A LITTLE EXTRA FLEX', color: '#f0e9df' },
  { id: 'ergonomic', name: 'The Focus Chair', subtitle: 'Breathable mesh · fully adjustable', price: 300000, category: 'chairs', color: '#343e3c' },
  { id: 'lounge', name: 'The Soft Spot', subtitle: 'Cushioned comfort · sage green', price: 250000, category: 'chairs', color: '#9da98d' },
  { id: 'monitor', name: '27” Focus Monitor', subtitle: 'More pixels. More possibilities.', price: 250000, category: 'accessories', color: '#333b3c' },
  { id: 'lamp', name: 'The Golden Hour Lamp', subtitle: 'A warm glow for your best ideas', price: 75000, category: 'accessories', color: '#e9ad57' },
  { id: 'plant', name: 'Your Desk Buddy', subtitle: 'A little green goes a long way', price: 50000, category: 'accessories', color: '#769469' },
  { id: 'rug', name: 'The Grounding Rug', subtitle: 'Soft texture · natural woven finish', price: 100000, category: 'accessories', color: '#c6a487' },
];
export type Setup = { desk: string; chair: string; accessories: string[]; months: number; theme: 'coral' | 'sage' | 'lavender' };
export const initialSetup: Setup = { desk: 'oak', chair: 'ergonomic', accessories: ['monitor', 'plant'], months: 1, theme: 'coral' };
export function selectedProducts(setup: Setup) { return products.filter(p => p.id === setup.desk || p.id === setup.chair || setup.accessories.includes(p.id)); }
export function quote(setup: Setup) { const monthly = selectedProducts(setup).reduce((sum, p) => sum + p.price, 0); const discount = setup.months >= 6 ? .15 : setup.months >= 3 ? .1 : 0; const discountedMonthly = Math.round(monthly * (1 - discount)); return { monthly, discount, discountedMonthly, total: discountedMonthly * setup.months }; }
export function money(amount: number) { return `Rp ${new Intl.NumberFormat('id-ID').format(amount)}`; }
export function parseSetup(value: unknown): Setup | null {
  if (!value || typeof value !== 'object') return null;
  const s = value as Setup;
  if (!products.some(p => p.id === s.desk && p.category === 'desks') || !products.some(p => p.id === s.chair && p.category === 'chairs') || !Array.isArray(s.accessories) || !s.accessories.every(id => products.some(p => p.id === id && p.category === 'accessories')) || ![1,3,6].includes(s.months) || !['coral','sage','lavender'].includes(s.theme)) return null;
  return { desk: s.desk, chair: s.chair, accessories: [...new Set(s.accessories)], months: s.months, theme: s.theme };
}
