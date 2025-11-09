import type { LogEntry, Category, CategoryStat, DayStatistics, WeekStatistics } from '../types';

/**
 * 计算分类统计（使用平均分配算法）
 */
export function calculateCategoryStats(logs: LogEntry[], categories: Category[]): CategoryStat[] {
  const categoryStatsMap = new Map<string, CategoryStat>();

  // 初始化分类统计
  categories.forEach(cat => {
    categoryStatsMap.set(cat.id, {
      categoryId: cat.id,
      categoryName: cat.name,
      categoryColor: cat.color,
      totalSeconds: 0,
      percentage: 0,
      count: 0,
    });
  });

  // 计算总时长
  let totalSeconds = 0;

  // 计算每个日志的贡献（多标签平均分配）
  logs.forEach(log => {
    if (log.endTime && log.categoryIds.length > 0) {
      const start = new Date(log.startTime).getTime();
      const end = new Date(log.endTime).getTime();
      const duration = (end - start) / 1000;
      totalSeconds += duration;

      const durationPerCategory = duration / log.categoryIds.length;

      log.categoryIds.forEach(catId => {
        const stat = categoryStatsMap.get(catId);
        if (stat) {
          stat.totalSeconds += durationPerCategory;
          stat.count += 1 / log.categoryIds.length;
        }
      });
    }
  });

  // 计算百分比并过滤
  return Array.from(categoryStatsMap.values())
    .map(stat => ({
      ...stat,
      percentage: totalSeconds > 0 ? (stat.totalSeconds / totalSeconds) * 100 : 0,
      count: Math.round(stat.count),
    }))
    .filter(stat => stat.totalSeconds > 0);
}

/**
 * 计算日统计数据
 */
export function calculateDayStatistics(logs: LogEntry[], categories: Category[]): DayStatistics {
  const totalSeconds = logs.reduce((sum, log) => {
    if (log.endTime) {
      const start = new Date(log.startTime).getTime();
      const end = new Date(log.endTime).getTime();
      return sum + (end - start) / 1000;
    }
    return sum;
  }, 0);

  const categoryStatsMap = new Map<string, CategoryStat>();

  // 初始化分类统计
  categories.forEach(cat => {
    categoryStatsMap.set(cat.id, {
      categoryId: cat.id,
      categoryName: cat.name,
      categoryColor: cat.color,
      totalSeconds: 0,
      percentage: 0,
      count: 0,
    });
  });

  // 计算每个日志的贡献（多标签平均分配）
  logs.forEach(log => {
    if (log.endTime && log.categoryIds.length > 0) {
      const start = new Date(log.startTime).getTime();
      const end = new Date(log.endTime).getTime();
      const duration = (end - start) / 1000;
      const durationPerCategory = duration / log.categoryIds.length;

      log.categoryIds.forEach(catId => {
        const stat = categoryStatsMap.get(catId);
        if (stat) {
          stat.totalSeconds += durationPerCategory;
          stat.count += 1 / log.categoryIds.length;
        }
      });
    }
  });

  // 计算百分比并过滤
  const categoryStats = Array.from(categoryStatsMap.values())
    .map(stat => ({
      ...stat,
      percentage: totalSeconds > 0 ? (stat.totalSeconds / totalSeconds) * 100 : 0,
      count: Math.round(stat.count),
    }))
    .filter(stat => stat.totalSeconds > 0);

  return {
    date: logs.length > 0 ? logs[0].startTime.split('T')[0] : new Date().toISOString().split('T')[0],
    totalSeconds,
    logCount: logs.length,
    categoryStats,
    logs,
  };
}

/**
 * 计算周统计数据
 */
export function calculateWeekStatistics(logs: LogEntry[], categories: Category[], weekStart: Date): WeekStatistics {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  // 按日期分组
  const logsByDay = new Map<string, LogEntry[]>();
  const dailyStats: DayStatistics[] = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + i);
    const dateKey = date.toISOString().split('T')[0];
    logsByDay.set(dateKey, []);
  }

  // 分配日志到对应日期
  logs.forEach(log => {
    const dateKey = log.startTime.split('T')[0];
    const dayLogs = logsByDay.get(dateKey);
    if (dayLogs) {
      dayLogs.push(log);
    }
  });

  // 计算每日统计
  logsByDay.forEach((dayLogs) => {
    dailyStats.push(calculateDayStatistics(dayLogs, categories));
  });

  const totalSeconds = dailyStats.reduce((sum, day) => sum + day.totalSeconds, 0);
  const averagePerDay = totalSeconds / 7;

  // 汇总分类统计
  const categoryStatsMap = new Map<string, CategoryStat>();
  categories.forEach(cat => {
    categoryStatsMap.set(cat.id, {
      categoryId: cat.id,
      categoryName: cat.name,
      categoryColor: cat.color,
      totalSeconds: 0,
      percentage: 0,
      count: 0,
    });
  });

  dailyStats.forEach(day => {
    day.categoryStats.forEach(stat => {
      const weekStat = categoryStatsMap.get(stat.categoryId);
      if (weekStat) {
        weekStat.totalSeconds += stat.totalSeconds;
        weekStat.count += stat.count;
      }
    });
  });

  const categoryStats = Array.from(categoryStatsMap.values())
    .map(stat => ({
      ...stat,
      percentage: totalSeconds > 0 ? (stat.totalSeconds / totalSeconds) * 100 : 0,
    }))
    .filter(stat => stat.totalSeconds > 0);

  return {
    weekStart: weekStart.toISOString().split('T')[0],
    weekEnd: weekEnd.toISOString().split('T')[0],
    totalSeconds,
    averagePerDay,
    logCount: logs.length,
    dailyStats,
    categoryStats,
  };
}
