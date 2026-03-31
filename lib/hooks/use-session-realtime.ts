'use client';

import type { RealtimeChannel } from '@supabase/supabase-js';
import { useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

import { createClient } from '@/lib/supabase/client';

/** Realtime broadcast so all tabs refresh when votes are revealed (works even if postgres_changes is restricted by RLS). */
export const SESSION_REVEALED_BROADCAST = 'session_revealed';

export function useSessionRealtime(sessionId: string) {
  const router = useRouter();
  const supabaseRef = useRef(createClient());
  const routerRef = useRef(router);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const channelReadyRef = useRef(false);

  useEffect(() => {
    routerRef.current = router;
  });

  useEffect(() => {
    const supabase = supabaseRef.current;

    const channel = supabase
      .channel(`session-${sessionId}`, {
        config: {
          broadcast: { self: true },
        },
      })
      .on('broadcast', { event: SESSION_REVEALED_BROADCAST }, () => {
        routerRef.current.refresh();
      })
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sessions',
          filter: `id=eq.${sessionId}`,
        },
        () => routerRef.current.refresh(),
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'participants',
          filter: `session_id=eq.${sessionId}`,
        },
        () => routerRef.current.refresh(),
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'votes',
          filter: `session_id=eq.${sessionId}`,
        },
        () => routerRef.current.refresh(),
      );

    channelRef.current = channel;
    channelReadyRef.current = false;

    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        channelReadyRef.current = true;
      } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        channelReadyRef.current = false;
      }
    });

    return () => {
      channelReadyRef.current = false;
      channelRef.current = null;
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  const broadcastSessionRevealed = useCallback(async () => {
    const ch = channelRef.current;
    if (!ch || !channelReadyRef.current) return;
    const status = await ch.send({
      type: 'broadcast',
      event: SESSION_REVEALED_BROADCAST,
      payload: { sessionId },
    });
    if (status !== 'ok') {
      console.error('Realtime broadcast (session revealed) failed:', status);
    }
  }, [sessionId]);

  return { broadcastSessionRevealed };
}
