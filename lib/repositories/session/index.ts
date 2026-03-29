import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

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
  try {
    return await prisma.participant.upsert({
      where: {
        sessionId_userId: { sessionId, userId },
      },
      update: {},
      create: {
        sessionId,
        userId,
        role,
      },
    });
  } catch (error) {
    console.log('addParticipant', error);
    // If race condition causes duplicate, just fetch the existing one
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return prisma.participant.findUniqueOrThrow({
        where: {
          sessionId_userId: { sessionId, userId },
        },
      });
    }
    throw error;
  }
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
