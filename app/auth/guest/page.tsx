import { Suspense } from 'react';

import JoinGuestForm from '@/app/auth/_components/JoinGuestForm';

export default function GuestPage() {
  return (
    <Suspense>
      <JoinGuestForm />
    </Suspense>
  );
}
