'use client';

import { useState, useTransition, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Button from '@/components/ui/Button';

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [value, setValue] = useState(searchParams.get('q') ?? '');

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (value.trim()) {
      params.set('q', value.trim());
    } else {
      params.delete('q');
    }
    startTransition(() => {
      router.push(`/products?${params.toString()}`);
    });
  }, [value, searchParams, router, startTransition]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);

    if (!newValue) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete('q');
      startTransition(() => {
        router.push(`/products?${params.toString()}`);
      });
    }
  }, [searchParams, router, startTransition]);

  return (
    <form onSubmit={handleSubmit} className="search-form" role="search">
      <input
        type="search"
        value={value}
        onChange={handleChange}
        placeholder="Search artworks…"
        className="search-input"
        aria-label="Search artworks"
      />
      <Button variant="custom" type="submit" className="search-btn" aria-label="Search">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </Button>
    </form>
  );
}
