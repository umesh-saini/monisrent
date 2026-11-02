import { motion } from 'framer-motion';
import styles from './dialog.module.css';

const PIECE_COUNT = 26;
const COLORS = ['#bd5236', '#e9ad57', '#7d9270', '#9a8db0', '#3e8ca0'];

/** A short burst when the setup is ready. Positions are fixed so renders stay pure. */
export default function Confetti() {
  return (
    <div className={styles.confetti} aria-hidden="true">
      {Array.from({ length: PIECE_COUNT }, (_, index) => {
        const angle = (index / PIECE_COUNT) * Math.PI * 2;
        const reach = 90 + ((index * 37) % 110);
        return (
          <motion.span
            key={index}
            style={{ background: COLORS[index % COLORS.length] }}
            initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
            animate={{
              x: Math.cos(angle) * reach,
              y: Math.sin(angle) * reach + 60,
              opacity: 0,
              rotate: (index % 2 ? 1 : -1) * 240,
            }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
          />
        );
      })}
    </div>
  );
}
