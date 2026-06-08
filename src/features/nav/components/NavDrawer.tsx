'use client';

import Link from 'next/link';
import Button from '@/components/ui/Button';
import Heading from '@/components/ui/Heading';
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
  firstName?: string | null;
  onSignOut?: () => void;
}

export default function NavDrawer({
  isOpen,
  onClose,
  navLinks,
  pathname,
  firstName,
  onSignOut,
}: NavDrawerProps) {
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

        {firstName && (
          <div className="nav-drawer-user">
            <Heading as="h2" className="nav-drawer-greeting">Hi, {firstName}</Heading>
            <Button variant="custom" className="nav-drawer-signout" onClick={onSignOut}>
              Sign out
            </Button>
          </div>
        )}

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
