import { CircleHelp } from 'lucide-react';
import Link from 'next/link';
import styles from './header.module.css';

export default function Header({ onOpenHelp }: { onOpenHelp: () => void }) {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo} aria-label="monis.rent studio home">
        monis<span>.rent</span>
      </Link>
      <div className={styles.navLabel}>
        <span /> WORKSPACE STUDIO
      </div>
      <button
        className={styles.helpButton}
        aria-label="How it works"
        onClick={onOpenHelp}
      >
        <CircleHelp size={18} />
        <span>How it works</span>
      </button>
    </header>
  );
}
