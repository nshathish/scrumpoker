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
      <div className="flex min-h-0 flex-1 flex-col">
        <ProtectedNavbar />
        <div className="flex min-h-0 flex-1">
          <Sidebar />
          <main className="flex min-h-0 flex-1 flex-col">{children}</main>
        </div>
      </div>
    </CurrentAvatarProvider>
  );
}
