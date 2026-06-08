'use client';

import Link from 'next/link';
import Button from '@/components/ui/Button';
import Text from '@/components/ui/Text';

interface NavLink {
  href: string;
  label: string;
}

interface NavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: NavLink[];
  pathname: string;
}

export default function NavDrawer({ isOpen, onClose, navLinks, pathname }: NavDrawerProps) {
  return (
    <>
      {isOpen && (
        <div className="nav-drawer-overlay" onClick={onClose} />
      )}
      <div className={`nav-drawer ${isOpen ? 'nav-drawer--open' : ''}`.trim()}>
        <div className="nav-drawer-header">
          <Text variant="plain" as="span" className="nav-brand">Art by Hamsaveena</Text>
          <Button variant="custom" className="nav-drawer-close" onClick={onClose} aria-label="Close menu">
            ✕
          </Button>
        </div>
        <nav className="nav-drawer-list">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`nav-drawer-link ${pathname === href ? 'nav-drawer-link--active' : ''}`.trim()}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
