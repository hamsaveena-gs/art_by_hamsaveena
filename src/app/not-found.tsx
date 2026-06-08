import Button from '@/components/ui/Button';
import Text from '@/components/ui/Text';

export default function NotFound() {
  return (
    <div className="page-container">
      <div className="empty-state">
        <Text variant="plain" as="p" className="heading-404">404</Text>
        <Text variant="plain" as="p" className="page-title">Page not found</Text>
        <Text variant="muted" className="mt-2">The page you are looking for does not exist.</Text>
        <Button href="/" variant="primary" className="mt-8">
          Go Home
        </Button>
      </div>
    </div>
  );
}
