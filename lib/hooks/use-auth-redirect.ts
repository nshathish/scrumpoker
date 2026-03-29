'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export function useAuthRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');

  const redirect = useCallback(
    (params?: Record<string, string>) => {
      const url = new URL(returnTo ?? '/session', window.location.origin);
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          url.searchParams.set(key, value);
        });
      }
      router.push(url.pathname + url.search);
    },
    [returnTo, router],
  );

  return { returnTo, redirect };
}
