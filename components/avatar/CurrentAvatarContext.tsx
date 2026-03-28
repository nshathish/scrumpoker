'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

interface CurrentAvatarContextValue {
  seed: string;
  setSeed: (seed: string) => void;
}

const CurrentAvatarContext = createContext<CurrentAvatarContextValue | null>(
  null,
);

export function CurrentAvatarProvider({
  initialSeed,
  children,
}: {
  initialSeed: string;
  children: ReactNode;
}) {
  const [seed, setSeedState] = useState(initialSeed);
  const setSeed = useCallback((next: string) => {
    setSeedState(next);
  }, []);

  const value = useMemo(
    () => ({
      seed,
      setSeed,
    }),
    [seed, setSeed],
  );

  return (
    <CurrentAvatarContext.Provider value={value}>
      {children}
    </CurrentAvatarContext.Provider>
  );
}

export function useCurrentAvatar(): CurrentAvatarContextValue {
  const ctx = useContext(CurrentAvatarContext);
  if (!ctx) {
    throw new Error(
      'useCurrentAvatar must be used within CurrentAvatarProvider',
    );
  }
  return ctx;
}
