'use client';

import { useEffect } from 'react';

import { X } from 'lucide-react';

interface RoomSettingsNoticeProps {
  ownerName: string;
  onClose: () => void;
}

export default function RoomSettingsNotice({
  ownerName,
  onClose,
}: RoomSettingsNoticeProps) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <aside
      className="room-settings-panel room-settings-notice"
      role="dialog"
      aria-labelledby="room-settings-notice-title"
    >
      <header className="room-settings-header">
        <h2 id="room-settings-notice-title" className="room-settings-title">
          Room Settings
        </h2>
        <button
          type="button"
          className="room-settings-close"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </header>

      <div className="room-settings-body">
        <p className="room-settings-notice-message">
          Only the session owner can change these settings. Contact{' '}
          <strong>{ownerName}</strong> to update the room.
        </p>
      </div>
    </aside>
  );
}
