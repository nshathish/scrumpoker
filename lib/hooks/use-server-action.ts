import { useCallback, useState, useTransition } from 'react';

import {
  actionError,
  type ActionResult,
  type UiActionResult,
} from '@/lib/types';

export function useServerAction<TInput = void, TData = void>(
  action: (input: TInput) => Promise<ActionResult<TData>>,
) {
  const [state, setState] = useState<UiActionResult<TData>>({
    status: 'idle',
  });
  const [isPending, startTransition] = useTransition();

  const execute = useCallback(
    (...args: TInput extends void ? [] : [TInput]) => {
      setState({ status: 'idle' });

      return new Promise<ActionResult<TData>>((resolve) => {
        startTransition(async () => {
          try {
            const result = await action(args[0] as TInput);
            setState(result);
            resolve(result);
          } catch (e) {
            if (
              e instanceof Error &&
              (e.message.includes('NEXT_REDIRECT') ||
                e.message.includes('NEXT_NOT_FOUND'))
            ) {
              // Let Next.js handle redirect/notFound navigation
              throw e;
            }

            const message = e instanceof Error ? e.message : 'Unexpected error';
            const errResult = actionError<TData>(message);
            setState(errResult);
            resolve(errResult);
          }
        });
      });
    },
    [action],
  );

  const reset = useCallback(() => {
    setState({ status: 'idle' });
  }, []);

  return { state, isPending, execute, reset };
}
