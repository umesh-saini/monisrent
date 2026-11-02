import type { DeskId } from '@/lib/catalog';
import { DESK_LIFT } from '../dimensions';
import { Box } from '../primitives';

type DeskLook = {
  width: number;
  top: string;
  frame: string;
  thickness: number;
};

const DESK_LOOKS: Record<DeskId, DeskLook> = {
  'electric-desk': {
    width: 2.8,
    top: '#f1eee6',
    frame: '#3f4644',
    thickness: 0.07,
  },
  'mechanical-desk': {
    width: 2.8,
    top: '#c79a68',
    frame: '#f1eee6',
    thickness: 0.09,
  },
  'dual-motor-desk': {
    width: 3.2,
    top: '#5c4436',
    frame: '#23282a',
    thickness: 0.08,
  },
};

const DEPTH = 1.3;
const SLEEVE_HEIGHT = 0.95;
const FOOT_DEPTH = 1.2;
const INSET_FROM_EDGE = 0.32;

function columnPositions(look: DeskLook): [number, number] {
  const x = look.width / 2 - INSET_FROM_EDGE;
  return [-x, x];
}

/** The part of the desk that stays on the floor. Origin: floor, under the desk's centre. */
export function DeskBase({ id }: { id: DeskId }) {
  const look = DESK_LOOKS[id];

  return (
    <>
      {columnPositions(look).map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <Box
            position={[0, 0.03, 0]}
            size={[0.13, 0.06, FOOT_DEPTH]}
            color={look.frame}
          />
          <Box
            position={[0, SLEEVE_HEIGHT / 2, 0]}
            size={[0.17, SLEEVE_HEIGHT, 0.17]}
            color={look.frame}
            metalness={0.3}
          />
        </group>
      ))}
    </>
  );
}

/** The part that rides up when the desk stands. Origin: top surface of the desk. */
export function DeskTop({ id }: { id: DeskId }) {
  const look = DESK_LOOKS[id];
  // Long enough to stay inside the sleeves even at full standing height.
  const columnLength = DESK_LIFT + 0.42;

  return (
    <>
      <Box
        position={[0, -look.thickness / 2, 0]}
        size={[look.width, look.thickness, DEPTH]}
        color={look.top}
        radius={0.025}
      />
      {columnPositions(look).map((x) => (
        <Box
          key={x}
          position={[x, -columnLength / 2 - look.thickness, 0]}
          size={[0.13, columnLength, 0.13]}
          color={look.frame}
          metalness={0.5}
          roughness={0.45}
        />
      ))}
      <Box
        position={[0, -look.thickness - 0.03, -0.35]}
        size={[look.width - 0.9, 0.05, 0.08]}
        color={look.frame}
      />
      {id === 'electric-desk' && (
        <Box
          position={[0.95, -look.thickness - 0.02, 0.6]}
          size={[0.3, 0.04, 0.1]}
          color="#1d2120"
        />
      )}
      {id === 'dual-motor-desk' && (
        <Box
          position={[1.15, -look.thickness - 0.02, 0.6]}
          size={[0.3, 0.04, 0.1]}
          color="#111"
        />
      )}
      {id === 'mechanical-desk' && (
        // The hand crank, tucked under the front edge.
        <group position={[1.02, -look.thickness - 0.1, 0.55]}>
          <Box size={[0.03, 0.2, 0.03]} color="#8a8f8b" />
          <Box position={[0.07, -0.1, 0]} size={[0.16, 0.03, 0.03]} color="#8a8f8b" />
        </group>
      )}
    </>
  );
}
