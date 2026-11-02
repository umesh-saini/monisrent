import { ArrowLeft, ArrowRight, Minus, Plus, X } from 'lucide-react';
import type { Product } from '@/lib/catalog';
import { money, quote } from '@/lib/pricing';
import { lineItems, type LineItem, type Setup } from '@/lib/setup';
import ProductArt from '@/components/product-art/product-art';
import styles from './dialog.module.css';

type ReviewStepProps = {
  setup: Setup;
  snapshot: string | null;
  onQuantityChange: (product: Product, quantity: number) => void;
  onRemove: (product: Product) => void;
  onContinue: () => void;
  onClose: () => void;
};

export default function ReviewStep({
  setup,
  snapshot,
  onQuantityChange,
  onRemove,
  onContinue,
  onClose,
}: ReviewStepProps) {
  const pricing = quote(setup);

  return (
    <>
      <span className="step">03 / YOUR HAPPY PLACE</span>
      <h2>
        Looks like <em>you.</em>
      </h2>

      {snapshot && (
        <div className={styles.snapshot} data-time={setup.timeOfDay}>
          {/* A data URL captured from the canvas, so next/image has nothing to optimize. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={snapshot} alt="Your workspace as you built it" />
        </div>
      )}

      <div>
        {lineItems(setup).map((item) => (
          <ReviewLine
            key={item.product.id}
            item={item}
            onQuantityChange={onQuantityChange}
            onRemove={onRemove}
          />
        ))}
      </div>

      <div className={styles.quoteLines}>
        <div>
          <span>Rental length</span>
          <b>{pricing.plan.label}</b>
        </div>
        <div>
          <span>Per week</span>
          <b>{money(pricing.discountedWeeklyCents)}</b>
        </div>
        {pricing.savedCents > 0 && (
          <div>
            <span>3+ month savings (10%)</span>
            <b>−{money(pricing.savedCents)}</b>
          </div>
        )}
      </div>

      <button className={styles.backButton} onClick={onClose}>
        <ArrowLeft size={15} /> A little more fine-tuning
      </button>

      <div className={styles.reviewFooter}>
        <div className={styles.quoteTotal}>
          <span>Estimated total</span>
          <b>{money(pricing.totalCents)}</b>
        </div>
        <button className="primary" onClick={onContinue}>
          Choose delivery <ArrowRight size={18} />
        </button>
      </div>
    </>
  );
}

type ReviewLineProps = {
  item: LineItem;
  onQuantityChange: (product: Product, quantity: number) => void;
  onRemove: (product: Product) => void;
};

function ReviewLine({ item, onQuantityChange, onRemove }: ReviewLineProps) {
  const { product, quantity } = item;
  const maxQuantity = product.maxQuantity ?? 1;

  return (
    <div className={styles.checkoutItem}>
      <div className={styles.checkoutArt}>
        <ProductArt id={product.id} />
      </div>
      <div className={styles.checkoutText}>
        <b>{product.name}</b>
        {maxQuantity > 1 ? (
          <span className={styles.lineStepper}>
            <button
              aria-label={`One fewer ${product.name}`}
              onClick={() => onQuantityChange(product, quantity - 1)}
            >
              <Minus size={12} />
            </button>
            <output>{quantity}</output>
            <button
              aria-label={`One more ${product.name}`}
              disabled={quantity >= maxQuantity}
              onClick={() => onQuantityChange(product, quantity + 1)}
            >
              <Plus size={12} />
            </button>
          </span>
        ) : (
          <span>{product.description}</span>
        )}
      </div>
      <strong>
        {money(product.weeklyCents * quantity)}
        <small>/ week</small>
      </strong>
      {product.category === 'accessories' && (
        <button
          className={styles.removeButton}
          aria-label={`Remove ${product.name}`}
          onClick={() =>
            maxQuantity > 1 ? onQuantityChange(product, 0) : onRemove(product)
          }
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
