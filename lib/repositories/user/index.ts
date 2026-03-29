import prisma from '@/lib/prisma';

export async function createGuestUser(displayName: string) {
  const normalized = displayName.trim();

  const existingGuest = await prisma.user.findFirst({
    where: {
      authId: null,
      displayName: { equals: normalized, mode: 'insensitive' },
    },
  });

  if (existingGuest) {
    return existingGuest;
  }

  return prisma.user.create({
    data: { displayName: normalized },
  });
}
