import Image from 'next/image';
import Button from '@/components/ui/Button';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import HeroTypewriter from './HeroTypewriter';

export default function HeroSection() {
  return (
    <section className="hero">
      <Image
        src="/images/hero.jpg"
        alt=""
        fill
        className="hero-bg-image"
        priority
        sizes="100vw"
      />
      <div className="hero-overlay" />
      <div className="hero-content">
        <Text variant="plain" className="hero-eyebrow">Curated art for every space</Text>
        <Heading as="h1" className="hero-title">
          Discover Embroidery<br />Originals.<br /><HeroTypewriter />
        </Heading>
        <Text variant="plain" className="hero-subtitle">
          Explore a collection of handcrafted paintings, sketches, and creative works. Each piece is thoughtfully created to inspire, captivate, and bring a personal touch to your space.
        </Text>
        <div className="hero-actions">
          <Button href="/products" variant="primary">
            Shop All Art
          </Button>
          <Button href="/products?category=Painting" variant="outline">
            View Paintings
          </Button>
        </div>
      </div>
    </section>
  );
}
