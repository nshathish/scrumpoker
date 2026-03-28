import Link from 'next/link';
import { Flex, Text } from '@radix-ui/themes';

import UserMenu from '@/components/shared/UserMenu';

import { getAuthenticatedUser } from '@/lib/auth';

export default async function ProtectedNavbar() {
  const user = await getAuthenticatedUser();

  return (
    <nav className="border-b">
      <Flex align="center" justify="between" px="6" py="3">
        <Text size="4" weight="bold" asChild>
          <Link href="/">Scrum Poker</Link>
        </Text>

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
