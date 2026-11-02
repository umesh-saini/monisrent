import { ArrowLeft, ArrowRight } from 'lucide-react';
import { DELIVERY_AREAS, daysFromNow } from '@/lib/delivery';
import styles from './dialog.module.css';

export type DeliveryDetails = {
  area: string;
  date: string;
};

type DeliveryStepProps = {
  delivery: DeliveryDetails;
  onChange: (delivery: DeliveryDetails) => void;
  onBack: () => void;
  onConfirm: () => void;
};

export default function DeliveryStep({
  delivery,
  onChange,
  onBack,
  onConfirm,
}: DeliveryStepProps) {
  const earliestDate = daysFromNow(1);

  return (
    <>
      <span className="step">04 / BRING IT TO BALI</span>
      <h2>
        Where should <em>we land it?</em>
      </h2>
      <p className={styles.dialogSubtitle}>
        Pick an area and a day. Your villa, your coworking space, wherever you’re working
        from.
      </p>

      <div className={styles.field}>
        <span id="delivery-area-label">Area</span>
        <div
          className={styles.areas}
          role="radiogroup"
          aria-labelledby="delivery-area-label"
        >
          {DELIVERY_AREAS.map((area) => (
            <button
              key={area}
              role="radio"
              aria-checked={delivery.area === area}
              onClick={() => onChange({ ...delivery, area })}
            >
              {area}
            </button>
          ))}
        </div>
      </div>

      <label className={styles.field}>
        <span>Delivery date</span>
        <input
          type="date"
          value={delivery.date}
          min={earliestDate}
          onChange={(event) => onChange({ ...delivery, date: event.target.value })}
        />
      </label>

      <div className={styles.demoNote}>
        Areas are examples: monis.rent confirms real availability, delivery fees and the
        refundable deposit at its own checkout.
      </div>

      <button
        className="primary"
        disabled={delivery.date < earliestDate}
        onClick={onConfirm}
      >
        Lock in my setup <ArrowRight size={18} />
      </button>
      <button className={styles.backButton} onClick={onBack}>
        <ArrowLeft size={15} /> Back to my setup
      </button>
    </>
  );
}
