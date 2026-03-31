'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Flex } from '@radix-ui/themes';

import ProfileCard from '@/app/(protected)/session/_components/ProfileCard';
import PokerPoints from '@/app/(protected)/session/_components/PokerPoints';
import { useCurrentAvatar } from '@/components/avatar/CurrentAvatarContext';

import {
  revealSessionVotes,
  startNewRound,
  submitVote,
} from '@/app/(protected)/session/actions';
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
  const [estimate, setEstimate] = useState('');

  const { execute } = useServerAction(submitVote);
  const { execute: runReveal, isPending: isRevealing } =
    useServerAction(revealSessionVotes);
  const { execute: runNewRound, isPending: isResetting } =
    useServerAction(startNewRound);

  useSessionRealtime(session.id);

  const currentUser = session.participants.find(
    (p) => p.userId === currentUserId,
  );

  const anotherVoterHasSubmitted = session.participants.some(
    (p) =>
      p.userId !== currentUserId &&
      p.role === 'VOTER' &&
      p.votes.some((v) => v.round === session.currentRound),
  );

  const isSpectator = currentUser?.role === 'SPECTATOR';
  const isRevealed = session.status === 'REVEALED';
  const isVoting = session.status === 'VOTING';
  const canReveal = isVoting && anotherVoterHasSubmitted;

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

  const handleReveal = () => {
    runReveal(session.id).then((result) => {
      if (result.status === 'success') {
        router.refresh();
      }
    });
  };

  const handleNewRound = () => {
    setEstimate('');
    runNewRound(session.id).then((result) => {
      if (result.status === 'success') {
        router.refresh();
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
              const voteThisRound = participant.votes.find(
                (v) => v.round === session.currentRound,
              );
              const isCurrentUser = participant.userId === currentUserId;
              const participantName =
                participant.role === 'SPECTATOR'
                  ? `${participant.user.displayName} (spectator)`
                  : participant.user.displayName;

              const estimateCalculated = isCurrentUser
                ? estimate
                : isRevealed
                  ? voteThisRound?.value
                  : undefined;

              return (
                <ProfileCard
                  key={participant.id}
                  seed={isCurrentUser ? seed : participant.user.avatarSeed}
                  name={participantName}
                  estimate={estimateCalculated}
                  hasVoted={Boolean(voteThisRound)}
                  isCurrentUser={isCurrentUser}
                />
              );
            })}
          </Flex>
        </div>

        {isRevealed && (
          <div className="flex shrink-0 justify-center pt-4 pb-3">
            <Button
              size="3"
              variant="outline"
              onClick={handleNewRound}
              disabled={isResetting}
              highContrast
            >
              {isResetting ? 'Resetting...' : 'New round'}
            </Button>
          </div>
        )}
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
