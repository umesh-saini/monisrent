export type DeskId = 'electric-desk' | 'mechanical-desk' | 'dual-motor-desk';
export type ChairId = 'ergonomic-chair' | 'rattan-chair';
export type AccessoryId =
  | 'monitor'
  | 'keyboard'
  | 'mouse'
  | 'laptop-stand'
  | 'lamp'
  | 'coffee-machine'
  | 'whiteboard'
  | 'speaker'
  | 'tower-fan'
  | 'plant'
  | 'rug'
  | 'surfboard';
export type ProductId = DeskId | ChairId | AccessoryId;

export type Category = 'desks' | 'chairs' | 'accessories';

export type Product = {
  id: ProductId;
  category: Category;
  name: string;
  description: string;
  /** Lowest weekly rental price, in US cents. */
  weeklyCents: number;
  /** The pre-sale weekly price, when monis.rent is running a discount. */
  listWeeklyCents?: number;
  /** Path on monis.rent. Concept items have none: they are not rentable there yet. */
  monisPath?: string;
  /** How many fit in the room. Defaults to 1. */
  maxQuantity?: number;
};

export const MONIS_URL = 'https://monis.rent';

/** Names, prices and paths come from monis.rent as listed on this date. */
export const CATALOG_DATE = '2 Nov 2026';

export const products: Product[] = [
  {
    id: 'electric-desk',
    category: 'desks',
    name: 'Electrical Adjustable Desk',
    description: 'Quiet motor · sits at 70, stands at 118 cm',
    weeklyCents: 600,
    listWeeklyCents: 900,
    monisPath: '/products/electrical-adjustable-desk',
  },
  {
    id: 'mechanical-desk',
    category: 'desks',
    name: 'Mechanical Adjustable Desk',
    description: 'Warm wood top · hand crank, no power needed',
    weeklyCents: 700,
    monisPath: '/products/adjustable-wooden-desk',
  },
  {
    id: 'dual-motor-desk',
    category: 'desks',
    name: 'Dual-Motor Standing Desk',
    description: 'Up to 160 cm wide · carries 120 kg of gear',
    weeklyCents: 800,
    monisPath: '/products/dual-motor-electric-standing-desk',
  },
  {
    id: 'ergonomic-chair',
    category: 'chairs',
    name: 'Ergonomic Office Chair',
    description: 'Breathable mesh · 4D adjustable armrests',
    weeklyCents: 600,
    listWeeklyCents: 900,
    monisPath: '/products/ergonomic-office-chair',
  },
  {
    id: 'rattan-chair',
    category: 'chairs',
    name: 'Canggu Rattan Chair',
    description: 'Hand-woven and very Bali · for shorter sprints',
    weeklyCents: 500,
  },
  {
    id: 'monitor',
    category: 'accessories',
    name: '27" 4K Monitor',
    description: 'USB-C or HDMI · add up to three',
    weeklyCents: 1200,
    listWeeklyCents: 1600,
    monisPath: '/products/27-4-k-multimedia-monitor',
    maxQuantity: 3,
  },
  {
    id: 'keyboard',
    category: 'accessories',
    name: 'Logitech MX Keyboard',
    description: 'Switches between three computers',
    weeklyCents: 600,
    listWeeklyCents: 800,
    monisPath: '/products/logitech-mx-keyboard',
  },
  {
    id: 'mouse',
    category: 'accessories',
    name: 'Logitech MX Master S3',
    description: 'The one developers refuse to give back',
    weeklyCents: 300,
    listWeeklyCents: 400,
    monisPath: '/products/logitech-mx-master-mouse-s3',
  },
  {
    id: 'laptop-stand',
    category: 'accessories',
    name: 'Ergonomic Laptop Stand',
    description: 'Lifts 10–17" laptops to eye level',
    weeklyCents: 200,
    listWeeklyCents: 300,
    monisPath: '/products/ergonomic-laptop-stand',
  },
  {
    id: 'lamp',
    category: 'accessories',
    name: 'Smart LED Desk Lamp 1S',
    description: 'Warm to cool light · try it at night',
    weeklyCents: 300,
    listWeeklyCents: 400,
    monisPath: '/products/smart-led-desk-lamp-1-s',
  },
  {
    id: 'coffee-machine',
    category: 'accessories',
    name: 'Nespresso Essenza',
    description: 'Your own coffee station, with a side table',
    weeklyCents: 700,
    listWeeklyCents: 900,
    monisPath: '/products/nespresso-essenza-coffee-machine',
  },
  {
    id: 'whiteboard',
    category: 'accessories',
    name: 'Magnetic Whiteboard',
    description: '60 × 90 cm · markers and magnets included',
    weeklyCents: 450,
    monisPath: '/products/magnetic-whiteboard',
  },
  {
    id: 'speaker',
    category: 'accessories',
    name: 'Marshall Woburn III',
    description: 'For when the deploy goes green',
    weeklyCents: 1700,
    listWeeklyCents: 2100,
    monisPath: '/products/marshall-woburn-ii-bluetooth',
  },
  {
    id: 'tower-fan',
    category: 'accessories',
    name: 'Smart Tower Fan',
    description: 'It is Bali. You will want this.',
    weeklyCents: 500,
    monisPath: '/products/smart-tower-fan',
  },
  {
    id: 'plant',
    category: 'accessories',
    name: 'Desk Buddy Plant',
    description: 'A little green goes a long way',
    weeklyCents: 100,
  },
  {
    id: 'rug',
    category: 'accessories',
    name: 'Woven Rug',
    description: 'Natural fibres · ties the room together',
    weeklyCents: 300,
  },
  {
    id: 'surfboard',
    category: 'accessories',
    name: 'Dawn Patrol Surfboard',
    description: 'Lean it on the wall. Leave work at 4.',
    weeklyCents: 900,
  },
];

export function productsIn(category: Category): Product[] {
  return products.filter((product) => product.category === category);
}

export function findProduct(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

export function isConcept(product: Product): boolean {
  return product.monisPath === undefined;
}

export function monisUrl(product: Product): string | undefined {
  return product.monisPath && `${MONIS_URL}${product.monisPath}`;
}
