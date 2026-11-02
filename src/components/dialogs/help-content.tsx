import { ArrowRight } from 'lucide-react';
import { CATALOG_DATE } from '@/lib/catalog';
import styles from './dialog.module.css';

export default function HelpContent({ onClose }: { onClose: () => void }) {
  return (
    <>
      <span className="step">A BETTER WAY TO WORK</span>
      <h2>
        Make yourself
        <br />
        <em>at home.</em>
      </h2>
      <div className={styles.helpSteps}>
        <p>
          <b>01. Pick your foundations.</b> Choose a desk and a chair, or start from a
          preset. Add extras and watch them drop into the room.
        </p>
        <p>
          <b>02. Play with it.</b> Drag to look around. Click any object to change it.
          Make the desk stand up. See how your room feels at night.
        </p>
        <p>
          <b>03. Make it real.</b> Review your setup, choose a delivery date, then rent
          each item on monis.rent or share the link.
        </p>
      </div>
      <div className={styles.demoNote}>
        This is a concept, not an official monis.rent tool. Real products and prices were
        taken from monis.rent on {CATALOG_DATE} and may have changed. Items marked
        “Concept” aren’t sold there. Nothing here places an order or takes payment.
      </div>
      <button className="primary" onClick={onClose}>
        Let’s build <ArrowRight size={18} />
      </button>
    </>
  );
}
