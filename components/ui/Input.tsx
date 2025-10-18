import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, fullWidth = false, className, ...props }, ref) => {
    const baseStyles = 'px-4 py-3 border rounded-lg text-base transition-all duration-200';
    const normalStyles = 'border-gray-300 focus:ring-2 focus:ring-slate-700 focus:border-transparent';
    const errorStyles = error ? 'border-red-500 focus:ring-red-500' : normalStyles;
    const widthStyles = fullWidth ? 'w-full' : '';
    const disabledStyles = 'disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60';

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            baseStyles,
            errorStyles,
            widthStyles,
            disabledStyles,
            'outline-none focus:outline-none',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
