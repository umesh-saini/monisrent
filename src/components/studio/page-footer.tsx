import { Leaf, RotateCcw, Table2, Truck } from 'lucide-react';
import styles from './page-footer.module.css';

export function TrustRow({ onStartFresh }: { onStartFresh: () => void }) {
  return (
    <div className={styles.trustRow}>
      <span>
        <Truck size={17} /> Delivered to your door
      </span>
      <span>
        <Table2 size={17} /> Setup without the stress
      </span>
      <span>
        <Leaf size={17} /> Rent more. Own less.
      </span>
      <button onClick={onStartFresh}>
        Start fresh <RotateCcw size={13} />
      </button>
    </div>
  );
}

export function ClosingNote() {
  return (
    <section className={styles.closingNote}>
      <span className={styles.sun}>✳</span>
      <p>
        Your next big idea deserves
        <br />a <em>better place to begin.</em>
      </p>
      <span className={styles.tagline}>
        YOU BRING THE AMBITION.
        <br />
        WE BRING THE DESK.
      </span>
    </section>
  );
}

export function PageFooter() {
  return (
    <footer className={styles.footer}>
      <span>
        Concept project for monis.rent <span className={styles.footerDot}>/</span> Not an
        official monis.rent site.
      </span>
      <span>
        Bali, Indonesia <span className={styles.footerDot}>✳</span> Built for a lighter
        life.
      </span>
    </footer>
  );
}
