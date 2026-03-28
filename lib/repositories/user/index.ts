import prisma from '@/lib/prisma';

export async function createGuestUser(displayName: string) {
  return prisma.user.create({
    data: { displayName },
  });
}
