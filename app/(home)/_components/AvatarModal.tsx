'use client';

import Image from 'next/image';
import { Dialog, Button, Flex } from '@radix-ui/themes';

import { AvatarGrid } from '@/app/(home)/_components/AvatarGrid';
import { useCurrentAvatar } from '@/app/(home)/_components/CurrentAvatarContext';

export interface AvatarModalProps {
  seeds: string[];
  onAvatarChange?: (seed: string) => void;
}

export function AvatarModal({ seeds, onAvatarChange }: AvatarModalProps) {
  const { seed, setSeed } = useCurrentAvatar();

  const handleSelect = (next: string) => {
    setSeed(next);
    onAvatarChange?.(next);
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <button className="fixed right-6 top-6 z-50 rounded-full bg-white shadow-lg p-1 hover:scale-105 transition">
          <Image
            src={`/api/avatar?seed=${encodeURIComponent(seed)}`}
            alt="Your avatar"
            width={56}
            height={56}
            unoptimized
            loading="eager"
            className="rounded-full"
          />
        </button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="480px">
        <Dialog.Title>Select Your Avatar</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Choose an avatar from the panel below.
        </Dialog.Description>

        <AvatarGrid
          seeds={seeds}
          size={120}
          selectedSeed={seed}
          onSelect={handleSelect}
        />

        <Flex justify="end" mt="4">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Close
            </Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
