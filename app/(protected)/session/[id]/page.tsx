import SessionView from '@/app/(protected)/session/_components/SessionView';

import { getOrJoinSession } from '@/app/(protected)/session/actions';

export default async function SessionIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { session, currentUserId } = await getOrJoinSession(id);

  return <SessionView session={session} currentUserId={currentUserId} />;
}
