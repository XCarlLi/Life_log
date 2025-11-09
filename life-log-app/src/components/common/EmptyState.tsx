import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* Icon */}
      {icon && (
        <div className="text-gray-300 mb-6">
          {icon}
        </div>
      )}

      {/* Title */}
      <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="text-gray-500 text-center mb-6 max-w-md">
          {description}
        </p>
      )}

      {/* Action Button */}
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary" size="lg">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
