'use client';

import { AvatarProfileCard } from '@/app/(home)/_components/AvatarProfileCard';
import { useCurrentAvatar } from '@/app/(home)/_components/CurrentAvatarContext';

export function CurrentUserAvatarCard({
  displayName,
  estimate = '',
}: {
  displayName: string;
  estimate?: string;
}) {
  const { seed } = useCurrentAvatar();

  return (
    <AvatarProfileCard seed={seed} name={displayName} estimate={estimate} />
  );
}
