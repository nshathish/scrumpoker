'use client';

import Link from 'next/link';
import { useForm, useController } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  Card,
  Checkbox,
  Flex,
  Heading,
  Separator,
  Text,
  TextField,
} from '@radix-ui/themes';

import ErrorAlert from '@/components/shared/ErrorAlert';

import { useServerAction } from '@/lib/hooks/use-server-action';
import { signup } from '@/app/auth/actions';

import { type SignupFormType, SignupSchema } from '@/lib/schemas';

export default function SignupPage() {
  const { state, execute, isPending, reset } = useServerAction(signup);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignupFormType>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      displayname: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  });

  const { field: termsField } = useController({
    name: 'terms',
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
          <Box style={{ textAlign: 'center' }}>
            <Heading size="7" mb="2">
              Create account
            </Heading>
            <Text size="3" color="gray">
              Join us to get started
            </Text>
          </Box>

          {state.status === 'error' && (
            <ErrorAlert message={state.error} onDismiss={reset} />
          )}

          <Card size="4">
            <form onSubmit={handleSubmit(execute)}>
              <Flex direction="column" gap="4">
                <Box>
                  <Text as="label" size="2" weight="medium" mb="1">
                    Display name
                  </Text>
                  <TextField.Root
                    placeholder="John Doe"
                    {...register('displayname')}
                  />
                  {errors.displayname && (
                    <Text size="1" color="red" mt="1">
                      {errors.displayname.message}
                    </Text>
                  )}
                </Box>

                <Box>
                  <Text as="label" size="2" weight="medium" mb="1">
                    Email address
                  </Text>
                  <TextField.Root
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
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
                    autoComplete="new-password"
                    {...register('password')}
                  />
                  <Text size="1" color="gray" mt="1">
                    Minimum 6 characters recommended
                  </Text>
                  {errors.password && (
                    <Text size="1" color="red" mt="1">
                      {errors.password.message}
                    </Text>
                  )}
                </Box>

                <Box>
                  <Text as="label" size="2" weight="medium" mb="1">
                    Confirm password
                  </Text>
                  <TextField.Root
                    type="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    {...register('confirmPassword')}
                  />
                  {errors.confirmPassword && (
                    <Text size="1" color="red" mt="1">
                      {errors.confirmPassword.message}
                    </Text>
                  )}
                </Box>

                <Flex gap="2" align="start">
                  <Checkbox
                    checked={termsField.value}
                    onCheckedChange={(checked) =>
                      termsField.onChange(checked === true)
                    }
                    mt="1"
                  />
                  <Text size="2" color="gray">
                    I agree to the{' '}
                    <Link href="/terms" style={{ color: 'var(--accent-9)' }}>
                      Terms&nbsp;of&nbsp;Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" style={{ color: 'var(--accent-9)' }}>
                      Privacy&nbsp;Policy
                    </Link>
                  </Text>
                </Flex>
                {errors.terms && (
                  <Text size="1" color="red">
                    {errors.terms.message}
                  </Text>
                )}

                <Button type="submit" disabled={isPending} mt="2">
                  {isPending ? 'Creating account...' : 'Create account'}
                </Button>

                <Separator size="4" />

                <Text size="2" color="gray" align="center">
                  Already have an account?
                </Text>

                <Button variant="outline" asChild>
                  <Link href="/auth/login">Sign in</Link>
                </Button>

                <Link
                  href="/auth"
                  className="link-muted"
                  style={{ textAlign: 'center' }}
                >
                  Join as guest instead
                </Link>
              </Flex>
            </form>
          </Card>

          <Text size="1" color="gray" align="center">
            By creating an account, you agree to our{' '}
            <Link href="/terms" style={{ color: 'var(--accent-9)' }}>
              Terms of Service
            </Link>
          </Text>
        </Flex>
      </Box>
    </Flex>
  );
}
