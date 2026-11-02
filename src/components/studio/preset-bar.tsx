import { Dices } from 'lucide-react';
import { matchesPreset, PRESETS, type Preset } from '@/lib/presets';
import type { Setup } from '@/lib/setup';
import styles from './preset-bar.module.css';

type PresetBarProps = {
  setup: Setup;
  onPreset: (preset: Preset) => void;
  onSurprise: () => void;
};

export default function PresetBar({ setup, onPreset, onSurprise }: PresetBarProps) {
  return (
    <div className={styles.bar} role="group" aria-label="Starting points">
      <span className={styles.label}>Start from</span>
      {PRESETS.map((preset) => (
        <button
          key={preset.id}
          className={styles.preset}
          aria-pressed={matchesPreset(setup, preset)}
          onClick={() => onPreset(preset)}
        >
          {preset.name}
        </button>
      ))}
      <button className={styles.surprise} onClick={onSurprise}>
        <Dices size={16} /> Surprise me
      </button>
    </div>
  );
}
