import Link from 'next/link';
import Text from '@/components/ui/Text';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <Text variant="brand" as="span">
          Art by Hamsaveena
        </Text>

        <nav className="footer-links">
          <Link href="/" className="footer-link">Home</Link>
          <Link href="/products" className="footer-link">Shop</Link>
          <Link href="/cart" className="footer-link">Cart</Link>
        </nav>

        <Text variant="footnote">
          &copy; {new Date().getFullYear()} Art by Hamsaveena. All rights reserved.
        </Text>
      </div>
    </footer>
  );
}
