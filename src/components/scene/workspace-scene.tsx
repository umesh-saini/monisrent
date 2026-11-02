'use client';

import { ContactShadows } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import {
  Component,
  Suspense,
  useImperativeHandle,
  useMemo,
  type ReactNode,
  type Ref,
} from 'react';
import type { ProductId } from '@/lib/catalog';
import type { Setup } from '@/lib/setup';
import { CameraRig } from './camera-rig';
import { Lighting } from './lighting';
import { Room } from './room';
import { SceneEventsContext } from './scene-item';
import styles from '@/components/studio/preview-panel.module.css';

/** Keeps the catalog and checkout usable when WebGL is unavailable. */
class SceneErrorBoundary extends Component<
  { children: ReactNode },
  { hasFailed: boolean }
> {
  state = { hasFailed: false };

  static getDerivedStateFromError() {
    return { hasFailed: true };
  }

  render() {
    if (!this.state.hasFailed) return this.props.children;
    return (
      <div className={styles.sceneFallback}>
        Your browser could not open the 3D room. You can still build and review your setup
        using the product cards.
      </div>
    );
  }
}

export type SceneHandle = {
  /** Renders the current view and returns it as a PNG data URL. */
  takeSnapshot: () => string;
};

/** Lives inside the Canvas, where it can reach the renderer on the parent's behalf. */
function SnapshotProvider({ handleRef }: { handleRef?: Ref<SceneHandle> }) {
  const gl = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);
  const camera = useThree((state) => state.camera);

  useImperativeHandle(
    handleRef,
    () => ({
      takeSnapshot() {
        // WebGL clears its buffer after presenting, so render right before reading it.
        gl.render(scene, camera);
        return gl.domElement.toDataURL('image/png');
      },
    }),
    [gl, scene, camera],
  );

  return null;
}

type WorkspaceSceneProps = {
  setup: Setup;
  isStanding: boolean;
  resetKey: number;
  handleRef?: Ref<SceneHandle>;
  onPick: (id: ProductId) => void;
  onHover: (id: ProductId | null) => void;
};

export default function WorkspaceScene({
  setup,
  isStanding,
  resetKey,
  handleRef,
  onPick,
  onHover,
}: WorkspaceSceneProps) {
  const events = useMemo(() => ({ onPick, onHover }), [onPick, onHover]);

  return (
    <SceneErrorBoundary>
      <Canvas
        flat
        frameloop="demand"
        shadows
        camera={{ fov: 37 }}
        dpr={[1, 1.8]}
        aria-label="Interactive 3D workspace preview. Drag to look around, click an item to change it."
        gl={{ antialias: true, alpha: true }}
      >
        <Lighting timeOfDay={setup.timeOfDay} />
        <SceneEventsContext.Provider value={events}>
          <Suspense fallback={null}>
            <Room setup={setup} isStanding={isStanding} />
            <ContactShadows
              position={[0, -0.81, 0]}
              opacity={0.3}
              scale={12}
              blur={2.8}
              far={5}
            />
          </Suspense>
        </SceneEventsContext.Provider>
        <CameraRig resetKey={resetKey} />
        <SnapshotProvider handleRef={handleRef} />
      </Canvas>
    </SceneErrorBoundary>
  );
}
