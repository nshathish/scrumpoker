'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card } from '@radix-ui/themes';

export interface AvatarGridProps {
  seeds: string[];
  size?: number;
  onSelect?: (seed: string) => void;
  /** Controlled selection (e.g. current session avatar seed) */
  selectedSeed?: string | null;
}

export function AvatarGrid({
  seeds,
  size = 120,
  onSelect,
  selectedSeed: selectedSeedProp,
}: AvatarGridProps) {
  const [internalSeed, setInternalSeed] = useState<string | null>(null);
  const controlled = selectedSeedProp !== undefined;
  const selected = controlled ? selectedSeedProp : internalSeed;

  const handleClick = (seed: string) => {
    if (!controlled) setInternalSeed(seed);
    onSelect?.(seed);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 p-6">
      {seeds.map((seed: string) => (
        <Card
          key={seed}
          onClick={() => handleClick(seed)}
          className={`cursor-pointer rounded-full p-2 transition ${
            selected === seed
              ? 'ring-4 ring-blue-400'
              : 'ring-2 ring-transparent'
          }`}
        >
          <div className="overflow-hidden rounded-full">
            <Image
              src={`/api/avatar?seed=${encodeURIComponent(seed)}&v=2`}
              alt={seed}
              width={size}
              height={size}
              unoptimized
              loading="eager"
              className="rounded-full"
            />
          </div>
        </Card>
      ))}
    </div>
  );
}
