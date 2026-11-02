import { useRef } from 'react';
import type { Group } from 'three';
import type { ChairId, DeskId } from '@/lib/catalog';
import type { Setup, Theme } from '@/lib/setup';
import { useEasedValue } from './animation';
import { DESK_CENTER_Z, DESK_LIFT, DESK_SURFACE_Y } from './dimensions';
import { LAMP_INTENSITY } from './lighting';
import { ErgonomicChair, RattanChair } from './models/chairs';
import { DeskLamp, Keyboard, LaptopStand, Mouse } from './models/desk-gear';
import { DeskBase, DeskTop } from './models/desks';
import { MonitorRow } from './models/monitors';
import {
  CoffeeStation,
  Plant,
  Rug,
  Speaker,
  Surfboard,
  TowerFan,
  Whiteboard,
} from './models/room-items';
import { RoomShell } from './room-shell';
import { SceneItem } from './scene-item';

const DESK_IDS: DeskId[] = ['electric-desk', 'mechanical-desk', 'dual-motor-desk'];

const CHAIR_IDS: ChairId[] = ['ergonomic-chair', 'rattan-chair'];

const CHAIR_MODELS: Record<ChairId, () => React.JSX.Element> = {
  'ergonomic-chair': ErgonomicChair,
  'rattan-chair': RattanChair,
};

const RUG_COLORS: Record<Theme, { color: string; stripe: string }> = {
  coral: { color: '#d9b49c', stripe: '#c4957a' },
  sage: { color: '#b3c2a6', stripe: '#98aa8a' },
  lavender: { color: '#c4b9d4', stripe: '#a99bbd' },
};

/** Lifts everything on the desk together when it switches between sitting and standing. */
function DeskSurface({
  isStanding,
  children,
}: {
  isStanding: boolean;
  children: React.ReactNode;
}) {
  const group = useRef<Group>(null);
  useEasedValue(
    isStanding ? DESK_LIFT : 0,
    (lift) => {
      if (group.current) group.current.position.y = DESK_SURFACE_Y + lift;
    },
    3.5,
    0,
  );

  return (
    <group ref={group} position={[0, DESK_SURFACE_Y, DESK_CENTER_Z]}>
      {children}
    </group>
  );
}

type RoomProps = {
  setup: Setup;
  isStanding: boolean;
};

export function Room({ setup, isStanding }: RoomProps) {
  const { deskId, chairId, accessories, theme, timeOfDay } = setup;
  const has = (id: keyof typeof accessories) => (accessories[id] ?? 0) > 0;
  const monitorCount = accessories.monitor ?? 0;

  return (
    <group position={[0, -0.7, 0]}>
      <RoomShell theme={theme} timeOfDay={timeOfDay} />

      <SceneItem id="rug" show={has('rug')} position={[0.1, 0, 0.45]}>
        <Rug {...RUG_COLORS[theme]} />
      </SceneItem>

      {DESK_IDS.map((id) => (
        <SceneItem key={id} id={id} show={deskId === id} position={[0, 0, DESK_CENTER_Z]}>
          <DeskBase id={id} />
        </SceneItem>
      ))}

      <DeskSurface isStanding={isStanding}>
        {DESK_IDS.map((id) => (
          <SceneItem key={id} id={id} show={deskId === id}>
            <DeskTop id={id} />
          </SceneItem>
        ))}
        <SceneItem id="monitor" show={monitorCount > 0} position={[0, 0, -0.32]}>
          <MonitorRow count={monitorCount} />
        </SceneItem>
        <SceneItem id="keyboard" show={has('keyboard')} position={[-0.05, 0, 0.32]}>
          <Keyboard />
        </SceneItem>
        <SceneItem id="mouse" show={has('mouse')} position={[0.48, 0, 0.34]}>
          <Mouse />
        </SceneItem>
        <SceneItem
          id="laptop-stand"
          show={has('laptop-stand')}
          position={[-0.92, 0, 0.12]}
          rotation={[0, 0.3, 0]}
        >
          <LaptopStand />
        </SceneItem>
        <SceneItem id="lamp" show={has('lamp')} position={[-1.2, 0, -0.5]}>
          <DeskLamp intensity={LAMP_INTENSITY[timeOfDay]} />
        </SceneItem>
        <SceneItem id="plant" show={has('plant')} position={[1.13, 0, 0.32]}>
          <group scale={0.62}>
            <Plant />
          </group>
        </SceneItem>
      </DeskSurface>

      <group position={[0, 0, 0.92]}>
        {CHAIR_IDS.map((id) => {
          const ChairModel = CHAIR_MODELS[id];
          return (
            <SceneItem key={id} id={id} show={chairId === id}>
              <ChairModel />
            </SceneItem>
          );
        })}
      </group>

      <SceneItem
        id="coffee-machine"
        show={has('coffee-machine')}
        position={[2.08, 0, -1.55]}
      >
        <CoffeeStation />
      </SceneItem>
      <SceneItem id="whiteboard" show={has('whiteboard')} position={[-0.88, 2.5, -1.92]}>
        <Whiteboard />
      </SceneItem>
      <SceneItem
        id="speaker"
        show={has('speaker')}
        position={[-2.1, 0, 0.55]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <group scale={0.75}>
          <Speaker />
        </group>
      </SceneItem>
      <SceneItem
        id="tower-fan"
        show={has('tower-fan')}
        position={[2.25, 0, -0.5]}
        rotation={[0, -0.7, 0]}
      >
        <TowerFan />
      </SceneItem>
      <SceneItem
        id="surfboard"
        show={has('surfboard')}
        position={[-2.17, 0, 1.45]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <Surfboard />
      </SceneItem>
    </group>
  );
}
