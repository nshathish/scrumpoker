'use server';

import { notFound, redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { unstable_noStore as noStore } from 'next/cache';

import { getAuthenticatedUser } from '@/lib/auth';
import {
  addParticipant,
  advanceRound,
  createDeck,
  createSession,
  findActiveSessionByOwner,
  findDeckByCards,
  findParticipantById,
  findSessionByInviteCode,
  findSessionSettingsByInviteCode,
  findSessionWithParticipantsAndVotes,
  getDefaultDeck,
  updateSessionDeck,
  updateParticipantRole,
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

export async function getOrJoinSession(
  inviteCode: string,
  spectator?: boolean,
) {
  noStore();

  const user = await getAuthenticatedUser();

  const session = await findSessionByInviteCode(inviteCode);
  if (!session) {
    notFound();
  }

  await addParticipant({
    sessionId: session.id,
    userId: user!.id,
    role: spectator ? 'SPECTATOR' : 'VOTER',
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
  const user = await getAuthenticatedUser();
  if (!user) {
    return actionError('You must be signed in.');
  }

  const session = await findSessionWithParticipantsAndVotes(input.sessionId);
  if (!session) {
    return actionError('Session not found.');
  }

  const participant = session.participants.find(
    (p) => p.id === input.participantId,
  );

  if (!participant || participant.userId !== user.id) {
    return actionError('Not part of this session.');
  }

  if (participant.role !== 'VOTER') {
    return actionError('Spectators cannot vote.');
  }

  if (session.status !== 'VOTING') {
    return actionError('Voting is closed for this round.');
  }

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

export async function switchParticipantRole(
  participantId: string,
  newRole: 'VOTER' | 'SPECTATOR',
): Promise<ActionResult> {
  const user = await getAuthenticatedUser();
  if (!user) return actionError('You must be signed in.');

  const participant = await findParticipantById(participantId);
  if (!participant || participant.userId !== user.id) {
    return actionError('Not authorized.');
  }

  await updateParticipantRole(participantId, newRole);
  return actionSuccess();
}

type RoomSettingsAccess = {
  isOwner: boolean;
  ownerName: string;
};

type RoomSettings = {
  deckCards: string[];
  deckName: string;
  teamName: string | null;
};

export async function getRoomSettingsAccess(
  inviteCode: string,
): Promise<ActionResult<RoomSettingsAccess>> {
  const user = await getAuthenticatedUser();
  if (!user) {
    return actionError('You must be signed in.');
  }

  const session = await findSessionSettingsByInviteCode(inviteCode);
  if (!session) {
    return actionError('Session not found.');
  }

  return actionSuccess({
    isOwner: session.ownerId === user.id,
    ownerName: session.owner.displayName,
  });
}

export async function getRoomSettings(
  inviteCode: string,
): Promise<ActionResult<RoomSettings>> {
  const user = await getAuthenticatedUser();
  if (!user) {
    return actionError('You must be signed in.');
  }

  const session = await findSessionSettingsByInviteCode(inviteCode);
  if (!session) {
    return actionError('Session not found.');
  }

  if (session.ownerId !== user.id) {
    return actionError('Only the session owner can change room settings.');
  }

  return actionSuccess({
    deckCards: session.deck.cards,
    deckName: session.deck.name,
    teamName: session.team?.name ?? null,
  });
}

function parseDeckCards(value: string) {
  const seen = new Set<string>();

  return value
    .split(',')
    .map((card) => card.trim())
    .filter((card) => {
      if (!card || seen.has(card)) return false;
      seen.add(card);
      return true;
    });
}

function withSelectedExtraVotes(
  cards: string[],
  extraVotes: Array<'coffee' | 'question'>,
) {
  const values = cards.filter((card) => card !== '☕' && card !== '?');
  const next = [...values];

  if (extraVotes.includes('coffee')) next.unshift('☕');
  if (extraVotes.includes('question')) next.push('?');

  return next;
}

export async function setSessionCustomDeck(
  inviteCode: string,
  deckInput: string,
  extraVotes: Array<'coffee' | 'question'> = [],
): Promise<ActionResult<{ deckCards: string[] }>> {
  const user = await getAuthenticatedUser();
  if (!user) {
    return actionError('You must be signed in.');
  }

  const cards = withSelectedExtraVotes(parseDeckCards(deckInput), extraVotes);
  if (cards.length === 0) {
    return actionError('Enter at least one card.');
  }

  const session = await findSessionByInviteCode(inviteCode);
  if (!session) {
    return actionError('Session not found.');
  }

  if (session.ownerId !== user.id) {
    return actionError('Only the session owner can change room settings.');
  }

  const existing = await findDeckByCards(cards);
  const deck =
    existing ??
    (await createDeck(
      `Custom: ${cards.join(', ')}`.slice(0, 72),
      cards,
    ).catch(() => createDeck(`Custom ${crypto.randomUUID()}`, cards)));

  await updateSessionDeck(session.id, deck.id);
  revalidatePath(`/session/${inviteCode}`);

  return actionSuccess({ deckCards: deck.cards });
}

export async function startNewRound(sessionId: string): Promise<ActionResult> {
  const user = await getAuthenticatedUser();
  if (!user) {
    return actionError('You must be signed in.');
  }

  await advanceRound(sessionId);
  return actionSuccess();
}
