import Link from 'next/link';
import { Flex } from '@radix-ui/themes';

import UserMenu from '@/components/shared/UserMenu';
import AppLogo from '@/components/shared/AppLogo';

import { getAuthenticatedUser } from '@/lib/auth';

export default async function ProtectedNavbar() {
  const user = await getAuthenticatedUser();

  return (
    <nav className="border-b bg-[#fefefe]">
      <Flex align="center" justify="between" px="6" py="2">
        <Flex align="center" gap="2" asChild>
          <Link href="/">
            <AppLogo width={120} />
          </Link>
        </Flex>

        <Flex align="center" gap="4">
          {/* add session-specific links here later */}

          {user && (
            <UserMenu
              email={user.isRegistered ? user.email : undefined}
              isRegistered={user.isRegistered}
            />
          )}
        </Flex>
      </Flex>
    </nav>
  );
}
