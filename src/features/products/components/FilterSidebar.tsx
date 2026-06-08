'use client';

import { useReducer, useTransition, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { categories } from '@/lib/products';
import Button from '@/components/ui/Button';

const priceRanges = [
  { label: 'All Prices',      value: '' },
  { label: 'Under ₹50',       value: '0-50' },
  { label: '₹50 – ₹150',      value: '50-150' },
  { label: '₹150 – ₹300',     value: '150-300' },
  { label: '₹300 – ₹500',     value: '300-500' },
  { label: 'Over ₹500',       value: '500-' },
];

interface AccordionState {
  categoryOpen: boolean;
  priceOpen: boolean;
}

type AccordionAction =
  | { type: 'TOGGLE_CATEGORY' }
  | { type: 'TOGGLE_PRICE' };

function accordionReducer(state: AccordionState, action: AccordionAction): AccordionState {
  switch (action.type) {
    case 'TOGGLE_CATEGORY':
      return { ...state, categoryOpen: !state.categoryOpen };
    case 'TOGGLE_PRICE':
      return { ...state, priceOpen: !state.priceOpen };
    default:
      return state;
  }
}

const initialAccordion: AccordionState = { categoryOpen: false, priceOpen: false };

export default function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [{ categoryOpen, priceOpen }, dispatch] = useReducer(accordionReducer, initialAccordion);

  const activeCategory   = searchParams.get('category') ?? '';
  const activePriceRange = searchParams.get('price') ?? '';

  const updateFilter = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('page');
    startTransition(() => {
      router.push(`/products?${params.toString()}`);
    });
  }, [searchParams, router, startTransition]);

  return (
    <aside className="filter-sidebar">

      <div className={`filter-group ${categoryOpen ? 'filter-group--open' : ''}`}>
        <Button
          variant="custom"
          className="filter-heading-btn"
          onClick={() => dispatch({ type: 'TOGGLE_CATEGORY' })}
          aria-expanded={categoryOpen}
        >
          Category
          <span className="filter-chevron" aria-hidden="true">▾</span>
        </Button>
        <ul className="filter-list">
          <li>
            <Button
              variant="custom"
              className={`filter-btn ${activeCategory === '' ? 'filter-btn--active' : ''}`}
              onClick={() => updateFilter('category', '')}
            >
              All
            </Button>
          </li>
          {categories.map(({ name }) => (
            <li key={name}>
              <Button
                variant="custom"
                className={`filter-btn ${activeCategory === name ? 'filter-btn--active' : ''}`}
                onClick={() => updateFilter('category', name)}
              >
                {name}
              </Button>
            </li>
          ))}
        </ul>
      </div>

      <div className={`filter-group ${priceOpen ? 'filter-group--open' : ''}`}>
        <Button
          variant="custom"
          className="filter-heading-btn"
          onClick={() => dispatch({ type: 'TOGGLE_PRICE' })}
          aria-expanded={priceOpen}
        >
          Price
          <span className="filter-chevron" aria-hidden="true">▾</span>
        </Button>
        <ul className="filter-list">
          {priceRanges.map(({ label, value }) => (
            <li key={value}>
              <Button
                variant="custom"
                className={`filter-btn ${activePriceRange === value ? 'filter-btn--active' : ''}`}
                onClick={() => updateFilter('price', value)}
              >
                {label}
              </Button>
            </li>
          ))}
        </ul>
      </div>

    </aside>
  );
}
