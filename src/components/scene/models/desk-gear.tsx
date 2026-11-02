import { Box, Cylinder } from '../primitives';

const KEY_ROWS = 5;
const KEYS_PER_ROW = 13;

/** Origin: on the desk surface, at the centre of each object. */
export function Keyboard() {
  return (
    <>
      <Box
        position={[0, 0.018, 0]}
        size={[0.74, 0.03, 0.25]}
        color="#2f3436"
        radius={0.012}
      />
      {Array.from({ length: KEY_ROWS }, (_, row) =>
        Array.from({ length: KEYS_PER_ROW }, (_, column) => (
          <Box
            key={`${row}-${column}`}
            position={[-0.3 + column * 0.05, 0.037, -0.08 + row * 0.04]}
            size={[0.036, 0.008, 0.032]}
            color="#555c5f"
            radius={0.002}
          />
        )),
      )}
    </>
  );
}

export function Mouse() {
  return (
    <group position={[0, 0.03, 0]}>
      <mesh scale={[0.075, 0.042, 0.115]} castShadow>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color="#2f3436" roughness={0.5} />
      </mesh>
    </group>
  );
}

const STAND_METAL = '#b6bab7';

export function LaptopStand() {
  return (
    <>
      {/* The stand */}
      {[-1, 1].map((side) => (
        <Box
          key={side}
          position={[side * 0.2, 0.09, 0.02]}
          rotation={[0.42, 0, 0]}
          size={[0.04, 0.26, 0.42]}
          color={STAND_METAL}
          metalness={0.6}
        />
      ))}
      <group position={[0, 0.2, 0]} rotation={[0.4, 0, 0]}>
        {/* Your laptop, not part of the rental */}
        <Box size={[0.68, 0.025, 0.46]} color="#c9cdcb" radius={0.01} metalness={0.4} />
        <group position={[0, 0.19, -0.3]} rotation={[-0.55, 0, 0]}>
          <Box size={[0.68, 0.44, 0.02]} color="#c9cdcb" radius={0.008} metalness={0.4} />
          <mesh position={[0, 0, 0.012]}>
            <planeGeometry args={[0.63, 0.39]} />
            <meshBasicMaterial color="#1e2a33" />
          </mesh>
          <mesh position={[-0.12, 0.05, 0.013]}>
            <planeGeometry args={[0.3, 0.2]} />
            <meshBasicMaterial color="#7dd3a8" />
          </mesh>
          <mesh position={[0.17, 0.05, 0.013]}>
            <planeGeometry args={[0.2, 0.2]} />
            <meshBasicMaterial color="#e6b866" />
          </mesh>
        </group>
      </group>
    </>
  );
}

const LAMP_METAL = '#e8e6df';

/** A slim LED bar on an arm, like the real Smart LED Desk Lamp 1S. */
export function DeskLamp({ intensity }: { intensity: number }) {
  return (
    <>
      <Cylinder
        position={[0, 0.015, 0]}
        radius={0.13}
        bottomRadius={0.14}
        height={0.03}
        color={LAMP_METAL}
      />
      <Box position={[0, 0.42, 0]} size={[0.03, 0.82, 0.03]} color={LAMP_METAL} />
      <group position={[0.26, 0.83, 0.05]} rotation={[0, -0.25, 0]}>
        <Box size={[0.72, 0.035, 0.09]} color={LAMP_METAL} />
        <mesh position={[0, -0.019, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.66, 0.065]} />
          <meshBasicMaterial color="#fff2d0" />
        </mesh>
        <pointLight
          position={[0, -0.12, 0]}
          intensity={intensity}
          color="#ffd9a0"
          distance={5}
          decay={1.6}
        />
      </group>
    </>
  );
}
