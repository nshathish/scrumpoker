'use client';

import { useState } from 'react';

import PokerPoints from '@/app/(protected)/session/_components/PokerPoints';
import ProfileCard from '@/app/(protected)/session/_components/ProfileCard';

import { useCurrentAvatar } from '@/components/avatar/CurrentAvatarContext';

export function HomeSessionOverlays({ displayName }: { displayName: string }) {
  const { seed } = useCurrentAvatar();
  const [estimate, setEstimate] = useState('');

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-20 flex items-center justify-center px-4 pb-36 pt-16">
        <div className="pointer-events-auto">
          <ProfileCard seed={seed} name={displayName} estimate={estimate} />
        </div>
      </div>

      <PokerPoints value={estimate} onValueChange={setEstimate} />
    </>
  );
}
