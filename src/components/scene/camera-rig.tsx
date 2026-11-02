import { OrbitControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { Vector3 } from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { easingStep } from './animation';

const TARGET = new Vector3(0, 0.45, -0.1);
const HOME_DIRECTION = new Vector3(6, 3.4, 6).normalize();
const WIDE_SCREEN_DISTANCE = 11;
const RETURN_SPEED = 4;
const ARRIVED_DISTANCE = 0.01;

/** Narrow canvases need the camera further back to keep the whole room in frame. */
function homeDistance(aspect: number): number {
  return aspect >= 1.1
    ? WIDE_SCREEN_DISTANCE
    : WIDE_SCREEN_DISTANCE * (1 + (1.1 - aspect) * 0.95);
}

/** Orbit controls, framing for any canvas shape, and a smooth return to the start. */
export function CameraRig({ resetKey }: { resetKey: number }) {
  const controls = useRef<OrbitControlsImpl>(null);
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);
  const invalidate = useThree((state) => state.invalidate);
  const isReturning = useRef(false);

  const aspect = size.width / size.height;
  const home = HOME_DIRECTION.clone().multiplyScalar(homeDistance(aspect)).add(TARGET);

  useEffect(() => {
    camera.position.copy(home);
    camera.lookAt(TARGET);
    invalidate();
    // Only re-frame when the canvas shape changes, never mid-orbit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aspect]);

  useEffect(() => {
    if (resetKey === 0) return;
    isReturning.current = true;
    invalidate();
  }, [resetKey, invalidate]);

  useFrame((_, delta) => {
    if (!isReturning.current || !controls.current) return;
    camera.position.lerp(home, easingStep(delta, RETURN_SPEED));
    controls.current.update();

    if (camera.position.distanceTo(home) < ARRIVED_DISTANCE) {
      camera.position.copy(home);
      controls.current.update();
      isReturning.current = false;
    }
    invalidate();
  });

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      target={TARGET}
      minDistance={5}
      maxDistance={homeDistance(aspect) * 1.25}
      minPolarAngle={0.35}
      maxPolarAngle={Math.PI / 2.15}
      minAzimuthAngle={-0.35}
      maxAzimuthAngle={Math.PI / 2.1}
      enablePan={false}
      onStart={() => {
        isReturning.current = false;
      }}
    />
  );
}
