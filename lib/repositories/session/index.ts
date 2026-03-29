import { generateSlug } from 'random-word-slugs';

import prisma from '@/lib/prisma';

import type { ParticipantRole } from '@/generated/prisma/enums';

export async function createSession({
  ownerId,
  deckId,
  name = 'New Session',
  ttlHours = 24,
}: {
  ownerId: string;
  deckId: string;
  name?: string;
  ttlHours?: number;
}) {
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + ttlHours);

  return prisma.session.create({
    data: {
      name: name ?? generateRandomSessionName(),
      ownerId,
      deckId,
      expiresAt,
    },
  });
}

export async function findActiveSessionByOwner(ownerId: string) {
  return prisma.session.findFirst({
    where: {
      ownerId,
      status: { in: ['LOBBY', 'VOTING'] },
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: 'desc' },
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

function generateRandomSessionName() {
  return generateSlug(2, {
    format: 'kebab',
    partsOfSpeech: ['adjective', 'noun'],
    categories: {
      adjective: ['color', 'personality'],
      noun: ['animals'],
    },
  });
}
