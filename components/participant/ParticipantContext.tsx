'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

interface ParticipantInfo {
  id: string;
  role: 'VOTER' | 'SPECTATOR';
}

interface ParticipantContextValue {
  participant: ParticipantInfo | null;
  setParticipant: (p: ParticipantInfo | null) => void;
}

const ParticipantContext = createContext<ParticipantContextValue | null>(null);

export function ParticipantProvider({ children }: { children: ReactNode }) {
  const [participant, setParticipantState] = useState<ParticipantInfo | null>(null);

  const setParticipant = useCallback((p: ParticipantInfo | null) => {
    setParticipantState(p);
  }, []);

  const value = useMemo(() => ({ participant, setParticipant }), [participant, setParticipant]);

  return (
    <ParticipantContext.Provider value={value}>
      {children}
    </ParticipantContext.Provider>
  );
}

export function useParticipant(): ParticipantContextValue {
  const ctx = useContext(ParticipantContext);
  if (!ctx) throw new Error('useParticipant must be used within ParticipantProvider');
  return ctx;
}
