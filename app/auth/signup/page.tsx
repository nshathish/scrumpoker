import { Suspense } from 'react';

import SignupForm from '@/app/auth/_components/SignupForm';

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}
