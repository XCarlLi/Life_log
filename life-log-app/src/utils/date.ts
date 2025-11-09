import {
  format,
  parse,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  addDays,
  subDays,
  differenceInMinutes,
  differenceInDays,
  isToday,
  isYesterday,
  isTomorrow,
} from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { DATE_FORMATS } from '../constants';

// ============ 日期格式化 ============
export function formatDate(date: Date | string, formatStr: string = DATE_FORMATS.DATE): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, formatStr, { locale: zhCN });
}

export function formatDateTime(date: Date | string): string {
  return formatDate(date, DATE_FORMATS.DATETIME);
}

export function formatTime(date: Date | string): string {
  return formatDate(date, DATE_FORMATS.TIME);
}

export function formatDisplayDate(date: Date | string): string {
  return formatDate(date, DATE_FORMATS.DISPLAY_DATE);
}

export function formatDisplayDateTime(date: Date | string): string {
  return formatDate(date, DATE_FORMATS.DISPLAY_DATETIME);
}

// ============ 日期解析 ============
export function parseDate(dateStr: string, formatStr: string = DATE_FORMATS.DATE): Date {
  return parse(dateStr, formatStr, new Date());
}

// ============ 日期范围 ============
export function getDayRange(date: Date | string): { start: Date; end: Date } {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return {
    start: startOfDay(dateObj),
    end: endOfDay(dateObj),
  };
}

export function getWeekRange(date: Date | string, weekStartsOn: 0 | 1 = 1): { start: Date; end: Date } {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return {
    start: startOfWeek(dateObj, { weekStartsOn }),
    end: endOfWeek(dateObj, { weekStartsOn }),
  };
}

export function getMonthRange(date: Date | string): { start: Date; end: Date } {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return {
    start: startOfMonth(dateObj),
    end: endOfMonth(dateObj),
  };
}

// ============ 日期计算 ============
export function calculateDuration(startTime: Date | string, endTime: Date | string): number {
  const start = typeof startTime === 'string' ? new Date(startTime) : startTime;
  const end = typeof endTime === 'string' ? new Date(endTime) : endTime;
  return differenceInMinutes(end, start);
}

export function getDaysBetween(date1: Date | string, date2: Date | string): number {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  return Math.abs(differenceInDays(d2, d1));
}

// ============ 日期判断 ============
export function isSameDay(date1: Date | string, date2: Date | string): boolean {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  return formatDate(d1, DATE_FORMATS.DATE) === formatDate(d2, DATE_FORMATS.DATE);
}

export function isDateToday(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return isToday(dateObj);
}

export function isDateYesterday(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return isYesterday(dateObj);
}

export function isDateTomorrow(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return isTomorrow(dateObj);
}

// ============ 相对日期描述 ============
export function getRelativeDateLabel(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isDateToday(dateObj)) {
    return '今天';
  } else if (isDateYesterday(dateObj)) {
    return '昨天';
  } else if (isDateTomorrow(dateObj)) {
    return '明天';
  }

  return formatDisplayDate(dateObj);
}

// ============ 获取日期数组 ============
export function getDatesInRange(startDate: Date | string, endDate: Date | string): Date[] {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

  const dates: Date[] = [];
  let currentDate = start;

  while (currentDate <= end) {
    dates.push(new Date(currentDate));
    currentDate = addDays(currentDate, 1);
  }

  return dates;
}

// ============ 获取周的日期数组 ============
export function getWeekDates(date: Date | string, weekStartsOn: 0 | 1 = 1): Date[] {
  const { start } = getWeekRange(date, weekStartsOn);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

// ============ 获取月的日期数组 ============
export function getMonthDates(date: Date | string): Date[] {
  const { start, end } = getMonthRange(date);
  return getDatesInRange(start, end);
}

// ============ 今天、昨天、明天 ============
export function getToday(): string {
  return formatDate(new Date(), DATE_FORMATS.DATE);
}

export function getYesterday(): string {
  return formatDate(subDays(new Date(), 1), DATE_FORMATS.DATE);
}

export function getTomorrow(): string {
  return formatDate(addDays(new Date(), 1), DATE_FORMATS.DATE);
}

// ============ ISO 8601格式 ============
export function toISOString(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toISOString();
}

export function fromISOString(isoStr: string): Date {
  return new Date(isoStr);
}
