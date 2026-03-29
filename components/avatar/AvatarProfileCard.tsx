'use client';

import Image from 'next/image';

import { pokerLabelForValue } from '@/app/(home)/_constants/pokerDeck';

interface AvatarProfileCardProps {
  seed: string;
  name: string;
  estimate?: string;
  avatarSize?: number;
  className?: string;
}

export default function AvatarProfileCard({
  seed,
  name,
  estimate = '',
  avatarSize = 72,
  className = '',
}: AvatarProfileCardProps) {
  const picked = estimate.length > 0;
  const displayEstimate = picked ? pokerLabelForValue(estimate) : '';

  return (
    <div
      className={[
        'box-border flex w-28 flex-col items-center rounded-lg px-3 pb-4 pt-3 sm:w-32',
        'aspect-[3/4] shadow-sm',
        picked
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
            {displayEstimate}
          </span>
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
