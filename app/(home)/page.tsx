import { Heading, Container } from '@radix-ui/themes';

import { HomeSessionOverlays } from '@/app/(home)/_components/HomeSessionOverlays';

export default function HomePage() {
  return (
    <>
      <Container size="3" className="relative z-30 px-4 py-10 pb-32">
        <Heading size="6" className="mb-4 text-left">
          Dashboard
        </Heading>

        <p className="max-w-md text-pretty text-left text-slate-600 dark:text-slate-400">
          Your content goes here.
        </p>
      </Container>

      <HomeSessionOverlays displayName="nshathish" />
    </>
  );
}
