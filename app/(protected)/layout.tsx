import { ReactNode } from 'react';

import ProtectedNavbar from '@/components/shared/ProtectedNavbar';
import Sidebar from '@/components/shared/Sidebar';
import { CurrentAvatarProvider } from '@/components/avatar/CurrentAvatarContext';

import { getAuthenticatedUser } from '@/lib/auth';

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getAuthenticatedUser();

  return (
    <CurrentAvatarProvider initialSeed={user?.avatarSeed ?? 'default'}>
      <ProtectedNavbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1">{children}</main>
      </div>
    </CurrentAvatarProvider>
  );
}
