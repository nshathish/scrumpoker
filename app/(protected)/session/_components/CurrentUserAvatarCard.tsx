'use client';

import AvatarProfileCard from '@/components/avatar/AvatarProfileCard';
import { useCurrentAvatar } from '@/components/avatar/CurrentAvatarContext';

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
