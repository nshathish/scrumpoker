import prisma from '@/lib/prisma';

import type { Prisma } from '@/generated/prisma/client';

const sessionWithParticipantsInclude = {
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
      votes: true,
    },
  },
} satisfies Prisma.SessionInclude;

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

export async function findSessionByInviteCode(inviteCode: string) {
  const session = await prisma.session.findUnique({
    where: { inviteCode },
    include: sessionWithParticipantsInclude,
  });

  if (!session) return null;

  if (session.expiresAt > new Date()) {
    return session;
  }

  const renewedExpiry = new Date();
  renewedExpiry.setHours(renewedExpiry.getHours() + 24);

  await prisma.$transaction(async (tx) => {
    await tx.participant.deleteMany({
      where: { sessionId: session.id },
    });

    await tx.session.update({
      where: { id: session.id },
      data: {
        status: 'VOTING',
        currentRound: 1,
        expiresAt: renewedExpiry,
      },
    });
  });

  return prisma.session.findUnique({
    where: { id: session.id },
    include: sessionWithParticipantsInclude,
  });
}

export async function findSessionWithParticipantsAndVotes(sessionId: string) {
  return prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      participants: {
        include: { votes: true },
      },
    },
  });
}

export async function getDefaultDeck() {
  return prisma.deck.findFirst({
    where: { name: 'Fibonacci' },
  });
}
