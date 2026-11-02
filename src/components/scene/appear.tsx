import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { Group } from 'three';
import { clampFrameDelta, prefersReducedMotion } from './animation';
import type { Vec3 } from './primitives';

const STIFFNESS = 170;
const DAMPING = 14;
const DROP_HEIGHT = 0.7;
const SPRING_STEP_SECONDS = 1 / 120;
const INVISIBLE_SCALE = 0.0001;

type AppearProps = {
  show: boolean;
  position?: Vec3;
  rotation?: Vec3;
  children: ReactNode;
};

/**
 * Drops its children into the room on a springy bounce, and shrinks them away again
 * before unmounting. This is what makes the room feel alive as the setup changes.
 */
export function Appear({ show, position, rotation, children }: AppearProps) {
  const group = useRef<Group>(null);
  const spring = useRef({ value: 0, velocity: 0 });
  const [isMounted, setIsMounted] = useState(show);
  const invalidate = useThree((state) => state.invalidate);

  if (show && !isMounted) setIsMounted(true);

  useEffect(() => invalidate(), [show, invalidate]);

  useFrame((_, delta) => {
    if (!group.current) return;
    const target = show ? 1 : 0;
    const current = spring.current;

    if (prefersReducedMotion()) {
      current.value = target;
      current.velocity = 0;
    } else {
      // Fixed sub-steps keep the spring stable and on time, even at a low frame rate.
      const steps = Math.ceil(clampFrameDelta(delta) / SPRING_STEP_SECONDS);
      for (let index = 0; index < steps; index++) {
        const force = STIFFNESS * (target - current.value) - DAMPING * current.velocity;
        current.velocity += force * SPRING_STEP_SECONDS;
        current.value += current.velocity * SPRING_STEP_SECONDS;
      }
    }

    const isSettled =
      Math.abs(target - current.value) < 0.002 && Math.abs(current.velocity) < 0.02;
    if (isSettled) {
      current.value = target;
      current.velocity = 0;
      if (!show) setIsMounted(false);
    } else {
      invalidate();
    }

    group.current.scale.setScalar(Math.max(current.value, INVISIBLE_SCALE));
    group.current.position.y = (1 - current.value) * DROP_HEIGHT;
  });

  if (!isMounted) return null;

  return (
    <group position={position} rotation={rotation}>
      <group ref={group} scale={INVISIBLE_SCALE}>
        {children}
      </group>
    </group>
  );
}
