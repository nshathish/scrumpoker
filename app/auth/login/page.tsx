import { Suspense } from 'react';

import LoginForm from '@/app/auth/_components/LoginForm';

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
