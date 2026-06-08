'use client';

import Button from '@/components/ui/Button';

interface NavHamburgerProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function NavHamburger({ isOpen, onToggle }: NavHamburgerProps) {
  return (
    <Button
      variant="custom"
      className="nav-hamburger-btn"
      onClick={onToggle}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
    >
      <span className={`nav-hamburger-bar ${isOpen ? 'bar-1-open' : ''}`.trim()} />
      <span className={`nav-hamburger-bar ${isOpen ? 'bar-2-open' : ''}`.trim()} />
      <span className={`nav-hamburger-bar ${isOpen ? 'bar-3-open' : ''}`.trim()} />
    </Button>
  );
}
