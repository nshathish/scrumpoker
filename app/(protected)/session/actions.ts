'use server';

import { notFound, redirect } from 'next/navigation';

import { getAuthenticatedUser } from '@/lib/auth';
import {
  addParticipant,
  createSession,
  findActiveSessionByOwner,
  findSessionByInviteCode,
  getDefaultDeck,
  isParticipant,
} from '@/lib/repositories/session';

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
  const user = await getAuthenticatedUser();

  const session = await findSessionByInviteCode(inviteCode);
  if (!session) {
    notFound();
  }

  const alreadyJoined = await isParticipant(session.id, user!.id);
  if (!alreadyJoined) {
    await addParticipant({
      sessionId: session.id,
      userId: user!.id,
      role: 'VOTER',
    });
  }

  return { session, currentUserId: user!.id };
}
