import { ReactNode, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface SectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  background?: 'white' | 'gradient' | 'slate';
  container?: 'default' | 'wide' | 'narrow' | 'full';
}

export default function Section({
  children,
  background = 'gradient',
  container = 'default',
  className,
  ...props
}: SectionProps) {
  const backgrounds = {
    white: 'bg-white',
    gradient: 'bg-gradient-to-b from-white to-slate-50',
    slate: 'bg-slate-50',
  };

  const containers = {
    default: 'max-w-6xl',
    wide: 'max-w-7xl',
    narrow: 'max-w-4xl',
    full: 'max-w-full',
  };

  return (
    <section
      className={cn(
        'py-12 md:py-16',
        backgrounds[background],
        className
      )}
      {...props}
    >
      <div className={cn(containers[container], 'mx-auto px-4 sm:px-6 lg:px-8')}>
        {children}
      </div>
    </section>
  );
}
