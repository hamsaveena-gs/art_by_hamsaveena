import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="status-page">

      {/* Picture frame containing the 404 */}
      <div className="nf-frame">
        <p className="nf-number">404</p>
        <p className="nf-frame-caption">Exhibit not found</p>
      </div>

      {/* Gallery exhibition label */}
      <div className="nf-label">
        <p className="nf-label-title">Lost in the Gallery</p>
        <p className="nf-label-meta">Art by Hamsaveena &nbsp;·&nbsp; {new Date().getFullYear()}</p>
        <p className="nf-label-desc">
          This page doesn&apos;t exist in our collection. It may have been moved, sold, or never hung here to begin with.
        </p>
      </div>

      <div className="nf-actions">
        <Button href="/" variant="primary">Back to Home</Button>
        <Button href="/products" variant="outline">Browse Shop</Button>
      </div>

    </div>
  );
}
