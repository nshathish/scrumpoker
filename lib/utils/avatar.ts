export function getAvatarUrl(seed: string): string {
  return `/api/avatar?seed=${encodeURIComponent(seed)}`;
}
