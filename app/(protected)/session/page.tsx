import { bootstrapNewSession } from '@/app/(protected)/session/actions';

export default async function SessionPage({
  searchParams,
}: {
  searchParams: Promise<{ spectator?: string }>;
}) {
  const { spectator } = await searchParams;
  await bootstrapNewSession({
    spectator: spectator === 'true',
  });
}
