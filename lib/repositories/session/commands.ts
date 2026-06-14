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

export async function deleteParticipantsByUserId(userId: string) {
  return prisma.participant.deleteMany({
    where: { userId },
  });
}

export async function updateParticipantRole(
  participantId: string,
  role: ParticipantRole,
) {
  return prisma.participant.update({
    where: { id: participantId },
    data: { role },
  });
}

export async function advanceRound(sessionId: string) {
  return prisma.session.update({
    where: { id: sessionId },
    data: {
      currentRound: { increment: 1 },
      status: 'VOTING',
    },
  });
}

export async function updateSessionStatusToRevealed(sessionId: string) {
  return prisma.session.update({
    where: { id: sessionId },
    data: { status: 'REVEALED' },
  });
}
