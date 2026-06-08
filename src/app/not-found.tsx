import Button from '@/components/ui/Button';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';

export default function NotFound() {
  return (
    <div className="status-page">

      {/* Paint palette illustration */}
      <div className="status-page-icon">
        <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <ellipse cx="46" cy="52" rx="36" ry="31" fill="#f0ece5" stroke="#e7e5e4" strokeWidth="2"/>
          {/* thumb hole */}
          <ellipse cx="67" cy="34" rx="8" ry="8" fill="white" stroke="#e7e5e4" strokeWidth="2"/>
          {/* paint blobs */}
          <circle cx="22" cy="44" r="6" fill="#c8a96e"/>
          <circle cx="27" cy="26" r="5" fill="#78716c"/>
          <circle cx="46" cy="19" r="5" fill="#1c1917"/>
          <circle cx="67" cy="54" r="5.5" fill="#c8a96e" opacity="0.7"/>
          <circle cx="60" cy="70" r="5" fill="#a8a29e"/>
          <circle cx="40" cy="76" r="5.5" fill="#78716c" opacity="0.7"/>
          <circle cx="21" cy="62" r="5" fill="#c8a96e" opacity="0.5"/>
          {/* paintbrush */}
          <line x1="72" y1="28" x2="86" y2="14" stroke="#78716c" strokeWidth="3" strokeLinecap="round"/>
          <rect x="68" y="24" width="7" height="12" rx="2" fill="#a8a29e" transform="rotate(-45 68 24)"/>
          <rect x="82" y="10" width="5" height="7" rx="1" fill="#c8a96e" transform="rotate(-45 82 10)"/>
        </svg>
      </div>

      <p className="status-page-code">404</p>
      <div className="status-page-divider" />

      <Heading as="h1" className="status-page-title">
        Lost in the Gallery
      </Heading>

      <Text variant="muted" className="status-page-subtitle">
        This page seems to have wandered off the canvas. The artwork you&apos;re looking for doesn&apos;t live here.
      </Text>

      <div className="status-page-actions">
        <Button href="/" variant="primary">Back to Home</Button>
        <Button href="/products" variant="outline">Browse Shop</Button>
      </div>

    </div>
  );
}
