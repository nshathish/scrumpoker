import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.email({
    message: 'Please enter a valid email address.',
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters long.',
  }),
});

export type LoginFormType = z.input<typeof LoginSchema>;

export const SignupSchema = z
  .object({
    displayname: z.string().min(3, {
      message: 'Display name must be at least 3 characters long.',
    }),
    email: z.email({
      message: 'Please enter a valid email address.',
    }),
    password: z.string().min(6, {
      message: 'Password must be at least 6 characters long.',
    }),
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val, {
      message: 'You must accept the terms and conditions.',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export type SignupFormType = z.input<typeof SignupSchema>;

export const GuestSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, {
      message: 'Username must be at least 2 characters.',
    })
    .max(30, {
      message: 'Username must be at most 30 characters.',
    }),
  isSpectator: z.boolean(),
});

export type GuestFormType = z.infer<typeof GuestSchema>;
