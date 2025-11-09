import React from 'react';

interface FloatingActionButtonProps {
  onClick: () => void;
  icon?: React.ReactNode;
  label?: string;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onClick,
  icon,
  label = '新建',
}) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 bg-primary hover:bg-primary/90 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 group"
      aria-label={label}
    >
      {/* Mobile: 只显示图标 */}
      <div className="w-14 h-14 flex items-center justify-center md:hidden">
        {icon || (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        )}
      </div>

      {/* Desktop: 显示图标+文字 */}
      <div className="hidden md:flex items-center gap-2 px-6 py-4">
        {icon || (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        )}
        <span className="font-semibold">{label}</span>
      </div>
    </button>
  );
};
