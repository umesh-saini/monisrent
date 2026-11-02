import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';

const SETTLE_THRESHOLD = 0.001;

/**
 * The canvas renders on demand, so the first frame after sitting idle reports the whole
 * idle period as its delta. Left unclamped, that would finish every animation in one jump.
 */
const LONGEST_FRAME_SECONDS = 1 / 15;

export function clampFrameDelta(delta: number): number {
  return Math.min(delta, LONGEST_FRAME_SECONDS);
}

/** How far an eased value moves this frame. Frame-rate independent down to 15 fps. */
export function easingStep(delta: number, speed: number): number {
  return prefersReducedMotion() ? 1 : 1 - Math.exp(-speed * clampFrameDelta(delta));
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Eases a number toward `target` and hands each step to `apply`. The canvas renders on
 * demand, so this keeps requesting frames only while the value is still moving.
 */
export function useEasedValue(
  target: number,
  apply: (value: number) => void,
  speed = 5,
  initial = target,
) {
  const value = useRef(initial);
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => invalidate(), [target, invalidate]);

  useFrame((_, delta) => {
    value.current += (target - value.current) * easingStep(delta, speed);

    if (Math.abs(target - value.current) < SETTLE_THRESHOLD) value.current = target;
    else invalidate();

    apply(value.current);
  });
}
