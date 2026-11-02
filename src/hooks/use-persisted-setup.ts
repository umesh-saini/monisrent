import { useEffect, useState } from 'react';
import { setupFromSearchParams } from '@/lib/share-link';
import { initialSetup, parseSetup, type Setup } from '@/lib/setup';

const STORAGE_KEY = 'monis-setup-v2';

function readSavedSetup(): Setup | null {
  try {
    return parseSetup(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null'));
  } catch {
    return null; // Corrupt or blocked storage: fall back to the defaults.
  }
}

/**
 * Setup state that survives a reload and can arrive through a shared link.
 * Starts from the defaults so the server and client HTML match.
 */
export function usePersistedSetup() {
  const [setup, setSetup] = useState<Setup>(initialSetup);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const shared = setupFromSearchParams(new URLSearchParams(window.location.search));
    if (shared) window.history.replaceState(null, '', window.location.pathname);

    // These only exist in the browser, so reading them must wait until after hydration.
    /* eslint-disable react-hooks/set-state-in-effect */
    const loaded = shared ?? readSavedSetup();
    if (loaded) setSetup(loaded);
    setHasLoaded(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (!hasLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(setup));
    } catch {
      // Storage full or blocked: the setup just won't persist.
    }
  }, [setup, hasLoaded]);

  return [setup, setSetup] as const;
}
