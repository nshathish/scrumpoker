import { cookies } from 'next/headers';
import { unstable_noStore as noStore } from 'next/cache';

import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';

type CurrentUser = {
  id: string;
  displayName: string;
  avatarSeed: string;
  email?: string;
  isRegistered: boolean;
};

export async function getAuthenticatedUser(): Promise<CurrentUser | null> {
  noStore();

  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (authUser) {
    const user = await prisma.user.findUnique({
      where: { authId: authUser.id },
    });

    if (user) {
      return {
        id: user.id,
        displayName: user.displayName,
        avatarSeed: user.avatarSeed,
        email: authUser.email,
        isRegistered: true,
      };
    }
  }

  const cookieStore = await cookies();
  const guestId = cookieStore.get('guest_user_id')?.value;

  if (guestId) {
    const user = await prisma.user.findUnique({
      where: { id: guestId },
    });

    if (user) {
      return {
        id: user.id,
        displayName: user.displayName,
        avatarSeed: user.avatarSeed,
        isRegistered: false,
      };
    }
  }

  return null;
}
