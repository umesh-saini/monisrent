import { ArrowUpRight } from 'lucide-react';
import { isConcept, monisUrl, type Product } from '@/lib/catalog';
import styles from './product-source.module.css';

/** Links a real product to its monis.rent page, and labels concept items honestly. */
export default function ProductSource({ product }: { product: Product }) {
  if (isConcept(product)) return <span className={styles.concept}>Concept</span>;

  return (
    <a
      className={styles.link}
      href={monisUrl(product)}
      target="_blank"
      rel="noreferrer"
      aria-label={`${product.name} on monis.rent (opens in a new tab)`}
    >
      View <ArrowUpRight size={13} />
    </a>
  );
}
