'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Tooltip } from '@radix-ui/themes';
import { Check, Info, X } from 'lucide-react';

import {
  getRoomSettings,
  setSessionCustomDeck,
} from '@/app/(protected)/session/actions';

const EXTRA_VOTES = [
  { id: 'coffee', label: 'Coffee', glyph: '☕' },
  { id: 'question', label: 'Unsure', glyph: '?' },
] as const;

type ExtraVoteId = (typeof EXTRA_VOTES)[number]['id'];

const EXTRA_CARD_VALUES = new Set(['☕', '?', 'coffee']);

const DECK_PRESETS = [
  '0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89',
  '2, 4, 8, 16, 24',
  '1, 2, 4, 8, 16, 32, 64',
  '1, 2, 3, 4',
  '0, 0.5, 1, 2, 3, 5, 8, 13, 20, 40, 100',
  'XS, S, M, L, XL, XXL',
  'Yes, No',
];

const SETTING_ROWS = [
  {
    id: 'allowChangeAfterReveal',
    label: 'Allow changing vote after reveal',
    hint: 'Participants can change their card after votes are shown.',
  },
  {
    id: 'autoReveal',
    label: 'Auto Reveal',
    hint: 'Reveal votes automatically once everyone has voted.',
  },
  {
    id: 'disableRevealCountdown',
    label: 'Disable Reveal Countdown',
    hint: 'Skip the countdown and reveal votes immediately.',
  },
  {
    id: 'alwaysRevealed',
    label: 'Always Revealed',
    hint: 'Show votes as soon as they are cast.',
  },
  {
    id: 'hideInactiveUsers',
    label: 'Hide Inactive Users',
    hint: 'Hide participants who have not voted this round.',
  },
  {
    id: 'funFeatures',
    label: 'Fun Features',
    hint: 'Enable playful extras such as celebrations.',
  },
] as const;

type SettingId = (typeof SETTING_ROWS)[number]['id'];

const DEFAULT_SETTINGS: Record<SettingId, boolean> = {
  allowChangeAfterReveal: false,
  autoReveal: false,
  disableRevealCountdown: false,
  alwaysRevealed: false,
  hideInactiveUsers: false,
  funFeatures: true,
};

interface RoomSettingsPanelProps {
  inviteCode: string;
  onClose: () => void;
}

function numericDeckCards(cards: string[]) {
  return cards.filter((card) => !EXTRA_CARD_VALUES.has(card));
}

function formatDeck(cards: string[]) {
  return cards.join(', ');
}

