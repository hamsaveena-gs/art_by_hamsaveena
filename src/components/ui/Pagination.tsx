'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

/**
 * Always anchors page 1 on the left.
 * Window = current, current+1, current+2.
 * Last page anchored on the right when outside window.
 *
 *  page 1  (total 10) →  1  2  3  …  10
 *  page 2  (total 10) →  1  2  3  4  …  10
 *  page 3  (total 10) →  1  …  3  4  5  …  10
 *  page 8  (total 10) →  1  …  8  9  10
 *  page 9  (total 10) →  1  …  9  10
 */
function getPageItems(current: number, total: number): (number | '…')[] {
  const items: (number | '…')[] = [1];

  // Window: start at current but skip page 1 (already added)
  const wStart = Math.max(current, 2);
  const wEnd   = Math.min(current + 2, total);

  // Left ellipsis when window doesn't start directly after page 1
  if (wStart > 2) items.push('…');

  for (let p = wStart; p <= wEnd; p++) items.push(p);

  // Right: ellipsis + last page when window doesn't reach the end
  if (wEnd < total - 1) {
    items.push('…');
    items.push(total);
  } else if (wEnd < total) {
    items.push(total);
  }

  return items;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  function buildUrl(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) {
      params.delete('page');
    } else {
      params.set('page', String(page));
    }
    const qs = params.toString();
    return qs ? `/products?${qs}` : '/products';
  }

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;
  const pageItems = getPageItems(currentPage, totalPages);

  return (
    <nav className="pagination" aria-label="Products pagination">
      <Link
        href={buildUrl(currentPage - 1)}
        className={`pagination-btn${!hasPrev ? ' pagination-btn--disabled' : ''}`}
        aria-disabled={!hasPrev}
        tabIndex={hasPrev ? 0 : -1}
      >
        ← Prev
      </Link>

      <div className="pagination-pages">
        {pageItems.map((item, idx) =>
          item === '…' ? (
            <span key={`ellipsis-${idx}`} className="pagination-ellipsis">…</span>
          ) : (
            <Link
              key={item}
              href={buildUrl(item)}
              className={`pagination-page${item === currentPage ? ' pagination-page--active' : ''}`}
              aria-current={item === currentPage ? 'page' : undefined}
            >
              {item}
            </Link>
          )
        )}
      </div>

      <Link
        href={buildUrl(currentPage + 1)}
        className={`pagination-btn${!hasNext ? ' pagination-btn--disabled' : ''}`}
        aria-disabled={!hasNext}
        tabIndex={hasNext ? 0 : -1}
      >
        Next →
      </Link>
    </nav>
  );
}
