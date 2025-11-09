import React, { useState, useRef, useEffect } from 'react';
import { Badge } from '../common';
import type { Category } from '../../types';

interface CategorySelectorProps {
  categories: Category[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  maxSelections?: number;
  placeholder?: string;
  error?: string;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedIds,
  onChange,
  maxSelections = 3,
  placeholder = '选择分类（最多3个）',
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedCategories = categories.filter((cat) => selectedIds.includes(cat.id));
  const availableCategories = categories.filter((cat) => !selectedIds.includes(cat.id));

  const handleToggleCategory = (categoryId: string) => {
    if (selectedIds.includes(categoryId)) {
      onChange(selectedIds.filter((id) => id !== categoryId));
    } else if (selectedIds.length < maxSelections) {
      onChange([...selectedIds, categoryId]);
    }
  };

  const handleRemoveCategory = (categoryId: string) => {
    onChange(selectedIds.filter((id) => id !== categoryId));
  };

  return (
    <div ref={containerRef} className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        分类标签
        <span className="text-red-500 ml-1">*</span>
      </label>

      {/* Selected Categories */}
      <div
        className={`
          min-h-[42px] px-3 py-2 border rounded-lg cursor-pointer
          transition-all duration-200
          ${isOpen ? 'border-primary ring-2 ring-primary' : 'border-gray-300'}
          ${error ? 'border-red-500 ring-red-500' : ''}
        `}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedCategories.length === 0 ? (
          <span className="text-gray-400 text-sm">{placeholder}</span>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map((category) => (
              <Badge
                key={category.id}
                color={category.color}
                variant="subtle"
                onRemove={() => handleRemoveCategory(category.id)}
              >
                {category.icon} {category.name}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-medium max-h-60 overflow-y-auto">
          {availableCategories.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">
              {selectedIds.length >= maxSelections
                ? `已达到最大选择数量（${maxSelections}个）`
                : '没有更多分类可选'}
            </div>
          ) : (
            availableCategories.map((category) => (
              <div
                key={category.id}
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors flex items-center gap-3"
                onClick={() => {
                  handleToggleCategory(category.id);
                  if (selectedIds.length + 1 >= maxSelections) {
                    setIsOpen(false);
                  }
                }}
              >
                <span className="text-2xl">{category.icon}</span>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{category.name}</div>
                  {category.description && (
                    <div className="text-sm text-gray-500">{category.description}</div>
                  )}
                </div>
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
              </div>
            ))
          )}
        </div>
      )}

      {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}

      <p className="mt-1 text-xs text-gray-500">
        已选择 {selectedIds.length}/{maxSelections} 个分类
        {selectedIds.length > 1 && '（时长将平均分配到各分类）'}
      </p>
    </div>
  );
};
