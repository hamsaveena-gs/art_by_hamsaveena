import { render, screen, act } from '@testing-library/react';
import HeroTypewriter from '@/features/home/components/HeroTypewriter';

jest.useFakeTimers();

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
});
