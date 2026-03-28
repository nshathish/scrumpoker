'use client';

import { useController, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Info } from 'lucide-react';
import {
  Box,
  Button,
  Card,
  Checkbox,
  Flex,
  Heading,
  Text,
  TextField,
  Tooltip,
} from '@radix-ui/themes';

import ErrorAlert from '@/components/shared/ErrorAlert';

import { joinAsGuest } from '@/app/auth/actions';
import { useServerAction } from '@/lib/hooks/use-server-action';

import { type GuestFormType, GuestSchema } from '@/lib/schemas';
import Link from 'next/link';

export default function AuthPage() {
  const { state, execute, isPending, reset } = useServerAction(joinAsGuest);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<GuestFormType>({
    resolver: zodResolver(GuestSchema),
    defaultValues: {
      displayName: '',
      isSpectator: false,
    },
  });

  const { field: spectatorField } = useController({
    name: 'isSpectator',
    control,
  });

  return (
    <Flex
      align="center"
      justify="center"
      px="4"
      py="9"
      style={{ minHeight: '100%' }}
    >
      <Box width="100%" style={{ maxWidth: 420 }}>
        <Flex direction="column" gap="5">
          <Heading size="7" align="center">
            Welcome!
          </Heading>

          {state.status === 'error' && (
            <ErrorAlert message={state.error} onDismiss={reset} />
          )}

          <Card size="4">
            <Flex direction="column" gap="4">
              {/* Guest Form */}
              <form onSubmit={handleSubmit(execute)}>
                <Flex direction="column" gap="4">
                  <Box>
                    <TextField.Root
                      placeholder="Enter Username"
                      size="3"
                      {...register('displayName')}
                    />
                    {errors.displayName && (
                      <Text size="1" color="red" mt="1">
                        {errors.displayName.message}
                      </Text>
                    )}
                  </Box>

                  <Flex align="center" gap="2">
                    <Checkbox
                      checked={spectatorField.value}
                      onCheckedChange={(checked) =>
                        spectatorField.onChange(checked === true)
                      }
                    />
                    <Text size="2">Spectator</Text>
                    <Tooltip content="Spectators can watch but not vote">
                      <Info className="h-3.5 w-3.5 text-gray-400 cursor-help" />
                    </Tooltip>
                  </Flex>

                  <Button type="submit" size="3" disabled={isPending}>
                    {isPending ? 'Joining...' : 'Join as guest'}
                  </Button>
                </Flex>
              </form>

              <Flex justify="between">
                <Link href="/auth/signup" className="link-accent">
                  Create account
                </Link>
                <Link href="/auth/login" className="link-muted">
                  Log in
                </Link>
              </Flex>
            </Flex>
          </Card>
        </Flex>
      </Box>
    </Flex>
  );
}
