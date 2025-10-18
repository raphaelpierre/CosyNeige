import { ReactNode, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  icon?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline';
}

export default function Badge({
  children,
  icon,
  size = 'md',
  variant = 'primary',
  className,
  ...props
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center gap-2 font-bold shadow-lg rounded-full';

  const variants = {
    primary: 'bg-slate-700 text-white',
    secondary: 'bg-slate-100 text-slate-900',
    outline: 'border-2 border-slate-700 text-slate-700 bg-white',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const iconSizes = {
    sm: 'text-sm',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {icon && <span className={iconSizes[size]}>{icon}</span>}
      <span>{children}</span>
    </div>
  );
}
