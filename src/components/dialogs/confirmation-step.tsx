import { motion } from 'framer-motion';
import { ArrowUpRight, Check, Download, Link2 } from 'lucide-react';
import { useState } from 'react';
import { isConcept, monisUrl } from '@/lib/catalog';
import { formatDeliveryDate } from '@/lib/delivery';
import { money, quote } from '@/lib/pricing';
import { lineItems, type Setup } from '@/lib/setup';
import { downloadDataUrl, renderSetupCard } from '@/lib/setup-card';
import { shareUrl } from '@/lib/share-link';
import Confetti from './confetti';
import type { DeliveryDetails } from './delivery-step';
import styles from './dialog.module.css';

type ConfirmationStepProps = {
  setup: Setup;
  snapshot: string | null;
  delivery: DeliveryDetails;
};

export default function ConfirmationStep({
  setup,
  snapshot,
  delivery,
}: ConfirmationStepProps) {
  const [hasCopied, setHasCopied] = useState(false);
  const pricing = quote(setup);
  const items = lineItems(setup);
  const rentableItems = items.filter(({ product }) => !isConcept(product));
  const conceptItems = items.filter(({ product }) => isConcept(product));

  async function copyLink() {
    await navigator.clipboard.writeText(shareUrl(setup, window.location.origin));
    setHasCopied(true);
  }

  async function savePoster() {
    downloadDataUrl('my-bali-workspace.png', await renderSetupCard(setup, snapshot));
  }

  return (
    <>
      <Confetti />
      <motion.div
        className={styles.successBadge}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 14 }}
      >
        <Check size={26} />
      </motion.div>
      <h2>
        Your setup is <em>ready to go.</em>
      </h2>
      <p className={styles.dialogSubtitle}>
        {delivery.area}, {formatDeliveryDate(delivery.date)} · {money(pricing.totalCents)}{' '}
        for {pricing.plan.label}. One last step: this concept can’t place orders, so rent
        each piece on monis.rent.
      </p>

      <ul className={styles.rentList}>
        {rentableItems.map(({ product, quantity }) => (
          <li key={product.id}>
            <a href={monisUrl(product)} target="_blank" rel="noreferrer">
              <span>
                {quantity > 1 && `${quantity} × `}
                {product.name}
              </span>
              <span className={styles.rentLinkAction}>
                Rent <ArrowUpRight size={14} />
              </span>
            </a>
          </li>
        ))}
      </ul>
      {conceptItems.length > 0 && (
        <p className={styles.conceptNote}>
          Not on monis.rent yet:{' '}
          {conceptItems.map(({ product }) => product.name).join(', ')}.
        </p>
      )}

      <div className={styles.shareActions}>
        <button className={styles.secondary} onClick={copyLink}>
          {hasCopied ? <Check size={16} /> : <Link2 size={16} />}
          {hasCopied ? 'Link copied' : 'Copy share link'}
        </button>
        <button className={styles.secondary} onClick={savePoster}>
          <Download size={16} /> Save as image
        </button>
      </div>
    </>
  );
}
