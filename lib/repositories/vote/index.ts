import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import prisma from '@/lib/prisma';

export async function castVote({
  sessionId,
  participantId,
  round,
  value,
}: {
  sessionId: string;
  participantId: string;
  round: number;
  value: string;
}) {
  if (!value.trim()) {
    await prisma.vote.deleteMany({
      where: { sessionId, participantId, round },
    });
    return null;
  }

  try {
    return await prisma.vote.upsert({
      where: {
        sessionId_participantId_round: { sessionId, participantId, round },
      },
      update: { value },
      create: { sessionId, participantId, round, value },
    });
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return prisma.vote.update({
        where: {
          sessionId_participantId_round: { sessionId, participantId, round },
        },
        data: { value },
      });
    }
    throw error;
  }
}
