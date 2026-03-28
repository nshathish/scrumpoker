'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Avatar, DropdownMenu, Text } from '@radix-ui/themes';

import { useCurrentAvatar } from '@/components/avatar/CurrentAvatarContext';
import { AvatarModal } from '@/app/(protected)/session/_components/AvatarModal';

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
          <button className="cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-offset-2">
            <Avatar
              src={`https://api.dicebear.com/9.x/bottts/svg?seed=${seed}`}
              fallback="?"
              size="3"
              radius="full"
            />
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

          <DropdownMenu.Item color="red" asChild>
            <Link href="/auth/logout">Sign out</Link>
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
