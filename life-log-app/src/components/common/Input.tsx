import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showCharCount?: boolean;
  maxLength?: number;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      showCharCount,
      maxLength,
      className = '',
      id,
      value,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const currentLength = typeof value === 'string' ? value.length : 0;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={`
              w-full px-3 py-2 border rounded-lg transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
              disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
              ${leftIcon ? 'pl-10' : ''}
              ${rightIcon || showCharCount ? 'pr-10' : ''}
              ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}
              ${className}
            `}
            maxLength={maxLength}
            value={value}
            {...props}
          />

          {(rightIcon || (showCharCount && maxLength)) && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              {showCharCount && maxLength ? `${currentLength}/${maxLength}` : rightIcon}
            </div>
          )}
        </div>

        {(error || helperText) && (
          <p className={`mt-1.5 text-sm ${error ? 'text-red-500' : 'text-gray-500'}`}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
