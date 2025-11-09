import { z } from 'zod';
import { DESCRIPTION_MIN_LENGTH, DESCRIPTION_MAX_LENGTH, LOCATION_MAX_LENGTH, CATEGORY_NAME_MAX_LENGTH } from '../constants';

// ============ Zod Schemas ============

// 日志表单验证
export const logFormSchema = z.object({
  startTime: z.string().min(1, '请选择开始时间'),
  endTime: z.string().optional(),
  categoryIds: z.array(z.string()).min(1, '请至少选择一个分类'),
  description: z
    .string()
    .min(DESCRIPTION_MIN_LENGTH, `描述至少需要${DESCRIPTION_MIN_LENGTH}个字符`)
    .max(DESCRIPTION_MAX_LENGTH, `描述最多${DESCRIPTION_MAX_LENGTH}个字符`)
    .refine((val) => val.trim().length > 0, '描述不能为空或仅包含空格'),
  location: z
    .string()
    .max(LOCATION_MAX_LENGTH, `地点最多${LOCATION_MAX_LENGTH}个字符`)
    .optional(),
});

// 分类表单验证
export const categoryFormSchema = z.object({
  name: z
    .string()
    .min(1, '分类名称不能为空')
    .max(CATEGORY_NAME_MAX_LENGTH, `分类名称最多${CATEGORY_NAME_MAX_LENGTH}个字符`)
    .refine((val) => val.trim().length > 0, '分类名称不能为空或仅包含空格'),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, '请选择有效的颜色'),
  emoji: z.string().optional(),
});

// ============ 自定义验证函数 ============

/**
 * 验证时间范围是否有效
 * @param startTime 开始时间
 * @param endTime 结束时间
 * @returns 是否有效
 */
export function validateTimeRange(startTime: string, endTime: string): boolean {
  const start = new Date(startTime);
  const end = new Date(endTime);
  return end > start;
}

/**
 * 验证描述长度
 * @param description 描述
 * @returns 是否有效
 */
export function validateDescription(description: string): {
  isValid: boolean;
  error?: string;
} {
  const trimmed = description.trim();

  if (trimmed.length === 0) {
    return {
      isValid: false,
      error: '描述不能为空',
    };
  }

  if (trimmed.length < DESCRIPTION_MIN_LENGTH) {
    return {
      isValid: false,
      error: `描述至少需要${DESCRIPTION_MIN_LENGTH}个字符`,
    };
  }

  if (trimmed.length > DESCRIPTION_MAX_LENGTH) {
    return {
      isValid: false,
      error: `描述最多${DESCRIPTION_MAX_LENGTH}个字符`,
    };
  }

  return { isValid: true };
}

/**
 * 验证地点
 * @param location 地点
 * @returns 是否有效
 */
export function validateLocation(location?: string): {
  isValid: boolean;
  error?: string;
} {
  if (!location) {
    return { isValid: true };
  }

  if (location.length > LOCATION_MAX_LENGTH) {
    return {
      isValid: false,
      error: `地点最多${LOCATION_MAX_LENGTH}个字符`,
    };
  }

  return { isValid: true };
}

/**
 * 验证分类名称
 * @param name 分类名称
 * @returns 是否有效
 */
export function validateCategoryName(name: string): {
  isValid: boolean;
  error?: string;
} {
  const trimmed = name.trim();

  if (trimmed.length === 0) {
    return {
      isValid: false,
      error: '分类名称不能为空',
    };
  }

  if (trimmed.length > CATEGORY_NAME_MAX_LENGTH) {
    return {
      isValid: false,
      error: `分类名称最多${CATEGORY_NAME_MAX_LENGTH}个字符`,
    };
  }

  return { isValid: true };
}

/**
 * 验证颜色格式
 * @param color 颜色（HEX格式）
 * @returns 是否有效
 */
export function validateColor(color: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(color);
}

/**
 * 验证日期格式
 * @param dateStr 日期字符串
 * @returns 是否有效
 */
export function validateDate(dateStr: string): boolean {
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}

/**
 * 获取字符计数（用于显示剩余字符数）
 * @param text 文本
 * @param maxLength 最大长度
 * @returns 计数信息
 */
export function getCharacterCount(text: string, maxLength: number): {
  current: number;
  max: number;
  remaining: number;
  isOverLimit: boolean;
} {
  const current = text.length;
  const remaining = maxLength - current;

  return {
    current,
    max: maxLength,
    remaining,
    isOverLimit: current > maxLength,
  };
}
