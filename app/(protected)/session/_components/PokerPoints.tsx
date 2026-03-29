'use client';

import { ToggleGroup } from 'radix-ui';

import { POKER_DECK } from '@/app/(home)/_constants/pokerDeck';

function pokerCardModifier(value: string) {
  if (value === 'banana') return 'poker-card--banana';
  if (['13', '21', '34', '55', '89'].includes(value))
    return 'poker-card--compact';
  return 'poker-card--number';
}

interface PokerPointsProps {
  /** Controlled selected value (deck `value`, e.g. `"5"` or `"banana"`). */
  value: string;
  onValueChange?: (value: string) => void;
}

export function PokerPoints({ value, onValueChange }: PokerPointsProps) {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-6 pt-4"
      role="presentation"
    >
      <ToggleGroup.Root
        type="single"
        orientation="horizontal"
        rovingFocus
        className="pointer-events-auto flex max-w-full flex-nowrap items-end justify-center gap-2 sm:gap-3"
        aria-label="Planning poker estimate"
        value={value}
        onValueChange={(v) => onValueChange?.(v)}
      >
        {POKER_DECK.map((card) => (
          <ToggleGroup.Item
            key={card.value}
            value={card.value}
            className={`poker-card ${pokerCardModifier(card.value)}`}
          >
            {card.label}
          </ToggleGroup.Item>
        ))}
      </ToggleGroup.Root>
    </div>
  );
}
