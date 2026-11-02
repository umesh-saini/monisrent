import { DoubleSide } from 'three';
import { Box, Cylinder } from '../primitives';

const LEAF_COUNT = 7;
const GOLDEN_ANGLE = 2.4;

/** Origin: on whatever surface it stands on. */
export function Plant() {
  return (
    <>
      <Cylinder
        position={[0, 0.18, 0]}
        radius={0.19}
        bottomRadius={0.14}
        height={0.36}
        color="#c18b6d"
      />
      <Cylinder position={[0, 0.58, 0]} radius={0.018} height={0.65} color="#526d40" />
      {Array.from({ length: LEAF_COUNT }, (_, index) => {
        const angle = index * GOLDEN_ANGLE;
        return (
          <mesh
            key={index}
            position={[
              Math.sin(angle) * 0.15,
              0.4 + index * 0.075,
              Math.cos(angle) * 0.1,
            ]}
            rotation={[0, angle, 0.7]}
            scale={[0.1, 0.24, 0.055]}
            castShadow
          >
            <sphereGeometry args={[1, 12, 12]} />
            <meshStandardMaterial color={index % 2 ? '#729565' : '#4d7651'} />
          </mesh>
        );
      })}
    </>
  );
}

const RUG_STRIPES = 7;

export function Rug({ color, stripe }: { color: string; stripe: string }) {
  return (
    <>
      <Box
        position={[0, 0.012, 0]}
        size={[3.6, 0.024, 2.7]}
        color={color}
        radius={0.008}
      />
      {Array.from({ length: RUG_STRIPES }, (_, index) => (
        <mesh
          key={index}
          position={[-1.5 + index * 0.5, 0.026, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
        >
          <planeGeometry args={[0.07, 2.6]} />
          <meshStandardMaterial color={stripe} />
        </mesh>
      ))}
    </>
  );
}

/** Espresso machine on the little side table it needs to live on. */
export function CoffeeStation() {
  const tableTop = 0.95;
  return (
    <>
      <Box position={[0, tableTop - 0.03, 0]} size={[0.92, 0.06, 0.62]} color="#b58c65" />
      {[-1, 1].flatMap((sideX) =>
        [-1, 1].map((sideZ) => (
          <Box
            key={`${sideX}${sideZ}`}
            position={[sideX * 0.38, (tableTop - 0.06) / 2, sideZ * 0.24]}
            size={[0.05, tableTop - 0.06, 0.05]}
            color="#8a6848"
          />
        )),
      )}
      <Box position={[0, 0.32, 0]} size={[0.82, 0.04, 0.54]} color="#a07a56" />

      <group position={[-0.14, tableTop, 0]}>
        <Box position={[0, 0.03, 0.02]} size={[0.24, 0.05, 0.3]} color="#1f2326" />
        <Box
          position={[0, 0.24, -0.06]}
          size={[0.22, 0.38, 0.2]}
          color="#b3322f"
          radius={0.04}
        />
        <Box
          position={[0, 0.36, 0.08]}
          size={[0.15, 0.09, 0.14]}
          color="#1f2326"
          radius={0.02}
        />
      </group>
      <Cylinder
        position={[-0.14, tableTop + 0.1, 0.09]}
        radius={0.04}
        bottomRadius={0.032}
        height={0.07}
        color="#f4efe6"
      />
      <Cylinder
        position={[0.24, tableTop + 0.05, 0.08]}
        radius={0.05}
        bottomRadius={0.04}
        height={0.09}
        color="#f4efe6"
      />
      <Cylinder
        position={[0.24, tableTop + 0.14, -0.1]}
        radius={0.05}
        bottomRadius={0.04}
        height={0.09}
        color="#d88a5f"
      />
      <Cylinder
        position={[0.24, tableTop + 0.045, -0.1]}
        radius={0.05}
        bottomRadius={0.04}
        height={0.09}
        color="#e6cfa8"
      />
    </>
  );
}

/** Wall-mounted. Origin: the centre of the board, against the wall. */
export function Whiteboard() {
  return (
    <>
      <Box size={[1.32, 0.92, 0.04]} color="#c0c3c0" radius={0.012} metalness={0.3} />
      <mesh position={[0, 0, 0.022]}>
        <planeGeometry args={[1.25, 0.85]} />
        <meshStandardMaterial color="#fbfbf6" roughness={0.3} />
      </mesh>
      {/* A hand-drawn roadmap */}
      {[
        { x: -0.36, y: 0.21, width: 0.32, height: 0.17, color: '#f0c776' },
        { x: 0.03, y: 0.21, width: 0.28, height: 0.17, color: '#9ccfb0' },
        { x: 0.38, y: 0.21, width: 0.26, height: 0.17, color: '#e49a7e' },
        { x: -0.34, y: -0.03, width: 0.34, height: 0.03, color: '#39424a' },
        { x: -0.28, y: -0.1, width: 0.46, height: 0.03, color: '#39424a' },
        { x: -0.32, y: -0.17, width: 0.38, height: 0.03, color: '#39424a' },
        { x: 0.26, y: -0.1, width: 0.44, height: 0.24, color: '#a9c1e0' },
      ].map(({ x, y, width, height, color }) => (
        <mesh key={`${x}${y}`} position={[x, y, 0.024]}>
          <planeGeometry args={[width, height]} />
          <meshStandardMaterial color={color} />
        </mesh>
      ))}
    </>
  );
}

/** Marshall-style speaker: black box, gold details. */
export function Speaker() {
  return (
    <>
      <Box position={[0, 0.4, 0]} size={[0.8, 0.8, 0.42]} color="#191a1b" radius={0.03} />
      <Box
        position={[0, 0.4, 0.2]}
        size={[0.68, 0.68, 0.03]}
        color="#2c2b28"
        radius={0.012}
      />
      {[0.55, 0.27].map((y, index) => (
        <mesh key={y} position={[0, y, 0.218]}>
          <circleGeometry args={[index ? 0.1 : 0.06, 24]} />
          <meshStandardMaterial color="#111" />
        </mesh>
      ))}
      <Box
        position={[0, 0.72, 0.218]}
        size={[0.15, 0.03, 0.006]}
        color="#c8a35b"
        radius={0.003}
      />
      <Box
        position={[0.28, 0.1, 0.218]}
        size={[0.1, 0.022, 0.006]}
        color="#c8a35b"
        radius={0.003}
      />
    </>
  );
}

export function TowerFan() {
  return (
    <>
      <Cylinder
        position={[0, 0.03, 0]}
        radius={0.2}
        bottomRadius={0.22}
        height={0.06}
        color="#f1efe8"
      />
      <Box
        position={[0, 0.98, 0]}
        size={[0.22, 1.86, 0.22]}
        color="#f4f2eb"
        radius={0.08}
      />
      <Box
        position={[0, 0.95, 0.11]}
        size={[0.12, 1.3, 0.01]}
        color="#b9bcb6"
        radius={0.004}
      />
    </>
  );
}

/** Leaning against the wall. Origin: where its tail touches the floor. */
export function Surfboard() {
  return (
    <group rotation={[0, 0, 0.11]}>
      <mesh position={[0, 1.12, 0]} scale={[0.2, 1.12, 0.036]} castShadow>
        <sphereGeometry args={[1, 28, 28]} />
        <meshStandardMaterial color="#f7efe0" roughness={0.3} />
      </mesh>
      {/* Stripes follow the board's taper: wider near its middle. */}
      {[0.72, 1.12, 1.52].map((y, index) => (
        <mesh key={y} position={[0, y, 0.039]}>
          <planeGeometry args={[index === 1 ? 0.38 : 0.33, 0.075]} />
          <meshStandardMaterial
            color={index === 1 ? '#3e8ca0' : '#d86f4f'}
            side={DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}
