import type { Category, DefaultCategoryType } from '../types';
import { v4 as uuidv4 } from 'uuid';

// 预设分类配置
export const DEFAULT_CATEGORIES_CONFIG: Record<DefaultCategoryType, Omit<Category, 'id' | 'createdAt' | 'updatedAt'>> = {
  work: {
    name: '工作',
    icon: '🏢',
    color: '#FF6B6B',
    description: '工作相关任务',
    isPreset: true,
    order: 1,
  },
  entertainment: {
    name: '娱乐',
    icon: '🎮',
    color: '#4ECDC4',
    description: '娱乐休闲活动',
    isPreset: true,
    order: 2,
  },
  commute: {
    name: '通勤',
    icon: '🚗',
    color: '#FFE66D',
    description: '上下班通勤',
    isPreset: true,
    order: 3,
  },
  rest: {
    name: '休息',
    icon: '😴',
    color: '#95E1D3',
    description: '休息睡眠',
    isPreset: true,
    order: 4,
  },
  meal: {
    name: '吃饭',
    icon: '🍔',
    color: '#FF8B94',
    description: '用餐时间',
    isPreset: true,
    order: 5,
  },
  study: {
    name: '学习',
    icon: '📚',
    color: '#A8E6CF',
    description: '学习充电',
    isPreset: true,
    order: 6,
  },
  exercise: {
    name: '运动',
    icon: '💪',
    color: '#FFDAC1',
    description: '运动健身',
    isPreset: true,
    order: 7,
  },
  social: {
    name: '社交',
    icon: '👨‍👩‍👧‍👦',
    color: '#B4A7D6',
    description: '社交活动',
    isPreset: true,
    order: 8,
  },
};

// 导出PRESET_CATEGORIES作为数组
export const PRESET_CATEGORIES = Object.values(DEFAULT_CATEGORIES_CONFIG);

// 生成预设分类（带UUID和时间戳）
export const generateDefaultCategories = (): Category[] => {
  const now = new Date();

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
