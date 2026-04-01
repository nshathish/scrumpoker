'use server';

import { notFound, redirect } from 'next/navigation';
import { unstable_noStore as noStore } from 'next/cache';

import { getAuthenticatedUser } from '@/lib/auth';
import {
  addParticipant,
  advanceRound,
  createSession,
  findActiveSessionByOwner,
  findSessionByInviteCode,
  findSessionWithParticipantsAndVotes,
  getDefaultDeck,
  updateSessionStatusToRevealed,
} from '@/lib/repositories/session';
import { castVote } from '@/lib/repositories/vote';

import { actionError, actionSuccess, type ActionResult } from '@/lib/types';

export async function bootstrapNewSession({
  spectator,
}: {
  spectator?: boolean;
}): Promise<never> {
  const user = await getAuthenticatedUser();

  // TODO: remove - artificial delay to test loading state
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const existing = await findActiveSessionByOwner(user!.id);
  if (existing) {
    redirect(`/session/${existing.inviteCode}`);
  }

  const deck = await getDefaultDeck();
  if (!deck) {
    throw new Error('No default deck found.');
  }

  const session = await createSession({
    ownerId: user!.id,
    deckId: deck.id,
  });

  await addParticipant({
    sessionId: session.id,
    userId: user!.id,
    role: !!spectator ? 'SPECTATOR' : 'VOTER',
  });

  redirect(`/session/${session.inviteCode}`);
}

export async function getOrJoinSession(inviteCode: string) {
  noStore();

  const user = await getAuthenticatedUser();

  const session = await findSessionByInviteCode(inviteCode);
  if (!session) {
    notFound();
  }

  await addParticipant({
    sessionId: session.id,
    userId: user!.id,
    role: 'VOTER',
  });

  // Re-fetch to include the new participant in the response
  const updatedSession = await findSessionByInviteCode(inviteCode);
  if (!updatedSession) {
    notFound();
  }

  return { session: updatedSession, currentUserId: user!.id };
}

export async function submitVote(input: {
  sessionId: string;
  participantId: string;
  round: number;
  value: string;
}): Promise<ActionResult> {
  await castVote(input);
  return actionSuccess();
}

export async function revealSessionVotes(
  sessionId: string,
): Promise<ActionResult> {
  const user = await getAuthenticatedUser();
  if (!user) {
    return actionError('You must be signed in.');
  }

  const session = await findSessionWithParticipantsAndVotes(sessionId);

  if (!session) {
    return actionError('Session not found.');
  }

  const isParticipant = session.participants.some((p) => p.userId === user.id);
  if (!isParticipant) {
    return actionError('Not part of this session.');
  }

  if (session.status !== 'VOTING') {
    return actionError('Votes are already revealed.');
  }

  const round = session.currentRound;
  const anotherVoterHasSubmitted = session.participants.some(
    (p) =>
      p.userId !== user.id &&
      p.role === 'VOTER' &&
      p.votes.some((v) => v.round === round),
  );

  if (!anotherVoterHasSubmitted) {
    return actionError('Wait until at least one other player has voted.');
  }

  await updateSessionStatusToRevealed(sessionId);

  return actionSuccess();
}

export async function startNewRound(sessionId: string): Promise<ActionResult> {
  const user = await getAuthenticatedUser();
  if (!user) {
    return actionError('You must be signed in.');
  }

  await advanceRound(sessionId);
  return actionSuccess();
}
