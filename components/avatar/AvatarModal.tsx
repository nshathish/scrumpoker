'use client';

import { Dialog, Button, Flex } from '@radix-ui/themes';

import AvatarGrid from '@/components/avatar/AvatarGrid';
import { useCurrentAvatar } from '@/components/avatar/CurrentAvatarContext';

interface AvatarModalProps {
  seeds: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAvatarChange?: (seed: string) => void;
}

export default function AvatarModal({
  seeds,
  onAvatarChange,
  open,
  onOpenChange,
}: AvatarModalProps) {
  const { seed, setSeed } = useCurrentAvatar();

  const handleSelect = (next: string) => {
    setSeed(next);
    onAvatarChange?.(next);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
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
