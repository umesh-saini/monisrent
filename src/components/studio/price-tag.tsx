import type { Product } from '@/lib/catalog';
import { money } from '@/lib/pricing';
import styles from './price-tag.module.css';

export default function PriceTag({ product }: { product: Product }) {
  return (
    <span className={styles.price}>
      <b>{money(product.weeklyCents)}</b>
      {product.listWeeklyCents && <s>{money(product.listWeeklyCents)}</s>}
      <small>/ week</small>
    </span>
  );
}
