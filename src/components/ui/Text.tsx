import { type ElementType, type ReactNode } from 'react';

type TextVariant =
  | 'brand'
  | 'heading'
  | 'subheading'
  | 'body'
  | 'muted'
  | 'subtle'
  | 'footnote'
  | 'price'
  | 'price-original'
  | 'badge'
  | 'plain';

const variantClass: Record<TextVariant, string> = {
  brand:          'text-brand',
  heading:        'text-heading',
  subheading:     'text-subheading',
  body:           'text-body',
  muted:          'text-muted',
  subtle:         'text-subtle',
  footnote:       'text-footnote',
  price:          'text-price',
  'price-original': 'text-price-original',
  badge:          'text-badge',
  plain:          '',
};

interface TextProps {
  variant?: TextVariant;
  as?: ElementType;
  className?: string;
  children: ReactNode;
}

export default function Text({
  variant = 'body',
  as: Tag = 'p',
  className = '',
  children,
}: TextProps) {
  const classes = `${variantClass[variant]} ${className}`.trim();
  return (
    <Tag className={classes || undefined}>
      {children}
    </Tag>
  );
}
