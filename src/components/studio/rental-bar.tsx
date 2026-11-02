import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { money, type Quote } from '@/lib/pricing';
import { RENTAL_PLANS } from '@/lib/rental-plans';
import styles from './rental-bar.module.css';

type RentalBarProps = {
  weeks: number;
  pricing: Quote;
  itemCount: number;
  onWeeksChange: (weeks: number) => void;
  onRent: () => void;
};

export default function RentalBar({
  weeks,
  pricing,
  itemCount,
  onWeeksChange,
  onRent,
}: RentalBarProps) {
  return (
    <div className={styles.rentalBar}>
      <section className={styles.duration} aria-labelledby="duration-label">
        <span className="step">02 / STAY A LITTLE</span>
        <h3 id="duration-label">How long is your Bali chapter?</h3>
        <div className={styles.plans} role="radiogroup" aria-labelledby="duration-label">
          {RENTAL_PLANS.map((plan) => (
            <button
              key={plan.weeks}
              role="radio"
              aria-checked={weeks === plan.weeks}
              onClick={() => onWeeksChange(plan.weeks)}
            >
              <b>{plan.label}</b>
              <small>{plan.hint}</small>
            </button>
          ))}
        </div>
      </section>

      <section className={styles.checkoutBar} aria-label="Your total">
        <div className={styles.total} aria-live="polite">
          <span className={styles.totalLabel}>
            {itemCount} items · {pricing.plan.label}
          </span>
          <div>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.strong
                key={pricing.discountedWeeklyCents}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.18 }}
              >
                {money(pricing.discountedWeeklyCents)}
              </motion.strong>
            </AnimatePresence>
            <small> / week</small>
          </div>
          <span className={styles.totalLabel}>
            {money(pricing.totalCents)} in total
            {pricing.savedCents > 0 && ` · you save ${money(pricing.savedCents)}`}
          </span>
        </div>
        <button className={`primary ${styles.rentButton}`} onClick={onRent}>
          Rent this setup <ArrowRight size={19} />
        </button>
      </section>
    </div>
  );
}
