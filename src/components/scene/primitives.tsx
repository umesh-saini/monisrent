import { RoundedBox } from '@react-three/drei';

export type Vec3 = [number, number, number];

type BoxProps = {
  position?: Vec3;
  rotation?: Vec3;
  size: Vec3;
  color: string;
  radius?: number;
  roughness?: number;
  metalness?: number;
};

/** The building block of the room: a soft-edged box with a matte finish. */
export function Box({
  position,
  rotation,
  size,
  color,
  radius = 0.02,
  roughness = 0.75,
  metalness = 0,
}: BoxProps) {
  return (
    <RoundedBox
      args={size}
      radius={radius}
      smoothness={3}
      position={position}
      rotation={rotation}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
    </RoundedBox>
  );
}

type CylinderProps = {
  position?: Vec3;
  rotation?: Vec3;
  radius: number;
  bottomRadius?: number;
  height: number;
  color: string;
};

export function Cylinder({
  position,
  rotation,
  radius,
  bottomRadius = radius,
  height,
  color,
}: CylinderProps) {
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <cylinderGeometry args={[radius, bottomRadius, height, 24]} />
      <meshStandardMaterial color={color} roughness={0.7} />
    </mesh>
  );
}
