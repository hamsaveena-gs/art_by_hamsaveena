import Link from 'next/link';

interface NavLink {
  href: string;
  label: string;
}

interface NavLinksProps {
  navLinks: NavLink[];
  pathname: string;
}

export default function NavLinks({ navLinks, pathname }: NavLinksProps) {
  return (
    <div className="nav-links">
      {navLinks.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={`nav-link ${pathname === href ? 'nav-link--active' : ''}`.trim()}
        >
          {label}
        </Link>
      ))}
    </div>
  );
}
