import prisma from '@/lib/prisma';
import { generateRandomSessionName } from '@/lib/utils/random-words';

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
  return prisma.participant.upsert({
    where: {
      sessionId_userId: { sessionId, userId },
    },
    update: {}, // already exists, do nothing
    create: {
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

export async function findSessionByInviteCode(inviteCode: string) {
  return prisma.session.findUnique({
    where: { inviteCode },
    include: {
      deck: true,
      participants: {
        include: {
          user: {
            select: {
              id: true,
              displayName: true,
              avatarSeed: true,
            },
          },
        },
      },
    },
  });
}

export async function deleteParticipantsByUserId(userId: string) {
  return prisma.participant.deleteMany({
    where: { userId },
  });
}
