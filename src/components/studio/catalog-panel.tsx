import { AnimatePresence, motion } from 'framer-motion';
import { Armchair, Monitor, Table2 } from 'lucide-react';
import type { KeyboardEvent } from 'react';
import {
  CATALOG_DATE,
  productsIn,
  type Category,
  type Product,
  type ProductId,
} from '@/lib/catalog';
import { quantityOf, type Setup } from '@/lib/setup';
import AccessoryRow from './accessory-row';
import ProductCard from './product-card';
import styles from './catalog-panel.module.css';

const TABS = [
  { id: 'desks', label: 'Desks', icon: Table2 },
  { id: 'chairs', label: 'Chairs', icon: Armchair },
  { id: 'accessories', label: 'Extras', icon: Monitor },
] as const;

type CatalogPanelProps = {
  setup: Setup;
  category: Category;
  highlightedId: ProductId | null;
  onCategoryChange: (category: Category) => void;
  onChoose: (product: Product) => void;
  onQuantityChange: (product: Product, quantity: number) => void;
};

export default function CatalogPanel({
  setup,
  category,
  highlightedId,
  onCategoryChange,
  onChoose,
  onQuantityChange,
}: CatalogPanelProps) {
  const visibleProducts = productsIn(category);

  function moveBetweenTabs(event: KeyboardEvent) {
    const direction = { ArrowLeft: -1, ArrowRight: 1 }[event.key];
    if (!direction) return;
    const current = TABS.findIndex((tab) => tab.id === category);
    const next = TABS[(current + direction + TABS.length) % TABS.length];
    onCategoryChange(next.id);
    document.getElementById(`tab-${next.id}`)?.focus();
  }

  return (
    <aside className={styles.catalog}>
      <div className={styles.catalogHeading}>
        <div>
          <span className="step">01 / MAKE IT YOURS</span>
          <h2>The good stuff.</h2>
        </div>
        <span className={styles.itemCount}>{visibleProducts.length} options</span>
      </div>

      <div
        className={styles.tabs}
        role="tablist"
        aria-label="Product categories"
        onKeyDown={moveBetweenTabs}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            role="tab"
            aria-selected={category === tab.id}
            aria-controls="product-panel"
            tabIndex={category === tab.id ? 0 : -1}
            onClick={() => onCategoryChange(tab.id)}
          >
            <tab.icon size={17} />
            {tab.label}
            {category === tab.id && (
              <motion.span layoutId="active-tab" className={styles.activeTab} />
            )}
          </button>
        ))}
      </div>

      <div
        id="product-panel"
        role="tabpanel"
        aria-labelledby={`tab-${category}`}
        className={styles.productList}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={category}
            className={category === 'accessories' ? styles.rows : styles.cards}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16 }}
          >
            {visibleProducts.map((product) => {
              const quantity = quantityOf(setup, product);
              const isHighlighted = highlightedId === product.id;
              return category === 'accessories' ? (
                <AccessoryRow
                  key={product.id}
                  product={product}
                  quantity={quantity}
                  isHighlighted={isHighlighted}
                  onChoose={() => onChoose(product)}
                  onQuantityChange={(next) => onQuantityChange(product, next)}
                />
              ) : (
                <ProductCard
                  key={product.id}
                  product={product}
                  isSelected={quantity > 0}
                  isHighlighted={isHighlighted}
                  onChoose={() => onChoose(product)}
                />
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      <p className={styles.catalogFooter}>
        Names and prices from monis.rent, {CATALOG_DATE}. “Concept” items are our own
        additions.
      </p>
    </aside>
  );
}
