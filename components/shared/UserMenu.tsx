'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Avatar, DropdownMenu, Text } from '@radix-ui/themes';

import AvatarModal from '@/components/avatar/AvatarModal';
import { useCurrentAvatar } from '@/components/avatar/CurrentAvatarContext';

import { logout } from '@/app/auth/actions';
import { getAvatarUrl } from '@/lib/utils/avatar';

interface UserMenuProps {
  email?: string;
  isRegistered: boolean;
}

const seeds = [
  'monkey1',
  'monkey2',
  'monkey3',
  'monkey4',
  'monkey5',
  'monkey6',
  'monkey7',
  'monkey8',
  'monkey9',
  'monkey10',
  'human1',
  'human2',
];

export default function UserMenu({ email, isRegistered }: UserMenuProps) {
  const { seed } = useCurrentAvatar();
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <button
            type="button"
            className="cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            <span className="avatar-face-ring inline-flex">
              <Avatar
                src={getAvatarUrl(seed)}
                fallback="?"
                size="3"
                radius="full"
              />
            </span>
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content sideOffset={8} align="end">
          {email && (
            <>
              <DropdownMenu.Label>
                <Text size="2" color="gray">
                  {email}
                </Text>
              </DropdownMenu.Label>
              <DropdownMenu.Separator />
            </>
          )}

          {isRegistered && (
            <DropdownMenu.Item asChild>
              <Link href="/account">Account</Link>
            </DropdownMenu.Item>
          )}

          <DropdownMenu.Item onClick={() => setAvatarModalOpen(true)}>
            Change avatar
          </DropdownMenu.Item>

          <DropdownMenu.Separator />

          <DropdownMenu.Item asChild>
            <Link href="/feedback">Provide feedback</Link>
          </DropdownMenu.Item>

          <DropdownMenu.Item asChild>
            <Link href="/feedback/board">Feedback board</Link>
          </DropdownMenu.Item>

          <DropdownMenu.Separator />

          <DropdownMenu.Item asChild>
            <form action={logout} className="w-full">
              <button
                type="submit"
                className="w-full cursor-pointer border-0 bg-transparent p-0 text-left font-inherit text-inherit outline-none focus-visible:outline-none"
              >
                Sign out
              </button>
            </form>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>

      <AvatarModal
        seeds={seeds}
        open={avatarModalOpen}
        onOpenChange={setAvatarModalOpen}
      />
    </>
  );
}
