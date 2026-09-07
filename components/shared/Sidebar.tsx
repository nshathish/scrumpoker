'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';

import { Flex, IconButton, Popover, Text, Tooltip } from '@radix-ui/themes';
import { Link2, List, PieChart, Settings } from 'lucide-react';

import QRBox from '@/components/qrcode/QRBox';
import RoomSettingsNotice from '@/components/shared/RoomSettingsNotice';
import RoomSettingsPanel from '@/components/shared/RoomSettingsPanel';

import { getRoomSettingsAccess } from '@/app/(protected)/session/actions';

export default function Sidebar() {
  const params = useParams();
  const inviteCode = params.id as string | undefined;
  const [copied, setCopied] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [ownerNotice, setOwnerNotice] = useState<string | null>(null);

  const handleSettingsClick = async () => {
    if (settingsOpen || ownerNotice) {
      setSettingsOpen(false);
      setOwnerNotice(null);
      return;
    }

    if (!inviteCode) return;

    const result = await getRoomSettingsAccess(inviteCode);
    if (result.status === 'error') return;

    if (result.data.isOwner) {
      setSettingsOpen(true);
      return;
    }

    setOwnerNotice(result.data.ownerName);
  };

  const handleCopyLink = async () => {
    if (!inviteCode) return;
    const url = `${window.location.origin}/session/${inviteCode}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Don't render on non-session protected pages
  if (!inviteCode) return null;

  return (
    <div className="session-sidebar-wrap">
    <aside className="session-sidebar">
      <Flex direction="column" gap="5">
        {/* Invite */}
        <Popover.Root>
          <Tooltip content="Invite" side="right">
            <Popover.Trigger>
              <IconButton
                variant="ghost"
                size="3"
                radius="full"
                color="gray"
                className="sidebar-icon"
              >
                <Link2 className="h-5 w-5" />
              </IconButton>
            </Popover.Trigger>
          </Tooltip>

          <Popover.Content
            side="right"
            sideOffset={12}
            className="sidebar-popover"
          >
            <Flex direction="column" gap="3">
              <Text
                size="2"
                weight="medium"
                className="sidebar-popover-item"
                onClick={handleCopyLink}
                style={{ cursor: 'pointer' }}
              >
                {copied ? 'Copied!' : 'Copy invite link'}
              </Text>

              <div className="sidebar-popover-divider" />

              <Text size="2" weight="medium">
                Scan QR to join
              </Text>
              <div className="flex justify-center">
                <QRBox />
              </div>
            </Flex>
          </Popover.Content>
        </Popover.Root>

        {/* Issues / Stories */}
        <Popover.Root>
          <Tooltip content="Issues" side="right">
            <Popover.Trigger>
              <IconButton
                variant="ghost"
                size="3"
                radius="full"
                color="gray"
                className="sidebar-icon"
              >
                <List className="h-5 w-5" />
              </IconButton>
            </Popover.Trigger>
          </Tooltip>

          <Popover.Content
            side="right"
            sideOffset={12}
            className="sidebar-popover"
          >
            <Flex direction="column" gap="3">
              <Text size="2" weight="medium">
                Issues
              </Text>
              <Text size="2" color="gray">
                feature coming soon
              </Text>
            </Flex>
          </Popover.Content>
        </Popover.Root>

        {/* Results */}
        <Popover.Root>
          <Tooltip content="Results" side="right">
            <Popover.Trigger>
              <IconButton
                variant="ghost"
                size="3"
                radius="full"
                color="gray"
                className="sidebar-icon"
              >
                <PieChart className="h-5 w-5" />
              </IconButton>
            </Popover.Trigger>
          </Tooltip>

          <Popover.Content
            side="right"
            sideOffset={12}
            className="sidebar-popover"
          >
            <Flex direction="column" gap="3">
              <Text size="2" weight="medium">
                Results
              </Text>
              <Text size="2" color="gray">
                feature coming soon
              </Text>
            </Flex>
          </Popover.Content>
        </Popover.Root>

        {/* Settings */}
        <Tooltip content="Settings" side="right">
          <IconButton
            variant="ghost"
            size="3"
            radius="full"
            color="gray"
            className={`sidebar-icon${settingsOpen || ownerNotice ? ' is-active' : ''}`}
            aria-expanded={settingsOpen || Boolean(ownerNotice)}
            aria-controls="room-settings-title"
            onClick={() => void handleSettingsClick()}
          >
            <Settings className="h-5 w-5" />
          </IconButton>
        </Tooltip>
      </Flex>
    </aside>

    {settingsOpen && inviteCode ? (
      <RoomSettingsPanel
        inviteCode={inviteCode}
        onClose={() => setSettingsOpen(false)}
      />
    ) : null}

    {ownerNotice ? (
      <RoomSettingsNotice
        ownerName={ownerNotice}
        onClose={() => setOwnerNotice(null)}
      />
    ) : null}
    </div>
  );
}
