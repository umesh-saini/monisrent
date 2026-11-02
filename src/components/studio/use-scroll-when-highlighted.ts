import { useEffect, useRef } from 'react';

/** Brings a catalog item into view when the customer clicks its model in the 3D room. */
export function useScrollWhenHighlighted<T extends HTMLElement>(isHighlighted: boolean) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (isHighlighted)
      ref.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [isHighlighted]);

  return ref;
}
