'use client';

import { startTransition, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Button, Flex } from '@radix-ui/themes';

import ProfileCard from '@/app/(protected)/session/_components/ProfileCard';
import PokerPoints from '@/app/(protected)/session/_components/PokerPoints';
import LoadingSpinner from '@/app/(protected)/session/_components/LoadingSpinner';
import { useCurrentAvatar } from '@/components/avatar/CurrentAvatarContext';

import {
  revealSessionVotes,
  startNewRound,
  submitVote,
} from '@/app/(protected)/session/actions';
import { useServerAction } from '@/lib/hooks/use-server-action';
import { useSessionRealtime } from '@/lib/hooks/use-session-realtime';
import { nearestFibonacci } from '@/lib/utils/fibonacci';

import type { SessionGetPayload } from '@/generated/prisma/models/Session';

const Fireworks = dynamic(
  () => import('@/app/(protected)/session/_components/Fireworks'),
  { ssr: false },
);

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

  const numericVotes = session.participants
    .filter((p) => p.role === 'VOTER')
    .map((p) => p.votes.find((v) => v.round === session.currentRound))
    .filter((v): v is NonNullable<typeof v> => v !== undefined)
    .map((v) => Number(v.value))
    .filter((n) => !isNaN(n));

  const voterParticipants = session.participants.filter(
    (p) => p.role === 'VOTER',
  );

  const roundVoteValues = voterParticipants
    .map((p) => p.votes.find((v) => v.round === session.currentRound)?.value)
    .filter((value): value is string => Boolean(value));

  const average =
    numericVotes.length > 0
      ? numericVotes.reduce((sum, v) => sum + v, 0) / numericVotes.length
      : 0;

  const consensus = nearestFibonacci(average);

  const allVotersSubmitted =
    voterParticipants.length > 0 &&
    roundVoteValues.length === voterParticipants.length;

  const allVotesMatch =
    allVotersSubmitted && new Set(roundVoteValues).size === 1;

  const shouldShowFireworks = isRevealed && allVotesMatch && !isResetting;

  useEffect(() => {
    if (session.status === 'VOTING') {
      startTransition(() => {
        setEstimate('');
      });
    }
  }, [session.status]);

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
        {shouldShowFireworks && <Fireworks />}

        <div className="flex shrink-0 justify-center pt-4 pb-3">
          <Button
            size="4"
            variant="solid"
            disabled={!canReveal || isRevealing}
            onClick={handleReveal}
            highContrast
          >
            {isRevealed ? 'Revealed' : 'Reveal votes'}
          </Button>
        </div>

        {isRevealing && <LoadingSpinner />}

        {isRevealed && numericVotes.length > 0 && (
          <div className="flex shrink-0 flex-col items-center gap-1 pb-3">
            {consensus.includes(' or ') ? (
              <div className="flex items-center gap-2">
                <span className="text-7xl leading-none font-bold text-slate-700 md:text-8xl">
                  {consensus.split(' or ')[0]}
                </span>
                <span className="text-5xl md:text-6xl">🤔</span>
                <span className="text-7xl leading-none font-bold text-slate-700 md:text-8xl">
                  {consensus.split(' or ')[1]}
                </span>
              </div>
            ) : (
              <span className="text-7xl leading-none font-bold text-slate-700 md:text-8xl">
                {consensus}
              </span>
            )}
          </div>
        )}

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
              size="4"
              variant="solid"
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
