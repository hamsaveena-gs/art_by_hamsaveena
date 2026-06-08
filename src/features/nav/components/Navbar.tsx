'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import NavLinks from '@/features/nav/components/NavLinks';
import NavDrawer from '@/features/nav/components/NavDrawer';
import NavHamburger from '@/features/nav/components/NavHamburger';
import CartIcon from '@/features/nav/components/CartIcon';

const navLinks = [
  { href: '/',         label: 'Home' },
  { href: '/products', label: 'Shop' },
  { href: '/login',    label: 'Login' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="nav">
        <div className="nav-inner">
          <Link href="/" className="nav-brand">
            Art by Hamsaveena
          </Link>

          <NavLinks navLinks={navLinks} pathname={pathname} />

          <div className="nav-actions">
            <CartIcon />
            <NavHamburger isOpen={menuOpen} onToggle={() => setMenuOpen(!menuOpen)} />
          </div>
        </div>
      </nav>

      <NavDrawer
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        navLinks={navLinks}
        pathname={pathname}
      />
    </>
  );
}
