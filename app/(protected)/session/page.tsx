import { redirect } from 'next/navigation';

import { getAuthenticatedUser } from '@/lib/auth';
import {
  addParticipant,
  createSession,
  getDefaultDeck,
} from '@/lib/repositories/session';

export default async function SessionPage({
  searchParams,
}: {
  searchParams: Promise<{ spectator?: string }>;
}) {
  const user = await getAuthenticatedUser();
  const { spectator } = await searchParams;

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
    role: spectator === 'true' ? 'SPECTATOR' : 'VOTER',
  });

  redirect(`/session/${session.inviteCode}`);
}
