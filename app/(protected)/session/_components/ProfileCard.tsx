'use client';

import Image from 'next/image';
import { Check } from 'lucide-react';

interface ProfileCardProps {
  seed: string;
  name: string;
  estimate?: string;
  hasVoted?: boolean;
  isCurrentUser?: boolean;
  avatarSize?: number;
  className?: string;
}

const HANDCRAFTED_VOTE_COLORS: Record<string, string> = {
  '0': '#14b8a6',
  '0.5': '#06b6d4',
  '1': '#22c55e',
  '2': '#84cc16',
  '3': '#eab308',
  '5': '#f59e0b',
  '8': '#f97316',
  '13': '#ef4444',
  '21': '#a855f7',
  '34': '#6366f1',
  '55': '#3b82f6',
  '89': '#0ea5e9',
  '?': '#64748b',
  'coffee': '#a16207',
  '☕': '#a16207',
  'banana': '#ca8a04',
};

const FALLBACK_VOTE_COLORS = [
  '#059669',
  '#65a30d',
  '#ca8a04',
  '#ea580c',
  '#dc2626',
  '#9333ea',
  '#4f46e5',
  '#0284c7',
];

function normalizeVoteValue(value: string): string {
  const trimmed = value.trim().toLowerCase();
  const asNumber = Number(trimmed);

  if (!Number.isNaN(asNumber) && Number.isFinite(asNumber)) {
    return asNumber.toString();
  }

  return trimmed;
}

function getVoteColor(value: string): string {
  const normalized = normalizeVoteValue(value);
  const knownColor = HANDCRAFTED_VOTE_COLORS[normalized];

  if (knownColor) {
    return knownColor;
  }

  // Deterministic fallback for unexpected custom deck values.
  let hash = 0;
  for (let i = 0; i < normalized.length; i += 1) {
    hash = (hash * 31 + normalized.charCodeAt(i)) >>> 0;
  }

  return FALLBACK_VOTE_COLORS[hash % FALLBACK_VOTE_COLORS.length];
}

export default function ProfileCard({
  seed,
  name,
  estimate = '',
  hasVoted = false,
  isCurrentUser = false,
  avatarSize = 72,
  className = '',
}: ProfileCardProps) {
  const picked = estimate.length > 0;
  const showVotedMask = !isCurrentUser && hasVoted && !picked;
  const pickedColor = picked ? getVoteColor(estimate) : undefined;

  return (
    <div
      className={[
        'box-border flex w-28 flex-col items-center rounded-lg px-3 pb-4 pt-3 sm:w-32',
        'aspect-[3/4] shadow-sm',
        picked
          ? 'border-2 border-blue-400'
          : showVotedMask
            ? 'border-2 border-blue-400 bg-[#d8f4dc]'
            : 'border-4 border-blue-400 bg-gray-100',
        className,
      ].join(' ')}
      style={pickedColor ? { backgroundColor: pickedColor } : undefined}
    >
      {picked ? (
        <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-center pb-1">
          <span
            className={
              estimate === 'banana'
                ? 'text-5xl leading-none text-white'
                : 'text-5xl font-semibold tabular-nums leading-none text-white sm:text-6xl'
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
        className={[
          'mt-auto w-full shrink-0 truncate text-center text-sm font-normal leading-tight sm:text-base',
          picked ? 'text-white' : 'text-slate-700',
        ].join(' ')}
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
