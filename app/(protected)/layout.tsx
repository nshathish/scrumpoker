import { ReactNode } from 'react';

import { CurrentAvatarProvider } from '@/components/avatar/CurrentAvatarContext';
import ProtectedNavbar from '@/components/shared/ProtectedNavbar';

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const assignedSeed = 'monkey1';

  return (
    <CurrentAvatarProvider initialSeed={assignedSeed}>
      <ProtectedNavbar />
      {children}
    </CurrentAvatarProvider>
  );
}
