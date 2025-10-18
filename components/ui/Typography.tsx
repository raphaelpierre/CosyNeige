import { ReactNode, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  gradient?: boolean;
}

export function H1({ children, className, gradient = false, ...props }: HeadingProps) {
  const baseStyles = 'text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight';
  const gradientStyles = gradient ? 'bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent' : '';

  return (
    <h1 className={cn(baseStyles, gradientStyles, className)} {...props}>
      {children}
    </h1>
  );
}

export function H2({ children, className, gradient = false, ...props }: HeadingProps) {
  const baseStyles = 'text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight';
  const gradientStyles = gradient ? 'bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent' : '';

  return (
    <h2 className={cn(baseStyles, gradientStyles, className)} {...props}>
      {children}
    </h2>
  );
}

export function H3({ children, className, gradient = false, ...props }: HeadingProps) {
  const baseStyles = 'text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight';
  const gradientStyles = gradient ? 'bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent' : '';

  return (
    <h3 className={cn(baseStyles, gradientStyles, className)} {...props}>
      {children}
    </h3>
  );
}

export function H4({ children, className, ...props }: HeadingProps) {
  return (
    <h4 className={cn('text-xl md:text-2xl font-bold text-slate-900 leading-tight', className)} {...props}>
      {children}
    </h4>
  );
}

interface TextProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
  variant?: 'body' | 'small' | 'large';
  muted?: boolean;
}

export function Text({ children, variant = 'body', muted = false, className, ...props }: TextProps) {
  const variants = {
    large: 'text-lg md:text-xl',
    body: 'text-base md:text-lg',
    small: 'text-sm md:text-base',
  };

  const colorStyles = muted ? 'text-gray-500' : 'text-gray-600';

  return (
    <p className={cn(variants[variant], colorStyles, 'leading-relaxed', className)} {...props}>
      {children}
    </p>
  );
}
