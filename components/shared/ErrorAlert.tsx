'use client';

import { AlertCircle, X } from 'lucide-react';
import { Callout, IconButton } from '@radix-ui/themes';

interface ErrorAlertProps {
  title?: string;
  message: string;
  onDismiss?: () => void;
  className?: string;
}

export default function ErrorAlert({
  title = 'Something went wrong',
  message,
  onDismiss,
}: ErrorAlertProps) {
  return (
    <Callout.Root color="red" variant="surface" size="2">
      <Callout.Icon>
        <AlertCircle className="h-4 w-4" />
      </Callout.Icon>
      <Callout.Text>
        <strong>{title}</strong>
        <br />
        {message}
      </Callout.Text>
      {onDismiss && (
        <IconButton variant="ghost" color="red" size="1" onClick={onDismiss}>
          <X className="h-3 w-3" />
        </IconButton>
      )}
    </Callout.Root>
  );
}
