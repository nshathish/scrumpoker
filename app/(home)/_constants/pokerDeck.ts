export const POKER_DECK: readonly { value: string; label: string }[] = [
  { value: 'banana', label: '🍌' },
  { value: '0', label: '0' },
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '5', label: '5' },
  { value: '8', label: '8' },
  { value: '13', label: '13' },
  { value: '21', label: '21' },
  { value: '34', label: '34' },
  { value: '55', label: '55' },
  { value: '89', label: '89' },
] as const;

export function pokerLabelForValue(value: string): string {
  const row = POKER_DECK.find((p) => p.value === value);
  return row?.label ?? value;
}
