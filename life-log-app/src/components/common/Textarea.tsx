import React, { forwardRef } from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  showCharCount?: boolean;
  maxLength?: number;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      showCharCount,
      maxLength,
      resize = 'vertical',
      className = '',
      id,
      value,
      ...props
    },
    ref
  ) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const currentLength = typeof value === 'string' ? value.length : 0;

    const resizeStyles = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize',
    };

    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <label htmlFor={textareaId} className="block text-sm font-medium text-gray-700">
              {label}
              {props.required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
          {showCharCount && maxLength && (
            <span className="text-sm text-gray-500">
              {currentLength}/{maxLength}
            </span>
          )}
        </div>

        <textarea
          ref={ref}
          id={textareaId}
          className={`
            w-full px-3 py-2 border rounded-lg transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            ${resizeStyles[resize]}
            ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}
            ${className}
          `}
          maxLength={maxLength}
          value={value}
          {...props}
        />

        {(error || helperText) && (
          <p className={`mt-1.5 text-sm ${error ? 'text-red-500' : 'text-gray-500'}`}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
