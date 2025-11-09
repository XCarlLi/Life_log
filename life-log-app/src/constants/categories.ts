import type { Category, DefaultCategoryType } from '../types';
import { v4 as uuidv4 } from 'uuid';

// 预设分类配置
export const DEFAULT_CATEGORIES_CONFIG: Record<DefaultCategoryType, Omit<Category, 'id' | 'createdAt' | 'updatedAt'>> = {
  work: {
    name: '工作',
    emoji: '🏢',
    color: '#FF6B6B',
    isDefault: true,
    order: 1,
  },
  entertainment: {
    name: '娱乐',
    emoji: '🎮',
    color: '#4ECDC4',
    isDefault: true,
    order: 2,
  },
  commute: {
    name: '通勤',
    emoji: '🚗',
    color: '#FFE66D',
    isDefault: true,
    order: 3,
  },
  rest: {
    name: '休息',
    emoji: '😴',
    color: '#95E1D3',
    isDefault: true,
    order: 4,
  },
  meal: {
    name: '吃饭',
    emoji: '🍔',
    color: '#FF8B94',
    isDefault: true,
    order: 5,
  },
  study: {
    name: '学习',
    emoji: '📚',
    color: '#A8E6CF',
    isDefault: true,
    order: 6,
  },
  exercise: {
    name: '运动',
    emoji: '💪',
    color: '#FFDAC1',
    isDefault: true,
    order: 7,
  },
  social: {
    name: '社交',
    emoji: '👨‍👩‍👧‍👦',
    color: '#B4A7D6',
    isDefault: true,
    order: 8,
  },
};

// 生成预设分类（带UUID和时间戳）
export const generateDefaultCategories = (): Category[] => {
  const now = new Date().toISOString();

  return Object.values(DEFAULT_CATEGORIES_CONFIG).map((config) => ({
    ...config,
    id: uuidv4(),
    createdAt: now,
    updatedAt: now,
  }));
};

// 预设分类ID映射（用于快速访问）
export const DEFAULT_CATEGORY_IDS: Record<DefaultCategoryType, string> = {
  work: 'default-work',
  entertainment: 'default-entertainment',
  commute: 'default-commute',
  rest: 'default-rest',
  meal: 'default-meal',
  study: 'default-study',
  exercise: 'default-exercise',
  social: 'default-social',
};
