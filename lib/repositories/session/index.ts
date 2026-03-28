import prisma from '@/lib/prisma';

import type { ParticipantRole } from '@/generated/prisma/enums';

export async function createSession({
  ownerId,
  deckId,
  name = 'New Session',
}: {
  ownerId: string;
  deckId: string;
  name?: string;
}) {
  return prisma.session.create({
    data: {
      name,
      ownerId,
      deckId,
    },
  });
}

export async function addParticipant({
  sessionId,
  userId,
  role = 'VOTER',
}: {
  sessionId: string;
  userId: string;
  role?: ParticipantRole;
}) {
  return prisma.participant.create({
    data: {
      sessionId,
      userId,
      role,
    },
  });
}

export async function getDefaultDeck() {
  return prisma.deck.findFirst({
    where: { name: 'Fibonacci' },
  });
}
