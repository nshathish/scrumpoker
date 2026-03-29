'use client';

import { useState } from 'react';
import { Flex } from '@radix-ui/themes';

import ProfileCard from '@/app/(protected)/session/_components/ProfileCard';
import PokerPoints from '@/app/(protected)/session/_components/PokerPoints';
import { useCurrentAvatar } from '@/components/avatar/CurrentAvatarContext';

import type { SessionGetPayload } from '@/generated/prisma/models/Session';

type SessionWithParticipants = SessionGetPayload<{
  include: {
    deck: true;
    participants: {
      include: {
        user: {
          select: {
            id: true;
            displayName: true;
            avatarSeed: true;
          };
        };
      };
    };
  };
}>;

interface SessionViewProps {
  session: SessionWithParticipants;
  currentUserId: string;
}

export default function SessionView({
  session,
  currentUserId,
}: SessionViewProps) {
  const { seed } = useCurrentAvatar();
  const [estimate, setEstimate] = useState('');

  const currentUser = session.participants.find(
    (p) => p.userId === currentUserId,
  );
  const isSpectator = currentUser?.role === 'SPECTATOR';

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col px-4 pb-32">
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <Flex
            direction="row"
            gap="5"
            wrap="wrap"
            justify="center"
            align="center"
          >
            {session.participants.map((participant) => (
              <ProfileCard
                key={participant.id}
                seed={
                  participant.userId === currentUserId
                    ? seed
                    : participant.user.avatarSeed
                }
                name={
                  participant.role === 'SPECTATOR'
                    ? `${participant.user.displayName} (spectator)`
                    : participant.user.displayName
                }
                estimate={
                  participant.userId === currentUserId ? estimate : undefined
                }
              />
            ))}
          </Flex>
        </div>
      </div>

      {/* Card selection - only for voters */}
      {!isSpectator && (
        <PokerPoints
          // cards={session.deck.cards}
          value={estimate}
          onValueChange={setEstimate}
        />
      )}
    </>
  );
}
