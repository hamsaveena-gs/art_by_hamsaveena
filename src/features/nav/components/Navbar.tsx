'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import NavLinks from '@/features/nav/components/NavLinks';
import NavDrawer from '@/features/nav/components/NavDrawer';
import NavHamburger from '@/features/nav/components/NavHamburger';
import CartIcon from '@/features/nav/components/CartIcon';
import Heading from '@/components/ui/Heading';
import Button from '@/components/ui/Button';
import { useUser } from '@/hooks/useUser';
import { getSupabase } from '@/lib/supabase';
import { useCartStore } from '@/features/cart/store/cartStore';

const baseNavLinks = [
  { href: '/',         label: 'Home' },
  { href: '/products', label: 'Shop' },
];

export default function Navbar() {
  const pathname = usePathname();
  const router   = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const { firstName } = useUser();

  const navLinks = firstName
    ? baseNavLinks
    : [...baseNavLinks, { href: '/login', label: 'Login' }];

  const handleSignOut = async () => {
    useCartStore.getState().clearCart();
    await getSupabase().auth.signOut();
    router.push('/login');
  };

  return (
    <>
      <nav className="nav">
        <div className="nav-inner">
          <Link href="/" className="nav-brand">
            Art by Hamsaveena
          </Link>

          <NavLinks navLinks={navLinks} pathname={pathname} />

          <div className="nav-actions">
            {firstName && (
              <div className="nav-user">
                <Heading as="h2" className="nav-greeting">Hi, {firstName}</Heading>
                <Button
                  variant="custom"
                  className="nav-signout"
                  onClick={handleSignOut}
                >
                  Sign out
                </Button>
              </div>
            )}
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
        firstName={firstName}
        onSignOut={handleSignOut}
      />
    </>
  );
}
