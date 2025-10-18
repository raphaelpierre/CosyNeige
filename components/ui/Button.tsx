import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  fullWidth?: boolean;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  fullWidth = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-semibold transition-all duration-200 inline-flex items-center justify-center gap-2 outline-none focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-slate-700 hover:bg-slate-800 text-white shadow-md hover:shadow-lg active:scale-95',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-900 shadow-sm hover:shadow-md active:scale-95',
    outline: 'border-2 border-slate-700 text-slate-700 hover:bg-slate-700 hover:text-white shadow-sm hover:shadow-md active:scale-95',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-lg',
    md: 'px-6 py-3 text-base rounded-lg',
    lg: 'px-8 py-4 text-lg rounded-xl',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        widthClass,
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
