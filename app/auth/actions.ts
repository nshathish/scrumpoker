'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';

import {
  type LoginFormType,
  type SignupFormType,
  type GuestFormType,
  LoginSchema,
  SignupSchema,
  GuestSchema,
} from '@/lib/schemas';

import { createGuestUser } from '@/lib/repositories/user';
import {
  addParticipant,
  createSession,
  getDefaultDeck,
} from '@/lib/repositories/session';
import { actionError, type ActionResult } from '@/lib/types';

export async function login(values: LoginFormType): Promise<ActionResult> {
  const validated = LoginSchema.safeParse(values);

  if (!validated.success) {
    console.error('Validation errors:', validated.error);
    return actionError('Invalid fields.');
  }

  const supabase = await createClient();
  const { email, password } = validated.data;
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return actionError(error.message);
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function signup(values: SignupFormType): Promise<ActionResult> {
  const validated = SignupSchema.safeParse(values);
  if (!validated.success) {
    return actionError('Invalid fields.');
  }

  const { email, password, displayname } = validated.data;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: displayname,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirmed`,
    },
  });

  if (error) {
    if (error.message.includes('already registered')) {
      return actionError('An account with this email already exists.');
    }

    return actionError('Failed to create account. Please try again.');
  }

  if (data?.user?.identities?.length === 0) {
    return actionError('An account with this email already exists.');
  }

  revalidatePath('/', 'layout');
  redirect(`/auth/check-email?email=${encodeURIComponent(email)}`);
}

export async function logout(): Promise<void> {
  const supabase = await createClient();

  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/');
}

export async function joinAsGuest(
  values: GuestFormType,
): Promise<ActionResult> {
  const validated = GuestSchema.safeParse(values);

  if (!validated.success) {
    return actionError('Invalid fields.');
  }

  const { displayName, isSpectator } = validated.data;

  const deck = await getDefaultDeck();
  if (!deck) {
    return actionError('No default deck found.');
  }

  const user = await createGuestUser(displayName);

  const session = await createSession({
    ownerId: user.id,
    deckId: deck.id,
  });

  await addParticipant({
    sessionId: session.id,
    userId: user.id,
    role: isSpectator ? 'SPECTATOR' : 'VOTER',
  });

  const cookieStore = await cookies();
  cookieStore.set('guest_user_id', user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  revalidatePath('/', 'layout');
  redirect(`/session/${session.inviteCode}`);
}
