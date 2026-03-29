import { ReactNode } from 'react';

import { CurrentAvatarProvider } from '@/components/avatar/CurrentAvatarContext';
import ProtectedNavbar from '@/components/shared/ProtectedNavbar';
import Sidebar from '@/components/shared/Sidebar';

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const assignedSeed = 'monkey1';

  return (
    <CurrentAvatarProvider initialSeed={assignedSeed}>
      <ProtectedNavbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1">{children}</main>
      </div>
    </CurrentAvatarProvider>
  );
}
