import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> {
  label: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'textarea' | 'select';
  error?: string;
  icon?: typeof LucideIcon;
  helperText?: string;
  options?: { value: string; label: string }[];
  rows?: number;
}

export const Field = React.forwardRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, FieldProps>(
  ({ 
    label,
    name,
    type = 'text',
    placeholder,
    value,
    onChange,
    error,
    icon: Icon,
    required,
    helperText,
    className,
    options,
    rows = 4,
    min,
    max,
    disabled,
    ...props
  }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);

    const inputClasses = cn(
      'appearance-none block w-full pl-10 pr-3 py-3 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 sm:text-sm',
      Icon && 'pl-10',
      error
        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
        : isFocused
        ? 'border-indigo-600'
        : 'border-gray-300',
      className
    );

    const labelClasses = cn(
      'block text-sm font-medium transition-colors duration-200',
      isFocused ? 'text-indigo-600' : 'text-gray-700'
    );

    const iconClasses = cn(
      'h-5 w-5 transition-colors duration-200',
      isFocused ? 'text-indigo-600' : 'text-gray-400'
    );

    const renderInput = () => {
      const commonProps = {
        id: name,
        name,
        value,
        onChange,
        onFocus: () => setIsFocused(true),
        onBlur: () => setIsFocused(false),
        disabled,
        placeholder,
        className: inputClasses,
        'aria-describedby': `${name}-description ${name}-error`,
        ref,
        ...props
      };

      if (type === 'textarea') {
        return (
          <textarea
            {...commonProps}
            rows={rows}
            className={cn(commonProps.className, 'pl-3')}
          />
        );
      }

      if (type === 'select' && options) {
        return (
          <select {...commonProps}>
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      }

      return (
        <input
          {...commonProps}
          type={type}
          min={min}
          max={max}
        />
      );
    };

    return (
      <div className="space-y-1">
        <label
          htmlFor={name}
          className={labelClasses}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        <div className="relative mt-1 rounded-md shadow-sm">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon className={iconClasses} />
            </div>
          )}
          
          {renderInput()}
        </div>

        {helperText && !error && (
          <p
            id={`${name}-description`}
            className="mt-1 text-sm text-gray-500"
          >
            {helperText}
          </p>
        )}

        {error && (
          <p
            id={`${name}-error`}
            className="mt-1 text-sm text-red-600"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Field.displayName = 'Field';