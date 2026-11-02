import { Check, Plus } from 'lucide-react';
import type { Product } from '@/lib/catalog';
import ProductArt from '@/components/product-art/product-art';
import PriceTag from './price-tag';
import ProductSource from './product-source';
import { useScrollWhenHighlighted } from './use-scroll-when-highlighted';
import styles from './product-card.module.css';

type ProductCardProps = {
  product: Product;
  isSelected: boolean;
  isHighlighted: boolean;
  onChoose: () => void;
};

/** The large card used for desks and chairs, where you pick exactly one. */
export default function ProductCard({
  product,
  isSelected,
  isHighlighted,
  onChoose,
}: ProductCardProps) {
  const ref = useScrollWhenHighlighted<HTMLDivElement>(isHighlighted);

  return (
    <div
      ref={ref}
      className={styles.card}
      data-selected={isSelected}
      data-highlighted={isHighlighted}
    >
      <button className={styles.choose} onClick={onChoose} aria-pressed={isSelected}>
        <span className={styles.image}>
          <ProductArt id={product.id} className={styles.art} />
          <span className={styles.selectCircle}>
            {isSelected ? <Check size={14} /> : <Plus size={14} />}
          </span>
        </span>
        <span className={styles.name}>{product.name}</span>
        <span className={styles.description}>{product.description}</span>
      </button>
      <div className={styles.footer}>
        <PriceTag product={product} />
        <ProductSource product={product} />
      </div>
    </div>
  );
}
