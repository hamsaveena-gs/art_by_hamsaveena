'use client';

import { useEffect } from 'react';
import Button from '@/components/ui/Button';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="status-page">

      {/* Broken canvas illustration */}
      <div className="status-page-error-ring">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          {/* Easel canvas */}
          <rect x="5" y="4" width="30" height="24" rx="2" fill="white" stroke="currentColor" strokeWidth="2"/>
          {/* X on canvas */}
          <line x1="11" y1="10" x2="29" y2="22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="29" y1="10" x2="11" y2="22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          {/* Easel legs */}
          <line x1="13" y1="28" x2="8"  y2="38" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <line x1="27" y1="28" x2="32" y2="38" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <line x1="20" y1="28" x2="20" y2="38" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>

      <Heading as="h1" className="status-page-title">
        Something Went Wrong
      </Heading>

      <div className="status-page-divider" />

      <Text variant="muted" className="status-page-subtitle">
        The canvas had an unexpected smudge. Try reloading — if the problem persists, head back home.
      </Text>

      <div className="status-page-actions">
        <Button onClick={reset} variant="primary">Try Again</Button>
        <Button href="/" variant="outline">Back to Home</Button>
      </div>

    </div>
  );
}
