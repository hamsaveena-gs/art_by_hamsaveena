import Image from 'next/image';
import Link from 'next/link';
import type { CategoryItem } from '@/types';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';

interface CategoryGridProps {
  categories: CategoryItem[];
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  if (categories.length === 0) return null;

  return (
    <section className="section">
      <Heading as="h2" className="section-heading">Browse by Category</Heading>
      <div className="category-grid">
        {categories.map(({ name, description, image }) => (
          <Link
            key={name}
            href={`/products?category=${encodeURIComponent(name)}`}
            className="category-card"
          >
            <Image
              src={image}
              alt={name}
              fill
              className="category-card-img"
              sizes="(min-width: 1024px) 200px, (min-width: 640px) 33vw, 50vw"
            />
            <span className="category-card-overlay" />
            <Text variant="plain" as="span" className="category-card-name">{name}</Text>
            <Text variant="plain" as="span" className="category-card-desc">{description}</Text>
          </Link>
        ))}
      </div>
    </section>
  );
}
