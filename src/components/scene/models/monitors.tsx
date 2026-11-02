import { useRef, type ReactNode } from 'react';
import type { Group } from 'three';
import { useEasedValue } from '../animation';
import { Appear } from '../appear';
import { Box } from '../primitives';

const STAND = '#3d4442';
const BEZEL = '#20262a';
const SCREEN_WIDTH = 1.02;
const SCREEN_HEIGHT = 0.6;
const SIDE_ANGLE = 0.5;

/** Where each monitor sits for a given count. Side screens angle in toward the chair. */
const LAYOUTS: Record<number, { x: number; z: number; angle: number }[]> = {
  1: [{ x: 0, z: 0, angle: 0 }],
  2: [
    { x: -0.55, z: 0.02, angle: 0.14 },
    { x: 0.55, z: 0.02, angle: -0.14 },
  ],
  3: [
    { x: 0, z: 0, angle: 0 },
    { x: -0.98, z: 0.2, angle: SIDE_ANGLE },
    { x: 0.98, z: 0.2, angle: -SIDE_ANGLE },
  ],
};

/** Each screen gets different "app" content, so a triple setup feels like real work. */
const SCREENS = [
  { background: '#16222b', blocks: ['#7dd3a8', '#e6b866', '#6ba7d8', '#c9d4c5'] },
  { background: '#f1ece1', blocks: ['#d86f4f', '#3d4f47', '#a7b89b', '#e5c98f'] },
  { background: '#20263a', blocks: ['#e88b67', '#7f8fd9', '#9fe0c0', '#efd27b'] },
];

function ScreenContent({ background, blocks }: (typeof SCREENS)[number]) {
  return (
    <group position={[0, 0, 0.038]}>
      {/* Basic materials ignore room light, so screens stay bright at night. */}
      <mesh>
        <planeGeometry args={[SCREEN_WIDTH - 0.04, SCREEN_HEIGHT - 0.04]} />
        <meshBasicMaterial color={background} />
      </mesh>
      <mesh position={[-0.27, 0.05, 0.001]}>
        <planeGeometry args={[0.38, 0.38]} />
        <meshBasicMaterial color={blocks[0]} />
      </mesh>
      <mesh position={[0.2, 0.15, 0.001]}>
        <planeGeometry args={[0.48, 0.14]} />
        <meshBasicMaterial color={blocks[1]} />
      </mesh>
      <mesh position={[0.08, -0.05, 0.001]}>
        <planeGeometry args={[0.24, 0.2]} />
        <meshBasicMaterial color={blocks[2]} />
      </mesh>
      <mesh position={[0.34, -0.05, 0.001]}>
        <planeGeometry args={[0.2, 0.2]} />
        <meshBasicMaterial color={blocks[3]} />
      </mesh>
    </group>
  );
}

function Monitor({ screen }: { screen: (typeof SCREENS)[number] }) {
  return (
    <>
      <Box position={[0, 0.018, 0]} size={[0.36, 0.035, 0.24]} color={STAND} />
      <Box position={[0, 0.2, -0.04]} size={[0.06, 0.36, 0.05]} color={STAND} />
      <group position={[0, 0.58, 0]}>
        <Box size={[SCREEN_WIDTH, SCREEN_HEIGHT, 0.055]} color={BEZEL} radius={0.015} />
        <ScreenContent {...screen} />
      </group>
    </>
  );
}

type Placement = (typeof LAYOUTS)[number][number];

/** Glides a monitor to its new spot when the row is rearranged around it. */
function MonitorSlot({
  placement,
  children,
}: {
  placement: Placement;
  children: ReactNode;
}) {
  const group = useRef<Group>(null);
  useEasedValue(placement.x, (x) => group.current && (group.current.position.x = x));
  useEasedValue(placement.z, (z) => group.current && (group.current.position.z = z));
  useEasedValue(
    placement.angle,
    (angle) => group.current && (group.current.rotation.y = angle),
  );
  return <group ref={group}>{children}</group>;
}

/** A row of monitors. Origin: on the desk surface, at the centre of the row. */
export function MonitorRow({ count }: { count: number }) {
  return (
    <>
      {SCREENS.map((screen, slot) => {
        // A slot being removed keeps the spot it had in the largest layout that used it.
        const placement = LAYOUTS[count]?.[slot] ?? LAYOUTS[slot + 1][slot];
        return (
          <MonitorSlot key={slot} placement={placement}>
            <Appear show={slot < count}>
              <Monitor screen={screen} />
            </Appear>
          </MonitorSlot>
        );
      })}
    </>
  );
}
