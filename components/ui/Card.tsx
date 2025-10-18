import { ReactNode, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export default function Card({
  children,
  hover = true,
  padding = 'md',
  className,
  ...props
}: CardProps) {
  const baseStyles = 'bg-white rounded-xl shadow-lg border border-gray-100 transition-all duration-200';

  const hoverStyles = hover ? 'hover:shadow-xl hover:-translate-y-0.5' : '';

  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6 md:p-8',
    lg: 'p-8 md:p-10',
  };

  return (
    <div
      className={cn(
        baseStyles,
        hoverStyles,
        paddingStyles[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
