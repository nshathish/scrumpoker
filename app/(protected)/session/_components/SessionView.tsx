'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Flex } from '@radix-ui/themes';

import ProfileCard from '@/app/(protected)/session/_components/ProfileCard';
import PokerPoints from '@/app/(protected)/session/_components/PokerPoints';
import { useCurrentAvatar } from '@/components/avatar/CurrentAvatarContext';

import { revealSession, submitVote } from '@/app/(protected)/session/actions';
import { useServerAction } from '@/lib/hooks/use-server-action';
import { useSessionRealtime } from '@/lib/hooks/use-session-realtime';

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
        votes: true;
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
  const router = useRouter();
  const { seed } = useCurrentAvatar();
  const { execute } = useServerAction(submitVote);
  const { execute: runReveal, isPending: isRevealing } =
    useServerAction(revealSession);
  const [estimate, setEstimate] = useState('');

  const { broadcastSessionRevealed } = useSessionRealtime(session.id);

  const handleVote = (value: string) => {
    setEstimate(value);
    if (currentUser) {
      execute({
        sessionId: session.id,
        participantId: currentUser.id,
        round: session.currentRound,
        value,
      }).catch(console.error);
    }
  };

  const currentUser = session.participants.find(
    (p) => p.userId === currentUserId,
  );
  const isSpectator = currentUser?.role === 'SPECTATOR';
  const isRevealed = session.status === 'REVEALED';
  const isVoting = session.status === 'VOTING';

  const anotherVoterHasSubmitted = session.participants.some(
    (p) =>
      p.userId !== currentUserId &&
      p.role === 'VOTER' &&
      p.votes.some((v) => v.round === session.currentRound),
  );

  const canReveal = isVoting && anotherVoterHasSubmitted;

  const handleReveal = () => {
    runReveal(session.id).then((result) => {
      if (result.status === 'success') {
        router.refresh();
        void broadcastSessionRevealed();
      }
    });
  };

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col px-4 pb-32">
        <div className="flex shrink-0 justify-center pt-4 pb-3">
          <Button
            size="3"
            variant="solid"
            disabled={!canReveal || isRevealing}
            onClick={handleReveal}
            highContrast
          >
            {isRevealed ? 'Revealed' : 'Reveal votes'}
          </Button>
        </div>
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <Flex
            direction="row"
            gap="5"
            wrap="wrap"
            justify="center"
            align="center"
          >
            {session.participants.map((participant) => {
              const hasVotedThisRound = participant.votes.some(
                (v) => v.round === session.currentRound,
              );
              const isCurrentUser = participant.userId === currentUserId;
              const roundVote = participant.votes.find(
                (v) => v.round === session.currentRound,
              );

              return (
                <ProfileCard
                  key={participant.id}
                  seed={isCurrentUser ? seed : participant.user.avatarSeed}
                  name={
                    participant.role === 'SPECTATOR'
                      ? `${participant.user.displayName} (spectator)`
                      : participant.user.displayName
                  }
                  estimate={isCurrentUser ? estimate : undefined}
                  hasVoted={hasVotedThisRound}
                  isCurrentUser={isCurrentUser}
                  isRevealed={isRevealed}
                  revealedValue={roundVote?.value ?? null}
                />
              );
            })}
          </Flex>
        </div>
      </div>

      {/* Card selection - only for voters while voting */}
      {!isSpectator && isVoting && (
        <PokerPoints
          cards={session.deck.cards}
          value={estimate}
          onValueChange={handleVote}
        />
      )}
    </>
  );
}
