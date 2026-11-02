import { Check, Minus, Plus } from 'lucide-react';
import type { Product } from '@/lib/catalog';
import ProductArt from '@/components/product-art/product-art';
import PriceTag from './price-tag';
import ProductSource from './product-source';
import { useScrollWhenHighlighted } from './use-scroll-when-highlighted';
import styles from './accessory-row.module.css';

type AccessoryRowProps = {
  product: Product;
  quantity: number;
  isHighlighted: boolean;
  onChoose: () => void;
  onQuantityChange: (quantity: number) => void;
};

/** The compact row used for extras, which can be stacked up freely. */
export default function AccessoryRow({
  product,
  quantity,
  isHighlighted,
  onChoose,
  onQuantityChange,
}: AccessoryRowProps) {
  const ref = useScrollWhenHighlighted<HTMLDivElement>(isHighlighted);
  const maxQuantity = product.maxQuantity ?? 1;
  const isSelected = quantity > 0;

  return (
    <div
      ref={ref}
      className={styles.row}
      data-selected={isSelected}
      data-highlighted={isHighlighted}
    >
      <button className={styles.choose} onClick={onChoose} aria-pressed={isSelected}>
        <span className={styles.thumbnail}>
          <ProductArt id={product.id} />
        </span>
        <span className={styles.text}>
          <span className={styles.name}>{product.name}</span>
          <span className={styles.description}>{product.description}</span>
        </span>
        <span className={styles.indicator}>
          {isSelected ? <Check size={14} /> : <Plus size={14} />}
        </span>
      </button>

      <div className={styles.footer}>
        <PriceTag product={product} />
        <ProductSource product={product} />
        {maxQuantity > 1 && isSelected && (
          <span className={styles.stepper}>
            <button
              aria-label={`One fewer ${product.name}`}
              onClick={() => onQuantityChange(quantity - 1)}
            >
              <Minus size={13} />
            </button>
            <output aria-live="polite">{quantity}</output>
            <button
              aria-label={`One more ${product.name}`}
              disabled={quantity >= maxQuantity}
              onClick={() => onQuantityChange(quantity + 1)}
            >
              <Plus size={13} />
            </button>
          </span>
        )}
      </div>
    </div>
  );
}
