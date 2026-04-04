import Link from 'next/link';

import { Button, Heading, Text } from '@radix-ui/themes';

const features = [
  {
    title: 'Bias-free estimates',
    body: 'Reveal votes together so anchors and seniority do not skew the conversation before everyone commits.',
  },
  {
    title: 'Fibonacci that fits',
    body: 'Standard planning-poker values including a playful option—so teams can signal uncertainty without debate.',
  },
  {
    title: 'Built for remote teams',
    body: 'Clear own-profile and vote surfaces designed for screenshares and async prep, not just the meeting room.',
  },
] as const;

const steps = [
  {
    step: '01',
    title: 'Pick a story',
    body: 'Agree on the backlog item and acceptance criteria before estimates.',
  },
  {
    step: '02',
    title: 'Vote privately',
    body: 'Everyone selects a card; discussion stays calm until votes are shown.',
  },
  {
    step: '03',
    title: 'Align and commit',
    body: 'Discuss divergence, re-vote if needed, then record a single agreed estimate.',
  },
] as const;

export function Landing() {
  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-[var(--background)]/85 backdrop-blur-md dark:border-slate-800/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link
            href="/"
            className="font-semibold tracking-tight text-slate-900 dark:text-slate-50"
          >
            Scrum Poker
          </Link>
          <nav
            className="hidden items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-400 sm:flex"
            aria-label="Primary"
          >
            <a
              href="#features"
              className="transition hover:text-slate-900 dark:hover:text-slate-200"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="transition hover:text-slate-900 dark:hover:text-slate-200"
            >
              How it works
            </a>
          </nav>
          <div className="flex shrink-0 items-center gap-2">
            <Button asChild size="2" variant="solid" color="ruby">
              <Link href="/session">Start session</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="landing-dot-bg relative overflow-hidden border-b border-slate-200/60 dark:border-slate-800/60">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--background)]" />
          <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:flex lg:items-center lg:gap-16 lg:py-28">
            <div className="max-w-xl lg:flex-1">
              <Text
                size="2"
                weight="medium"
                color="ruby"
                highContrast
                className="mb-3"
              >
                Planning poker, refined
              </Text>
              <h1 className="font-[family-name:var(--font-geist-sans)] text-4xl font-semibold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-[3.25rem] dark:text-white">
                Estimate stories with clarity—not peer pressure.
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                Run fast, fair backlog sessions. Private votes, shared reveals,
                and a focused UI so the team stays on the work—not the politics.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                {/*<Button
                  asChild
                  size="3"
                  variant="solid"
                  color="ruby"
                  highContrast
                >
                  <Link href="/play">Open planning table</Link>
                </Button>*/}
                <Button asChild size="3" variant="outline" color="gray">
                  <a href="#features">See what&apos;s included</a>
                </Button>
              </div>
              <p className="mt-8 text-sm text-slate-500 dark:text-slate-500">
                No sign-up flow in this preview—jump straight into a session.
              </p>
            </div>

            <div className="mt-16 flex flex-1 justify-center lg:mt-0 lg:justify-end">
              <div
                className="relative w-full max-w-md rounded-2xl border border-slate-200/80 bg-white/60 p-6 shadow-lg shadow-slate-900/5 backdrop-blur-sm dark:border-slate-700/80 dark:bg-slate-900/50 dark:shadow-black/20"
                aria-hidden
              >
                <p className="mb-4 text-center text-xs font-medium uppercase tracking-wider text-slate-500">
                  Sample deck
                </p>
                <div className="flex items-end justify-center gap-2">
                  {['🍌', '1', '3', '5', '8', '13', '?'].map((label, i) => (
                    <div
                      key={`${label}-${i}`}
                      className={`flex aspect-[3/4] w-9 items-center justify-center rounded-lg bg-slate-900 text-sm font-medium text-white shadow-md sm:w-10 ${
                        label === '5'
                          ? '-translate-y-1.5 border-2 border-blue-400'
                          : ''
                      }`}
                    >
                      {label}
                    </div>
                  ))}
                </div>
                <div className="mt-6 rounded-xl border border-dashed border-slate-300/80 bg-slate-50/80 p-4 text-center dark:border-slate-600 dark:bg-slate-800/50">
                  <p className="font-mono text-sm text-slate-600 dark:text-slate-400">
                    Consensus builds trust.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="scroll-mt-20 border-b border-slate-200/60 py-20 dark:border-slate-800/60 sm:py-24"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Heading
              as="h2"
              size="7"
              className="max-w-2xl font-semibold tracking-tight"
            >
              Everything you need for a tight estimation meeting
            </Heading>
            <p className="mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
              Opinionated defaults that match how strong product teams actually
              run planning poker.
            </p>
            <ul className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
              {features.map((f) => (
                <li key={f.title}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ruby-3 text-ruby-11 ring-1 ring-ruby-6/40">
                    <span className="text-lg leading-none" aria-hidden>
                      ✓
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-slate-900 dark:text-white">
                    {f.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-slate-600 dark:text-slate-400">
                    {f.body}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-20 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Heading as="h2" size="7" className="font-semibold tracking-tight">
              How it works
            </Heading>
            <p className="mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
              Three beats: prepare, vote, align. Repeat until the backlog is
              understood and sized.
            </p>
            <ol className="mt-14 grid gap-12 lg:grid-cols-3">
              {steps.map((s) => (
                <li key={s.step} className="relative">
                  <span className="font-mono text-sm font-medium text-ruby-9 dark:text-ruby-8">
                    {s.step}
                  </span>
                  <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
                    {s.title}
                  </h3>
                  <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-400">
                    {s.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-y border-slate-200/80 bg-slate-900 py-16 text-white dark:border-slate-800 dark:bg-slate-950">
          <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
            <Heading as="h2" size="6" className="text-balance text-white">
              Ready for your next refinement?
            </Heading>
            <p className="mx-auto mt-4 max-w-xl text-slate-300">
              Open the table, share your screen, and keep the focus on
              delivery—not negotiation tactics.
            </p>
            <Button
              asChild
              size="3"
              variant="solid"
              color="ruby"
              className="mt-8"
              highContrast
            >
              <Link href="/session">Start session</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200/60 py-10 dark:border-slate-800/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-slate-500 sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} Scrum Poker</p>
          <p className="text-center sm:text-right">
            Planning poker for agile teams
          </p>
        </div>
      </footer>
    </div>
  );
}
