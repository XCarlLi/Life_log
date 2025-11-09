import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  variant?: 'solid' | 'outline' | 'subtle';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onRemove?: () => void;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  color = '#FF8966',
  variant = 'subtle',
  size = 'md',
  className = '',
  onRemove,
}) => {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'solid':
        return {
          backgroundColor: color,
          color: '#ffffff',
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: color,
          borderColor: color,
          borderWidth: '2px',
        };
      case 'subtle':
        return {
          backgroundColor: `${color}20`, // 20% opacity
          color: color,
        };
    }
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-full font-medium
        ${sizeStyles[size]} ${className}
      `}
      style={getVariantStyles()}
    >
      {children}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 hover:opacity-70 transition-opacity"
          aria-label="Remove"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
};
