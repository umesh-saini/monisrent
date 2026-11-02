import {
  ArrowUpFromLine,
  Check,
  Maximize2,
  Moon,
  MousePointer2,
  RotateCcw,
  Sparkles,
  Sun,
  Sunset,
  X,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { useEffect, useState, type Ref } from 'react';
import { findProduct, type ProductId } from '@/lib/catalog';
import { money } from '@/lib/pricing';
import {
  THEMES,
  TIMES_OF_DAY,
  type Setup,
  type Theme,
  type TimeOfDay,
} from '@/lib/setup';
import type { SceneHandle } from '@/components/scene/workspace-scene';
import styles from './preview-panel.module.css';

const WorkspaceScene = dynamic(() => import('@/components/scene/workspace-scene'), {
  ssr: false,
  loading: () => (
    <div className={styles.sceneLoading}>
      <span />
      Opening your little corner of Bali…
    </div>
  ),
});

const TIME_CONTROLS: Record<TimeOfDay, { label: string; icon: typeof Sun }> = {
  day: { label: 'Daytime', icon: Sun },
  golden: { label: 'Golden hour', icon: Sunset },
  night: { label: 'Night', icon: Moon },
};

type PreviewPanelProps = {
  setup: Setup;
  sceneRef: Ref<SceneHandle>;
  cameraResetKey: number;
  onResetCamera: () => void;
  onThemeChange: (theme: Theme) => void;
  onTimeChange: (timeOfDay: TimeOfDay) => void;
  onPick: (id: ProductId) => void;
};

export default function PreviewPanel({
  setup,
  sceneRef,
  cameraResetKey,
  onResetCamera,
  onThemeChange,
  onTimeChange,
  onPick,
}: PreviewPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isStanding, setIsStanding] = useState(false);
  const [hoveredId, setHoveredId] = useState<ProductId | null>(null);
  const hovered = hoveredId && findProduct(hoveredId);

  useEffect(() => {
    if (!isExpanded) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsExpanded(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [isExpanded]);

  return (
    <div
      className={`${styles.preview} ${isExpanded ? styles.expanded : ''}`}
      data-time={setup.timeOfDay}
    >
      <div className={styles.scene}>
        <WorkspaceScene
          setup={setup}
          isStanding={isStanding}
          resetKey={cameraResetKey}
          handleRef={sceneRef}
          onPick={onPick}
          onHover={setHoveredId}
        />
      </div>

      <div className={styles.previewTop}>
        <div className={styles.liveLabel}>
          <span className={styles.liveDot} /> YOUR WORKSPACE, COMING TO LIFE
        </div>
        <div className={styles.timeControls} role="group" aria-label="Time of day">
          {TIMES_OF_DAY.map((time) => {
            const { label, icon: Icon } = TIME_CONTROLS[time];
            return (
              <button
                key={time}
                aria-label={label}
                title={label}
                aria-pressed={setup.timeOfDay === time}
                onClick={() => onTimeChange(time)}
              >
                <Icon size={16} />
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.roomLabel} aria-live="polite">
        <Sparkles size={15} />
        {hovered ? (
          <span>
            {hovered.name} · {money(hovered.weeklyCents)}/week
          </span>
        ) : (
          <span>Click anything in the room to change it</span>
        )}
      </div>

      <div className={styles.previewBottom}>
        <div className={styles.themePicker}>
          <span>Mood</span>
          {THEMES.map((theme) => (
            <button
              key={theme}
              className={`${styles.themeSwatch} ${styles[theme]}`}
              aria-label={`${theme} theme`}
              aria-pressed={setup.theme === theme}
              onClick={() => onThemeChange(theme)}
            >
              {setup.theme === theme && <Check size={12} />}
            </button>
          ))}
        </div>

        <div className={styles.viewControls}>
          <button
            className={styles.standButton}
            aria-pressed={isStanding}
            onClick={() => setIsStanding((standing) => !standing)}
          >
            <ArrowUpFromLine size={16} />
            {isStanding ? 'Sit down' : 'Stand up'}
          </button>
          <button
            aria-label="Reset camera view"
            title="Reset camera view"
            onClick={onResetCamera}
          >
            <RotateCcw size={17} />
          </button>
          <button
            aria-label={isExpanded ? 'Close expanded preview' : 'Expand preview'}
            title={isExpanded ? 'Close expanded preview' : 'Expand preview'}
            onClick={() => setIsExpanded((expanded) => !expanded)}
          >
            {isExpanded ? <X size={17} /> : <Maximize2 size={17} />}
          </button>
        </div>
      </div>

      <div className={styles.orbitHint}>
        <MousePointer2 size={12} /> Drag to explore · Scroll to zoom
      </div>
    </div>
  );
}
