import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { Color, Vector3, type AmbientLight, type DirectionalLight } from 'three';
import type { TimeOfDay } from '@/lib/setup';
import { easingStep } from './animation';
import type { Vec3 } from './primitives';

type LightingPreset = {
  ambient: number;
  ambientColor: string;
  sun: number;
  sunColor: string;
  sunPosition: Vec3;
};

const LIGHTING: Record<TimeOfDay, LightingPreset> = {
  day: {
    ambient: 1.55,
    ambientColor: '#fff9ef',
    sun: 2.0,
    sunColor: '#fff4df',
    sunPosition: [2.5, 8, 5],
  },
  golden: {
    ambient: 1.15,
    ambientColor: '#ffe3c4',
    sun: 2.3,
    sunColor: '#ffb06e',
    sunPosition: [6, 3.6, 5],
  },
  night: {
    ambient: 0.5,
    ambientColor: '#7f8cd8',
    sun: 0.45,
    sunColor: '#93a4ff',
    sunPosition: [3, 7, 4],
  },
};

/** How bright the desk lamp and shelf glow are at each time of day. */
export const LAMP_INTENSITY: Record<TimeOfDay, number> = {
  day: 0.6,
  golden: 2.2,
  night: 7,
};

const FADE_SPEED = 3.5;

/** Fades smoothly between lighting presets rather than snapping. */
export function Lighting({ timeOfDay }: { timeOfDay: TimeOfDay }) {
  const ambient = useRef<AmbientLight>(null);
  const sun = useRef<DirectionalLight>(null);
  const invalidate = useThree((state) => state.invalidate);
  const preset = LIGHTING[timeOfDay];
  const targets = useRef({
    ambientColor: new Color(),
    sunColor: new Color(),
    sunPosition: new Vector3(),
  });

  useEffect(() => {
    targets.current.ambientColor.set(preset.ambientColor);
    targets.current.sunColor.set(preset.sunColor);
    targets.current.sunPosition.set(...preset.sunPosition);
    invalidate();
  }, [preset, invalidate]);

  useFrame((_, delta) => {
    if (!ambient.current || !sun.current) return;
    const step = easingStep(delta, FADE_SPEED);

    ambient.current.intensity += (preset.ambient - ambient.current.intensity) * step;
    ambient.current.color.lerp(targets.current.ambientColor, step);
    sun.current.intensity += (preset.sun - sun.current.intensity) * step;
    sun.current.color.lerp(targets.current.sunColor, step);
    sun.current.position.lerp(targets.current.sunPosition, step);

    const remaining =
      Math.abs(preset.ambient - ambient.current.intensity) +
      Math.abs(preset.sun - sun.current.intensity);
    if (remaining > 0.002) invalidate();
  });

  return (
    <>
      <ambientLight
        ref={ambient}
        intensity={preset.ambient}
        color={preset.ambientColor}
      />
      <directionalLight
        ref={sun}
        position={preset.sunPosition}
        intensity={preset.sun}
        color={preset.sunColor}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-bias={-0.0004}
      />
    </>
  );
}
