import prisma from '@/lib/prisma';

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
          votes: true,
        },
      },
    },
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
