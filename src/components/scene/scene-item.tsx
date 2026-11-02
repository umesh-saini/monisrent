import type { ThreeEvent } from '@react-three/fiber';
import { createContext, useContext, useEffect, type ReactNode } from 'react';
import type { ProductId } from '@/lib/catalog';
import { Appear } from './appear';
import type { Vec3 } from './primitives';

/** A pointer that moved further than this was orbiting the camera, not clicking. */
const CLICK_DRAG_TOLERANCE_PX = 4;

export type SceneEvents = {
  onPick: (id: ProductId) => void;
  onHover: (id: ProductId | null) => void;
};

export const SceneEventsContext = createContext<SceneEvents | null>(null);

type SceneItemProps = {
  id: ProductId;
  show: boolean;
  position?: Vec3;
  rotation?: Vec3;
  children: ReactNode;
};

/** A rentable object in the room: it animates in and out, and it can be clicked. */
export function SceneItem({ id, show, position, rotation, children }: SceneItemProps) {
  const events = useContext(SceneEventsContext);

  // An item removed from under the pointer never fires pointer-out.
  useEffect(() => {
    if (!show) document.body.style.cursor = '';
  }, [show]);

  function handleClick(event: ThreeEvent<MouseEvent>) {
    event.stopPropagation();
    if (event.delta <= CLICK_DRAG_TOLERANCE_PX) events?.onPick(id);
  }

  function handlePointerOver(event: ThreeEvent<PointerEvent>) {
    event.stopPropagation();
    document.body.style.cursor = 'pointer';
    events?.onHover(id);
  }

  function handlePointerOut() {
    document.body.style.cursor = '';
    events?.onHover(null);
  }

  return (
    <Appear show={show} position={position} rotation={rotation}>
      <group
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        {children}
      </group>
    </Appear>
  );
}
