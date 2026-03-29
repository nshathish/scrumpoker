'use server';

import { redirect } from 'next/navigation';

import { getAuthenticatedUser } from '@/lib/auth';
import {
  addParticipant,
  createSession,
  findActiveSessionByOwner,
  getDefaultDeck,
} from '@/lib/repositories/session';

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
