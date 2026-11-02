import { useMemo } from 'react';
import type { Theme, TimeOfDay } from '@/lib/setup';
import { Plant } from './models/room-items';
import { Box } from './primitives';
import { createWindowViewTexture } from './window-view';

const BACK_WALL_COLORS: Record<Theme, string> = {
  coral: '#f0ddcb',
  sage: '#dbe6d3',
  lavender: '#e4dcec',
};

const SIDE_WALL = '#f6efe2';
const FLOOR = '#e8d7bb';
const WINDOW_FRAME = '#fbf6ec';

const WINDOW_Y = 1.95;
const WINDOW_Z = -0.25;
const WINDOW_SIZE = 1.9;

function Window({ timeOfDay }: { timeOfDay: TimeOfDay }) {
  const view = useMemo(() => createWindowViewTexture(timeOfDay), [timeOfDay]);
  const half = WINDOW_SIZE / 2;

  return (
    <group position={[-2.47, WINDOW_Y, WINDOW_Z]}>
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[WINDOW_SIZE, WINDOW_SIZE]} />
        {/* Basic material: the outside world isn't lit by the lamps in the room. */}
        <meshBasicMaterial map={view} toneMapped={false} />
      </mesh>
      {[-half, 0, half].map((z) => (
        <Box
          key={z}
          position={[0.04, 0, z]}
          size={[0.08, WINDOW_SIZE + 0.1, 0.07]}
          color={WINDOW_FRAME}
        />
      ))}
      {[-half, 0, half].map((y) => (
        <Box
          key={y}
          position={[0.04, y, 0]}
          size={[0.08, 0.07, WINDOW_SIZE + 0.1]}
          color={WINDOW_FRAME}
        />
      ))}
      <Box
        position={[0.13, -half - 0.06, 0]}
        size={[0.26, 0.05, WINDOW_SIZE + 0.25]}
        color={WINDOW_FRAME}
      />
    </group>
  );
}

function FramedPrint() {
  return (
    <group position={[0.65, 2.4, -1.91]}>
      <Box size={[0.78, 0.99, 0.05]} color="#a17f61" />
      <Box position={[0, 0, 0.03]} size={[0.66, 0.87, 0.02]} color="#f6ecdc" />
      <mesh position={[0, 0.05, 0.042]}>
        <circleGeometry args={[0.2, 32]} />
        <meshStandardMaterial color="#d6795a" />
      </mesh>
      <mesh position={[0, -0.22, 0.042]}>
        <planeGeometry args={[0.46, 0.09]} />
        <meshStandardMaterial color="#6e8e78" />
      </mesh>
    </group>
  );
}

function WallShelf() {
  return (
    <group position={[1.76, 1.92, -1.8]}>
      <Box size={[1, 0.07, 0.34]} color="#b58c65" />
      <group position={[0, 0.03, 0]} scale={0.52}>
        <Plant />
      </group>
    </group>
  );
}

type RoomShellProps = {
  theme: Theme;
  timeOfDay: TimeOfDay;
};

/** Everything that stays put no matter what the customer picks. */
export function RoomShell({ theme, timeOfDay }: RoomShellProps) {
  return (
    <>
      <Box position={[0, -0.1, 0]} size={[5.2, 0.18, 4.1]} color={FLOOR} />
      <Box
        position={[0, 1.65, -2]}
        size={[5.2, 3.4, 0.12]}
        color={BACK_WALL_COLORS[theme]}
      />
      <Box position={[-2.55, 1.65, 0]} size={[0.12, 3.4, 4.1]} color={SIDE_WALL} />
      <Window timeOfDay={timeOfDay} />
      <FramedPrint />
      <WallShelf />
      <group position={[-1.95, 0, -1.5]} scale={1.5}>
        <Plant />
      </group>
    </>
  );
}
