import SessionView from '@/app/(protected)/session/_components/SessionView';

import { getOrJoinSession } from '@/app/(protected)/session/actions';

export default async function SessionIdPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ spectator?: string }>;
}) {
  const { id } = await params;
  const { spectator } = await searchParams;
  const { session, currentUserId } = await getOrJoinSession(
    id,
    spectator === 'true',
  );

  return <SessionView session={session} currentUserId={currentUserId} />;
}
