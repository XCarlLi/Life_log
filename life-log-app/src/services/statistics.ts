import type { LogEntry, Category, CategoryStat, DayStatistics, WeekStatistics, MonthStatistics } from '../types';
import { logService, splitLogService, categoryService } from './db';
import { formatDate, getWeekRange, getWeekDates, getMonthDates } from '../utils/date';
import { DATE_FORMATS } from '../constants';

/**
 * 计算分类统计（使用平均分配算法）
 * @param logs 日志数组
 * @param categories 分类数组
 * @returns 分类统计数组
 */
export async function calculateCategoryStats(logs: LogEntry[], categories: Category[]): Promise<CategoryStat[]> {
  const statsMap = new Map<string, CategoryStat>();

  // 初始化所有分类的统计
  categories.forEach(category => {
    statsMap.set(category.id, {
      categoryId: category.id,
      duration: 0,
      count: 0,
    });
  });

  // 计算每个log的贡献
  logs.forEach(log => {
    if (log.status === 'completed' && log.duration && log.categoryIds.length > 0) {
      // 平均分配：总时长 / 标签数量
      const durationPerCategory = log.duration / log.categoryIds.length;

      log.categoryIds.forEach(categoryId => {
        const stat = statsMap.get(categoryId);
        if (stat) {
          stat.duration += durationPerCategory;
          stat.count += 1 / log.categoryIds.length; // 计数也按比例分配
        }
      });
    }
  });

  // 转换为数组并过滤掉duration为0的
  return Array.from(statsMap.values())
    .filter(stat => stat.duration > 0)
    .map(stat => ({
      ...stat,
      duration: Math.round(stat.duration), // 四舍五入
      count: Math.round(stat.count),
    }));
}

/**
 * 获取日统计
 * @param date 日期字符串 "2025-11-08"
 * @returns 日统计数据
 */
export async function getDayStatistics(date: string): Promise<DayStatistics> {
  // 获取当天的所有日志（包括拆分记录）
  const splitLogs = await splitLogService.getByDate(date);
  const categories = await categoryService.getAll();

  // 如果有拆分记录，使用拆分记录统计
  // 否则使用原始日志
  const logs = await logService.getByDate(date);

  let totalDuration = 0;
  let logCount = logs.filter(log => log.status === 'completed').length;

  if (splitLogs.length > 0) {
    // 使用拆分记录计算总时长
    totalDuration = splitLogs.reduce((sum, split) => sum + split.duration, 0);
  } else {
    // 使用原始日志计算（仅限当天完成的）
    totalDuration = logs
      .filter(log => log.status === 'completed' && log.duration)
      .reduce((sum, log) => sum + (log.duration || 0), 0);
  }

  // 计算分类统计
  const completedLogs = logs.filter(log => log.status === 'completed');
  const categoryStats = await calculateCategoryStats(completedLogs, categories);

  return {
    date,
    totalDuration,
    logCount,
    categoryStats,
    logs,
  };
}

/**
 * 获取周统计
 * @param date 所在周的任意日期
 * @param weekStartsOn 周起始日
 * @returns 周统计数据
 */
export async function getWeekStatistics(date: string | Date, weekStartsOn: 0 | 1 = 1): Promise<WeekStatistics> {
  const { start, end } = getWeekRange(date, weekStartsOn);
  const weekStart = formatDate(start, DATE_FORMATS.DATE);
  const weekEnd = formatDate(end, DATE_FORMATS.DATE);

  const weekDates = getWeekDates(date, weekStartsOn);
  const dayStats: DayStatistics[] = [];

  for (const d of weekDates) {
    const dateStr = formatDate(d, DATE_FORMATS.DATE);
    const dayStat = await getDayStatistics(dateStr);
    dayStats.push(dayStat);
  }

  const totalDuration = dayStats.reduce((sum, day) => sum + day.totalDuration, 0);
  const logCount = dayStats.reduce((sum, day) => sum + day.logCount, 0);

  // 合并分类统计
  const categoryStatsMap = new Map<string, CategoryStat>();
  dayStats.forEach(dayStat => {
    dayStat.categoryStats.forEach(stat => {
      const existing = categoryStatsMap.get(stat.categoryId);
      if (existing) {
        existing.duration += stat.duration;
        existing.count += stat.count;
      } else {
        categoryStatsMap.set(stat.categoryId, { ...stat });
      }
    });
  });

  const categoryStats = Array.from(categoryStatsMap.values());

  return {
    weekStart,
    weekEnd,
    totalDuration,
    logCount,
    dayStats,
    categoryStats,
  };
}

/**
 * 获取月统计
 * @param year 年份
 * @param month 月份 (1-12)
 * @returns 月统计数据
 */
export async function getMonthStatistics(year: number, month: number): Promise<MonthStatistics> {
  const date = new Date(year, month - 1, 1);
  const monthDates = getMonthDates(date);
  const dayStats: DayStatistics[] = [];

  for (const d of monthDates) {
    const dateStr = formatDate(d, DATE_FORMATS.DATE);
    const dayStat = await getDayStatistics(dateStr);
    dayStats.push(dayStat);
  }

  const totalDuration = dayStats.reduce((sum, day) => sum + day.totalDuration, 0);
  const logCount = dayStats.reduce((sum, day) => sum + day.logCount, 0);

  // 合并分类统计
  const categoryStatsMap = new Map<string, CategoryStat>();
  dayStats.forEach(dayStat => {
    dayStat.categoryStats.forEach(stat => {
      const existing = categoryStatsMap.get(stat.categoryId);
      if (existing) {
        existing.duration += stat.duration;
        existing.count += stat.count;
      } else {
        categoryStatsMap.set(stat.categoryId, { ...stat });
      }
    });
  });

  const categoryStats = Array.from(categoryStatsMap.values());

  return {
    year,
    month,
    totalDuration,
    logCount,
    dayStats,
    categoryStats,
  };
}
