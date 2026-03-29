import { Suspense } from 'react';

import JoinGuestForm from '@/app/auth/_components/JoinGuestForm';

export default function AuthPage() {
  return (
    <Suspense>
      <JoinGuestForm />
    </Suspense>
  );
}
