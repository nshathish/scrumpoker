'use client';

import { useState } from 'react';

import { CurrentUserAvatarCard } from '@/app/(home)/_components/CurrentUserAvatarCard';
import { PokerPoints } from '@/app/(home)/_components/PokerPoints';

export function HomeSessionOverlays({ displayName }: { displayName: string }) {
  const [estimate, setEstimate] = useState('');

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-20 flex items-center justify-center px-4 pb-36 pt-16">
        <div className="pointer-events-auto">
          <CurrentUserAvatarCard displayName={displayName} estimate={estimate} />
        </div>
      </div>

      <PokerPoints value={estimate} onValueChange={setEstimate} />
    </>
  );
}