export default function RoomSettingsPanel({
  inviteCode,
  onClose,
}: RoomSettingsPanelProps) {
  const router = useRouter();
  const [deckInput, setDeckInput] = useState(DECK_PRESETS[0]);
  const [deckPickerOpen, setDeckPickerOpen] = useState(false);
  const [customDeck, setCustomDeck] = useState('1, 2, 3');
  const [deckError, setDeckError] = useState<string | null>(null);
  const [savingDeck, setSavingDeck] = useState(false);
  const [teamName, setTeamName] = useState<string | null>(null);
  const deckPickerRef = useRef<HTMLDivElement>(null);
  const deckPickerOpenRef = useRef(false);
  const [extraVotes, setExtraVotes] = useState<Set<ExtraVoteId>>(
    () => new Set(EXTRA_VOTES.map((vote) => vote.id)),
  );
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const settingsRef = useRef(settings);

  useEffect(() => {
    deckPickerOpenRef.current = deckPickerOpen;
  }, [deckPickerOpen]);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (deckPickerOpenRef.current) {
        setDeckPickerOpen(false);
        return;
      }
      onClose();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (!deckPickerOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!deckPickerRef.current?.contains(event.target as Node)) {
        setDeckPickerOpen(false);
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [deckPickerOpen]);

  useEffect(() => {
    let cancelled = false;

    void getRoomSettings(inviteCode).then((result) => {
      if (cancelled || result.status !== 'success') return;

      const { deckCards, teamName: nextTeamName } = result.data;
      const cards = numericDeckCards(deckCards);
      if (cards.length > 0) {
        setDeckInput(formatDeck(cards));
      }

      setTeamName(nextTeamName);

      if (!settingsRef.current.funFeatures) {
        setExtraVotes(new Set());
        return;
      }

      const extras = EXTRA_VOTES.map((vote) => vote.id);
      setExtraVotes(new Set(extras));

      const hasCoffee = deckCards.includes('☕');
      const hasQuestion =
        deckCards.includes('?') || deckCards.includes('coffee');
      if (cards.length > 0 && (!hasCoffee || !hasQuestion)) {
        void setSessionCustomDeck(inviteCode, formatDeck(cards), extras).then(
          (saved) => {
            if (!cancelled && saved.status === 'success') {
              router.refresh();
            }
          },
        );
      }
    });

    return () => {
      cancelled = true;
    };
  }, [inviteCode]);

  const applyDeck = async (
    value: string,
    extras: ExtraVoteId[] = Array.from(extraVotes),
    asCustom = false,
  ) => {
    const next = value.trim();
    if (!next || savingDeck) return;

    setDeckError(null);
    setSavingDeck(true);

    const result = await setSessionCustomDeck(inviteCode, next, extras);

    setSavingDeck(false);

    if (result.status === 'error') {
      setDeckError(result.error);
      return;
    }

    const cards = numericDeckCards(result.data.deckCards);
    const formatted = cards.length > 0 ? formatDeck(cards) : next;
    setDeckInput(formatted);
    if (asCustom) setCustomDeck(formatted);
    setDeckPickerOpen(false);
    router.refresh();
  };

  const toggleExtraVote = (id: ExtraVoteId) => {
    if (!settings.funFeatures) return;

    setExtraVotes((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSettingChange = (id: SettingId, checked: boolean) => {
    const nextSettings = {
      ...settingsRef.current,
      [id]: checked,
    };
    settingsRef.current = nextSettings;
    setSettings(nextSettings);

    if (id !== 'funFeatures') return;

    if (!checked) {
      setExtraVotes(new Set());
      void applyDeck(deckInput, []);
      return;
    }

    const extras = EXTRA_VOTES.map((vote) => vote.id);
    setExtraVotes(new Set(extras));
    void applyDeck(deckInput, extras);
  };

  const banner = teamName
    ? `These settings will be passed through sessions within team ${teamName}'s poker sessions.`
    : 'These settings will be passed through sessions in this poker room.';

  return (
    <aside
      className="room-settings-panel"
      role="dialog"
      aria-labelledby="room-settings-title"
    >
      <header className="room-settings-header">
        <h2 id="room-settings-title" className="room-settings-title">
          Room Settings
        </h2>
        <button
          type="button"
          className="room-settings-close"
          onClick={onClose}
          aria-label="Close room settings"
        >
          <X className="h-4 w-4" />
        </button>
      </header>

      <div
        className={`room-settings-body${deckPickerOpen ? ' is-deck-open' : ''}`}
      >
        <p className="room-settings-banner">{banner}</p>

        <div className="room-settings-field" ref={deckPickerRef}>
          <span className="room-settings-label" id="card-deck-label">
            Card deck
          </span>
          <input
            className={`room-settings-input room-settings-deck-trigger${deckPickerOpen ? ' is-open' : ''}`}
            value={deckInput}
            readOnly
            aria-labelledby="card-deck-label"
            aria-expanded={deckPickerOpen}
            aria-haspopup="listbox"
            onClick={() => setDeckPickerOpen((open) => !open)}
          />

          {deckPickerOpen ? (
            <div
              className="room-settings-deck-menu"
              role="listbox"
              aria-label="Card decks"
            >
              {DECK_PRESETS.map((preset) => {
                const selected = deckInput === preset;
                return (
                  <button
                    key={preset}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    className={`room-settings-deck-option${selected ? ' is-selected' : ''}`}
                    onClick={() => void applyDeck(preset)}
                  >
                    {preset}
                  </button>
                );
              })}

              {/* Custom deck
              <div className="room-settings-custom-deck">
                <span className="room-settings-custom-label">Custom deck</span>
                <div className="room-settings-custom-row">
                  <input
                    className="room-settings-custom-input"
                    value={customDeck}
                    onChange={(event) => setCustomDeck(event.target.value)}
                    aria-label="Custom deck"
                  />
                  <button
                    type="button"
                    className="room-settings-icon-btn"
                    aria-label="Use custom deck"
                    onClick={() => void applyDeck(customDeck, undefined, true)}
                  >
                    <Settings className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="room-settings-icon-btn"
                    aria-label="Clear custom deck"
                    onClick={() => setCustomDeck('')}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <button
                type="button"
                className="room-settings-create-deck"
                onClick={() => void applyDeck(customDeck, undefined, true)}
                disabled={savingDeck}
              >
                Create Any Custom deck
              </button>
              */}
            </div>
          ) : null}
          {deckError ? (
            <p className="room-settings-deck-error">{deckError}</p>
          ) : null}
        </div>

        <div className="room-settings-field">
          <span className="room-settings-label">
            Extra votes
            <Tooltip content="Non-numeric cards participants can vote with.">
              <button
                type="button"
                className="room-settings-info-btn"
                aria-label="Non-numeric cards participants can vote with."
              >
                <Info className="room-settings-info" />
              </button>
            </Tooltip>
          </span>
          <div
            className="room-settings-extras"
            role="group"
            aria-label="Extra votes"
          >
            {EXTRA_VOTES.map((vote) => {
              const selected = extraVotes.has(vote.id);
              return (
                <button
                  key={vote.id}
                  type="button"
                  className={`room-settings-extra${selected ? ' is-selected' : ''}`}
                  aria-pressed={selected}
                  aria-label={vote.label}
                  disabled={!settings.funFeatures}
                  onClick={() => toggleExtraVote(vote.id)}
                >
                  <span aria-hidden>{vote.glyph}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="room-settings-divider" />

        <div className="room-settings-options">
          {SETTING_ROWS.map((row) => {
            const checked = settings[row.id];
            return (
              <div key={row.id} className="room-settings-option">
                <label className="room-settings-option-control">
                  <input
                    type="checkbox"
                    className="room-settings-checkbox"
                    checked={checked}
                    onChange={(event) =>
                      handleSettingChange(row.id, event.target.checked)
                    }
                  />
                  <span
                    className={`room-settings-check${checked ? ' is-checked' : ''}`}
                    aria-hidden
                  >
                    {checked ? (
                      <Check className="h-3 w-3" strokeWidth={3} />
                    ) : null}
                  </span>
                  <span className="room-settings-option-label">
                    {row.label}
                  </span>
                </label>
                <Tooltip content={row.hint}>
                  <button
                    type="button"
                    className="room-settings-info-btn"
                    aria-label={row.hint}
                  >
                    <Info className="room-settings-info" />
                  </button>
                </Tooltip>
              </div>
            );
          })}
        </div>
      </div>

      <footer className="room-settings-footer">
        Missing a feature?{' '}
        <a
          className="room-settings-feedback"
          href="mailto:?subject=Scrum%20Poker%20feature%20request"
        >
          Tell me
        </a>
      </footer>
    </aside>
  );
}
