import { MINUTES_PER_HOUR, HOURS_PER_DAY } from '../constants';

// ============ 时长格式化 ============
/**
 * 将分钟数格式化为易读的时长字符串
 * @param minutes 分钟数
 * @returns 格式化后的字符串，例如："2h 30m"、"45m"、"1d 3h"
 */
export function formatDuration(minutes: number): string {
  if (minutes < 1) {
    return '0m';
  }

  const days = Math.floor(minutes / (MINUTES_PER_HOUR * HOURS_PER_DAY));
  const hours = Math.floor((minutes % (MINUTES_PER_HOUR * HOURS_PER_DAY)) / MINUTES_PER_HOUR);
  const mins = Math.floor(minutes % MINUTES_PER_HOUR);

  const parts: string[] = [];

  if (days > 0) {
    parts.push(`${days}天`);
  }
  if (hours > 0) {
    parts.push(`${hours}小时`);
  }
  if (mins > 0 || parts.length === 0) {
    parts.push(`${mins}分钟`);
  }

  return parts.join(' ');
}

/**
 * 将分钟数格式化为简短的时长字符串
 * @param minutes 分钟数
 * @returns 格式化后的字符串，例如："2h 30m"、"45m"
 */
export function formatDurationShort(minutes: number): string {
  if (minutes < 1) {
    return '0m';
  }

  const hours = Math.floor(minutes / MINUTES_PER_HOUR);
  const mins = Math.floor(minutes % MINUTES_PER_HOUR);

  if (hours > 0 && mins > 0) {
    return `${hours}h ${mins}m`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else {
    return `${mins}m`;
  }
}

/**
 * 将分钟数格式化为小时（保留1位小数）
 * @param minutes 分钟数
 * @returns 格式化后的字符串，例如："2.5h"
 */
export function formatDurationHours(minutes: number): string {
  const hours = minutes / MINUTES_PER_HOUR;
  return `${hours.toFixed(1)}h`;
}

// ============ 数字格式化 ============
/**
 * 格式化百分比
 * @param value 0-1之间的数值
 * @param decimals 小数位数，默认1
 * @returns 格式化后的百分比字符串，例如："85.5%"
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * 格式化数字（添加千位分隔符）
 * @param value 数字
 * @returns 格式化后的字符串，例如："1,234"
 */
export function formatNumber(value: number): string {
  return value.toLocaleString('zh-CN');
}

// ============ 文本处理 ============
/**
 * 截断文本
 * @param text 原始文本
 * @param maxLength 最大长度
 * @param suffix 后缀，默认"..."
 * @returns 截断后的文本
 */
export function truncateText(text: string, maxLength: number, suffix: string = '...'): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * 首字母大写
 * @param text 原始文本
 * @returns 首字母大写的文本
 */
export function capitalize(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// ============ 颜色处理 ============
/**
 * 将HEX颜色转换为RGBA
 * @param hex HEX颜色，例如："#FF6B6B"
 * @param alpha 透明度，0-1之间
 * @returns RGBA颜色字符串
 */
export function hexToRgba(hex: string, alpha: number = 1): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * 判断颜色是否为深色
 * @param hex HEX颜色
 * @returns 是否为深色
 */
export function isDarkColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128;
}

// ============ 数组格式化 ============
/**
 * 将数组格式化为逗号分隔的字符串
 * @param items 数组
 * @param separator 分隔符，默认"、"
 * @returns 格式化后的字符串
 */
export function formatList(items: string[], separator: string = '、'): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  return items.join(separator);
}

// ============ 文件大小格式化 ============
/**
 * 格式化文件大小
 * @param bytes 字节数
 * @returns 格式化后的字符串，例如："1.5 MB"
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

// ============ CSV转义 ============
/**
 * 转义CSV字段
 * @param value 字段值
 * @returns 转义后的值
 */
export function escapeCsvField(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
