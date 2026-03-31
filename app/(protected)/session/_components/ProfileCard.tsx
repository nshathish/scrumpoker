'use client';

import Image from 'next/image';
import { Check } from 'lucide-react';

interface ProfileCardProps {
  seed: string;
  name: string;
  estimate?: string;
  hasVoted?: boolean;
  isCurrentUser?: boolean;
  isRevealed?: boolean;
  /** Vote value for the active round when `isRevealed` (from server). */
  revealedValue?: string | null;
  avatarSize?: number;
  className?: string;
}

export default function ProfileCard({
  seed,
  name,
  estimate = '',
  hasVoted = false,
  isCurrentUser = false,
  isRevealed = false,
  revealedValue = null,
  avatarSize = 72,
  className = '',
}: ProfileCardProps) {
  const picked = isCurrentUser && estimate.length > 0;
  const showVotedMask = !isCurrentUser && hasVoted && !isRevealed;
  const hasRevealedValue =
    isRevealed && revealedValue != null && revealedValue.length > 0;

  if (isRevealed) {
    return (
      <div
        className={[
          'box-border flex w-28 flex-col items-center rounded-lg px-3 pb-4 pt-3 sm:w-32',
          'aspect-[3/4] shadow-sm',
          hasRevealedValue
            ? 'border-2 border-blue-400 bg-[#d8f4dc]'
            : 'border-2 border-slate-300 bg-slate-50',
          className,
        ].join(' ')}
      >
        <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-center pb-1">
          {hasRevealedValue ? (
            <span
              className={
                revealedValue === 'banana'
                  ? 'text-5xl leading-none'
                  : 'text-5xl font-semibold tabular-nums leading-none text-slate-700 sm:text-6xl'
              }
            >
              {revealedValue}
            </span>
          ) : (
            <span className="text-3xl font-light text-slate-400 sm:text-4xl">
              —
            </span>
          )}
        </div>
        <p
          className="mt-auto w-full shrink-0 truncate text-center text-sm font-normal leading-tight text-slate-700 sm:text-base"
          style={{
            fontFamily: 'var(--font-geist-mono), ui-monospace, monospace',
          }}
          title={name}
        >
          {name}
        </p>
      </div>
    );
  }

  return (
    <div
      className={[
        'box-border flex w-28 flex-col items-center rounded-lg px-3 pb-4 pt-3 sm:w-32',
        'aspect-[3/4] shadow-sm',
        picked || showVotedMask
          ? 'border-2 border-blue-400 bg-[#d8f4dc]'
          : 'border-4 border-blue-400 bg-gray-100',
        className,
      ].join(' ')}
    >
      {picked ? (
        <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-center pb-1">
          <span
            className={
              estimate === 'banana'
                ? 'text-5xl leading-none'
                : 'text-5xl font-semibold tabular-nums leading-none text-slate-700 sm:text-6xl'
            }
          >
            {estimate}
          </span>
        </div>
      ) : showVotedMask ? (
        <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-center pb-1">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <Check className="h-8 w-8 text-emerald-500" strokeWidth={3} />
          </div>
        </div>
      ) : (
        <div
          className="flex shrink-0 items-center justify-center rounded-full bg-sky-200 p-1.5 shadow-inner"
          style={{ width: avatarSize + 16, height: avatarSize + 16 }}
        >
          <div className="overflow-hidden rounded-full">
            <Image
              src={`/api/avatar?seed=${encodeURIComponent(seed)}&v=2`}
              alt={`${name} avatar`}
              width={avatarSize}
              height={avatarSize}
              unoptimized
              loading="eager"
              className="rounded-full"
            />
          </div>
        </div>
      )}
      <p
        className="mt-auto w-full shrink-0 truncate text-center text-sm font-normal leading-tight text-slate-700 sm:text-base"
        style={{
          fontFamily: 'var(--font-geist-mono), ui-monospace, monospace',
        }}
        title={name}
      >
        {name}
      </p>
    </div>
  );
}
