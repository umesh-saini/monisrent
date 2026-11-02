import { DoubleSide } from 'three';
import { Box, Cylinder } from '../primitives';

const MESH_RIBS = 9;
const CASTER_ARMS = 5;

/** Origin: on the floor, under the centre of the seat. */
export function ErgonomicChair() {
  const seat = '#424f4a';
  const frame = '#2e3532';
  const arm = '#4c5652';

  return (
    <>
      {Array.from({ length: CASTER_ARMS }, (_, index) => {
        const angle = (index / CASTER_ARMS) * Math.PI * 2;
        return (
          <group key={index} rotation={[0, angle, 0]}>
            <Box position={[0.2, 0.1, 0]} size={[0.42, 0.04, 0.06]} color={frame} />
            <Cylinder
              position={[0.4, 0.04, 0]}
              rotation={[Math.PI / 2, 0, 0]}
              radius={0.04}
              height={0.05}
              color="#191c1b"
            />
          </group>
        );
      })}
      <Box
        position={[0, 0.38, 0]}
        size={[0.07, 0.56, 0.07]}
        color="#6a706d"
        metalness={0.5}
      />
      <Box position={[0, 0.72, 0]} size={[0.8, 0.14, 0.74]} color={seat} radius={0.06} />
      <Box
        position={[0, 1.2, 0.34]}
        size={[0.68, 0.86, 0.06]}
        color={seat}
        radius={0.03}
      />
      {Array.from({ length: MESH_RIBS }, (_, index) => (
        <Box
          key={index}
          position={[0, 0.86 + index * 0.08, 0.375]}
          size={[0.58, 0.014, 0.014]}
          color="#7d8b82"
          radius={0.004}
        />
      ))}
      <Box
        position={[0, 1.76, 0.33]}
        size={[0.42, 0.2, 0.08]}
        color={seat}
        radius={0.03}
      />
      <Box position={[0, 1.1, 0.4]} size={[0.06, 0.72, 0.04]} color={frame} />
      {[-1, 1].map((side) => (
        <group key={side}>
          <Box
            position={[side * 0.46, 1.03, 0.04]}
            size={[0.09, 0.05, 0.42]}
            color={arm}
          />
          <Box
            position={[side * 0.46, 0.87, 0.14]}
            size={[0.05, 0.3, 0.05]}
            color={frame}
          />
        </group>
      ))}
    </>
  );
}

const RATTAN = '#c99d63';
const RATTAN_DARK = '#a97f49';
const SEAT_CUSHION = '#efe6d6';
const BACK_RADIUS = 0.44;
const BACK_HEIGHT = 0.92;
const BACK_ARC = Math.PI * 1.1;
/** Centres the arc behind the seat. A cylinder's angle 0 points along +z. */
const BACK_START = -BACK_ARC / 2;
const BACK_RIBS = 17;
const WEAVE_BANDS = [0.8, 1.02, 1.24, 1.46];

/** Origin: on the floor, under the centre of the seat. */
export function RattanChair() {
  return (
    <>
      {[-1, 1].flatMap((sideX) =>
        [-1, 1].map((sideZ) => (
          <Cylinder
            key={`${sideX}${sideZ}`}
            position={[sideX * 0.3, 0.3, sideZ * 0.28]}
            rotation={[sideZ * 0.12, 0, -sideX * 0.12]}
            radius={0.032}
            height={0.62}
            color={RATTAN_DARK}
          />
        )),
      )}
      <Cylinder position={[0, 0.62, 0]} radius={0.45} height={0.07} color={RATTAN} />
      <Cylinder
        position={[0, 0.69, 0]}
        radius={0.41}
        height={0.08}
        color={SEAT_CUSHION}
      />
      {/* The curved woven back, open toward the desk. */}
      <mesh position={[0, 1.12, 0.02]} castShadow>
        <cylinderGeometry
          args={[
            BACK_RADIUS,
            BACK_RADIUS,
            BACK_HEIGHT,
            28,
            1,
            true,
            BACK_START,
            BACK_ARC,
          ]}
        />
        <meshStandardMaterial color={RATTAN} roughness={0.85} side={DoubleSide} />
      </mesh>
      {WEAVE_BANDS.map((y) => (
        <mesh key={y} position={[0, y, 0.02]}>
          <cylinderGeometry
            args={[
              BACK_RADIUS + 0.008,
              BACK_RADIUS + 0.008,
              0.026,
              28,
              1,
              true,
              BACK_START,
              BACK_ARC,
            ]}
          />
          <meshStandardMaterial color={RATTAN_DARK} roughness={0.85} side={DoubleSide} />
        </mesh>
      ))}
      {Array.from({ length: BACK_RIBS }, (_, index) => {
        const angle = BACK_START + (index / (BACK_RIBS - 1)) * BACK_ARC;
        return (
          <Cylinder
            key={index}
            position={[
              Math.sin(angle) * (BACK_RADIUS + 0.012),
              1.12,
              Math.cos(angle) * (BACK_RADIUS + 0.012) + 0.02,
            ]}
            radius={0.011}
            height={BACK_HEIGHT}
            color={RATTAN_DARK}
          />
        );
      })}
    </>
  );
}
