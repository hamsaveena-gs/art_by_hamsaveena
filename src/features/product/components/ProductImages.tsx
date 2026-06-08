'use client';

import { useState } from 'react';
import Image from 'next/image';
import Button from '@/components/ui/Button';

interface ProductImagesProps {
  images: string[];
  name: string;
}

export default function ProductImages({ images, name }: ProductImagesProps) {
  const [active, setActive] = useState(0);

  return (
    <div className="product-images">
      <div className="product-image-main">
        <Image
          src={images[active]}
          alt={name}
          fill
          className="product-image-main-img"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      {images.length > 1 && (
        <div className="product-image-thumbs">
          {images.map((src, i) => (
            <Button
              key={i}
              variant="custom"
              onClick={() => setActive(i)}
              className={`product-thumb ${i === active ? 'product-thumb--active' : ''}`}
              aria-label={`View image ${i + 1}`}
            >
              <Image
                src={src}
                alt={`${name} view ${i + 1}`}
                fill
                className="product-thumb-img"
                sizes="80px"
              />
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
