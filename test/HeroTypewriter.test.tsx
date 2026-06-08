import { render, screen, act } from '@testing-library/react';
import HeroTypewriter from '@/features/home/components/HeroTypewriter';

jest.useFakeTimers();

// Component constants (kept in sync with HeroTypewriter.tsx):
// WORD         = 'COMMING SOON'  (12 chars)
// TYPE_SPEED   = 100ms/char  →  12 * 100 = 1200ms to type
// PAUSE_FULL   = 2000ms
// DEL_SPEED    = 60ms/char   →  12 * 60  = 720ms  to delete
// PAUSE_EMPTY  = 500ms
//
// Chained timers only become visible to the next advanceTimersByTime call
// AFTER React re-renders and the effect re-runs. So each step must be
// its own act() call.

const WORD_LEN = 12; // 'COMMING SOON'

function typeAllChars() {
  for (let i = 0; i < WORD_LEN; i++) {
    act(() => { jest.advanceTimersByTime(100); });
  }
}

function deleteAllChars() {
  for (let i = 0; i < WORD_LEN; i++) {
    act(() => { jest.advanceTimersByTime(60); });
  }
}

describe('HeroTypewriter', () => {
  afterEach(() => jest.clearAllTimers());

  it('renders the typewriter span', () => {
    const { container } = render(<HeroTypewriter />);
    expect(container.querySelector('.hero-typewriter')).toBeInTheDocument();
  });

  it('renders the blinking cursor', () => {
    const { container } = render(<HeroTypewriter />);
    expect(container.querySelector('.hero-cursor')).toBeInTheDocument();
  });

  it('starts with an empty displayed string', () => {
    const { container } = render(<HeroTypewriter />);
    const typewriter = container.querySelector('.hero-typewriter');
    // cursor span is the only child initially
    expect(typewriter?.textContent).toBe('|');
  });

  it('types characters over time', () => {
    const { container } = render(<HeroTypewriter />);
    act(() => { jest.advanceTimersByTime(500); });
    const text = container.querySelector('.hero-typewriter')?.textContent ?? '';
    // After 500ms at 100ms/char, at least 1 character should be typed
    expect(text.replace('|', '').length).toBeGreaterThanOrEqual(1);
  });

  it('fully types the word after all TYPE steps', () => {
    const { container } = render(<HeroTypewriter />);
    typeAllChars();
    const text = container.querySelector('.hero-typewriter')?.textContent ?? '';
    expect(text.replace('|', '')).toBe('COMMING SOON');
  });

  it('begins deleting after typing and pause period', () => {
    const { container } = render(<HeroTypewriter />);
    typeAllChars();
    act(() => { jest.advanceTimersByTime(2000); }); // pause completes
    act(() => { jest.advanceTimersByTime(60); });   // first delete fires
    const text = container.querySelector('.hero-typewriter')?.textContent ?? '';
    expect(text.replace('|', '').length).toBeLessThan(WORD_LEN);
  });

  it('clears to empty after the full deleting phase', () => {
    const { container } = render(<HeroTypewriter />);
    typeAllChars();
    act(() => { jest.advanceTimersByTime(2000); }); // pause completes
    deleteAllChars();
    const text = container.querySelector('.hero-typewriter')?.textContent ?? '';
    expect(text.replace('|', '')).toBe('');
  });

  it('restarts typing after the full animation cycle', () => {
    const { container } = render(<HeroTypewriter />);
    typeAllChars();
    act(() => { jest.advanceTimersByTime(2000); }); // pause done
    deleteAllChars();
    act(() => { jest.advanceTimersByTime(500); });  // waiting done → phase=typing
    act(() => { jest.advanceTimersByTime(100); });  // first TYPE
    const text = container.querySelector('.hero-typewriter')?.textContent ?? '';
    expect(text.replace('|', '').length).toBeGreaterThanOrEqual(1);
  });
});
