'use client';

import { useEffect } from 'react';
import { useErrorNotification } from '@/components/ui';
import { ErrorFactory } from '@/lib/errors';

export default function ClientToast({ message }: { message: string }) {
  const { showError } = useErrorNotification();
  useEffect(() => {
    showError(ErrorFactory.network(message, 'ui'));
  }, [message, showError]);
  return null;
}
