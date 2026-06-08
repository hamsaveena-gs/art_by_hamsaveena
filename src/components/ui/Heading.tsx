import { type HTMLAttributes } from 'react';

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: HeadingLevel;
  className?: string;
}

export default function Heading({
  as: Tag = 'h2',
  className = '',
  children,
  ...props
}: HeadingProps) {
  return (
    <Tag className={className || undefined} {...props}>
      {children}
    </Tag>
  );
}
