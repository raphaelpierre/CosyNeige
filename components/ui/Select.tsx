import { SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  options?: Array<{ value: string | number; label: string }>;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, fullWidth = false, options, children, className, ...props }, ref) => {
    const baseStyles = 'px-4 py-3 border rounded-lg text-base transition-all duration-200 bg-white';
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
        <select
          ref={ref}
          className={cn(
            baseStyles,
            errorStyles,
            widthStyles,
            disabledStyles,
            'outline-none focus:outline-none cursor-pointer',
            className
          )}
          {...props}
        >
          {options ? (
            options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))
          ) : (
            children
          )}
        </select>
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
