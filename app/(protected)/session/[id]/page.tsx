import { HomeSessionOverlays } from '@/app/(protected)/session/_components/HomeSessionOverlays';
import { getAuthenticatedUser } from '@/lib/auth';

export default async function SessionPage() {
  const user = await getAuthenticatedUser();
  const displayName = user?.displayName ?? 'Guest';

  return <HomeSessionOverlays displayName={displayName} />;
}
