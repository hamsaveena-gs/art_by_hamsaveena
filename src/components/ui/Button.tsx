import Link, { type LinkProps } from 'next/link';
import { type ButtonHTMLAttributes, type ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'icon' | 'success' | 'custom';

const variantClass: Record<ButtonVariant, string> = {
  primary:   'btn btn-primary',
  secondary: 'btn btn-secondary',
  outline:   'btn btn-outline',
  danger:    'btn btn-danger',
  ghost:     'btn-ghost',
  icon:      'btn-icon',
  success:   'btn btn-success',
  custom:    '',
};

type ButtonAsButton = ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: undefined;
  variant?: ButtonVariant;
  children: ReactNode;
};

type ButtonAsLink = LinkProps & {
  href: string;
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
};

type ButtonProps = ButtonAsButton | ButtonAsLink;

export default function Button({
  variant = 'primary',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const classes = `${variantClass[variant]} ${className}`.trim();

  if (props.href !== undefined) {
    const { href, ...linkProps } = props as ButtonAsLink;
    return (
      <Link href={href} className={classes} {...linkProps}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(props as ButtonAsButton)}>
      {children}
    </button>
  );
}
