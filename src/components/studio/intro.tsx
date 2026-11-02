import { Leaf, MapPin } from 'lucide-react';
import styles from './intro.module.css';

export default function Intro() {
  return (
    <section className={styles.intro}>
      <div>
        <div className={styles.eyebrow}>
          <span className={styles.miniLine} /> JUST LANDED IN BALI?
        </div>
        <h1 className={styles.title}>
          Good work starts with <em>your space.</em>
          <svg viewBox="0 0 55 60" aria-hidden="true">
            <path d="m28 5-2 15M49 18l-13 8M45 44l-13-9" />
          </svg>
        </h1>
        <p>Build your dream setup, watch it come to life, then rent it by the week.</p>
      </div>
      <div className={styles.introNote}>
        <span className={styles.location}>
          <MapPin size={14} /> MADE FOR LIFE IN BALI
        </span>
        <div className={styles.scribble}>
          Less buying.
          <br />
          More living.
          <Leaf size={22} />
        </div>
      </div>
    </section>
  );
}
