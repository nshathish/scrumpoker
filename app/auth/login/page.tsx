'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Separator,
  Text,
  TextField,
} from '@radix-ui/themes';
import ErrorAlert from '@/components/shared/ErrorAlert';

import { login } from '@/app/auth/actions';
import { useServerAction } from '@/lib/hooks/use-server-action';
import { useAuthRedirect } from '@/lib/hooks/use-auth-redirect';

import { type LoginFormType, LoginSchema } from '@/lib/schemas';

export default function LoginPage() {
  const { state, execute, isPending, reset } = useServerAction(login);
  const { returnTo, redirect } = useAuthRedirect();

  useEffect(() => {
    if (state.status === 'success') {
      redirect();
    }
  }, [state.status, redirect]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
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
          {/* Header */}
          <Box asChild style={{ textAlign: 'center' }}>
            <header>
              <Heading size="7" mb="2">
                Welcome back
              </Heading>
              <Text size="3" color="gray">
                Sign in to your account to continue
              </Text>
            </header>
          </Box>

          {state.status === 'error' && (
            <ErrorAlert message={state.error} onDismiss={reset} />
          )}

          {/* Form Card */}
          <Card size="4">
            <form onSubmit={handleSubmit(execute)}>
              <Flex direction="column" gap="4">
                <Box>
                  <Text as="label" size="2" weight="medium" mb="1">
                    Email address
                  </Text>
                  <TextField.Root
                    type="email"
                    placeholder="you@example.com"
                    {...register('email')}
                  />
                  {errors.email && (
                    <Text size="1" color="red" mt="1">
                      {errors.email.message}
                    </Text>
                  )}
                </Box>

                <Box>
                  <Text as="label" size="2" weight="medium" mb="1">
                    Password
                  </Text>
                  <TextField.Root
                    type="password"
                    placeholder="••••••••"
                    {...register('password')}
                  />
                  {errors.password && (
                    <Text size="1" color="red" mt="1">
                      {errors.password.message}
                    </Text>
                  )}
                </Box>

                <Button type="submit" disabled={isPending} mt="2">
                  {isPending ? 'Signing in...' : 'Sign in'}
                </Button>

                <Separator size="4" />

                <Text size="2" color="gray" align="center">
                  Don&apos;t have an account?
                </Text>

                <Button variant="outline" asChild>
                  <Link
                    href={`/auth/signup${returnTo ? `?returnTo=${returnTo}` : ''}`}
                  >
                    Create account
                  </Link>
                </Button>

                <Link
                  href={`/auth${returnTo ? `?returnTo=${returnTo}` : ''}`}
                  className="link-muted"
                  style={{ textAlign: 'center' }}
                >
                  Join as guest instead
                </Link>
              </Flex>
            </form>
          </Card>

          {/* Footer */}
          <Text size="1" color="gray" align="center">
            By signing in, you agree to our{' '}
            <Link href="/terms" style={{ color: 'var(--accent-9)' }}>
              Terms of Service
            </Link>
          </Text>
        </Flex>
      </Box>
    </Flex>
  );
}
