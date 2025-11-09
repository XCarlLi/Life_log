import type { LogEntry, SplitLogEntry } from '../types';
import { formatDate, getDayRange, getDatesInRange } from '../utils/date';
import { DATE_FORMATS } from '../constants';
import { splitLogService } from './db';

/**
 * 判断任务是否跨天
 * @param log 日志条目
 * @returns 是否跨天
 */
export function isCrossDay(log: LogEntry): boolean {
  if (!log.endTime) return false;

  const startDate = formatDate(log.startTime, DATE_FORMATS.DATE);
  const endDate = formatDate(log.endTime, DATE_FORMATS.DATE);

  return startDate !== endDate;
}

/**
 * 拆分跨天任务为多个自然日段
 * @param log 日志条目
 * @returns 拆分后的记录数组
 */
export function splitCrossDayLog(log: LogEntry): SplitLogEntry[] {
  if (!log.endTime || !isCrossDay(log)) {
    return [];
  }

  const startTime = new Date(log.startTime);
  const endTime = new Date(log.endTime);

  // 获取跨越的所有日期
  const dates = getDatesInRange(startTime, endTime);

  const splitLogs: SplitLogEntry[] = [];

  dates.forEach((date, index) => {
    const isFirst = index === 0;
    const isLast = index === dates.length - 1;

    const { start: dayStart, end: dayEnd } = getDayRange(date);

    // 确定该段的开始和结束时间
    const segmentStart = isFirst ? startTime : dayStart;
    const segmentEnd = isLast ? endTime : dayEnd;

    // 计算该段的时长（分钟）
    const duration = Math.round(
      (segmentEnd.getTime() - segmentStart.getTime()) / (1000 * 60)
    );

    // 创建拆分记录
    const splitLog: Omit<SplitLogEntry, 'id'> = {
      parentId: log.id,
      date: formatDate(date, DATE_FORMATS.DATE),
      startTime: segmentStart.toISOString(),
      endTime: segmentEnd.toISOString(),
      duration,
      categoryIds: log.categoryIds,
      description: log.description,
      location: log.location,
      isFirst,
      isLast,
    };

    splitLogs.push(splitLog as SplitLogEntry);
  });

  return splitLogs;
}

/**
 * 处理日志的跨天拆分（更新或删除拆分记录）
 * @param log 日志条目
 */
export async function handleLogSplit(log: LogEntry): Promise<void> {
  // 先删除旧的拆分记录
  await splitLogService.deleteByParentId(log.id);

  // 如果任务跨天且已完成（有endTime），创建新的拆分记录
  if (log.endTime && isCrossDay(log)) {
    const splitLogs = splitCrossDayLog(log);
    await splitLogService.bulkCreate(splitLogs);
  }
}

/**
 * 处理跨天日志（批量处理的别名）
 * @param logs 日志数组
 */
export async function handleCrossDayLogs(logs: LogEntry[]): Promise<void> {
  return await batchHandleLogSplit(logs);
}

/**
 * 处理单个跨天日志（别名）
 * @param log 日志条目
 */
export async function processCrossDayLog(log: LogEntry): Promise<void> {
  return await handleLogSplit(log);
}

/**
 * 批量处理多个日志的拆分
 * @param logs 日志数组
 */
export async function batchHandleLogSplit(logs: LogEntry[]): Promise<void> {
  for (const log of logs) {
    await handleLogSplit(log);
  }
}

/**
 * 重新计算所有日志的拆分记录
 * 用于数据迁移或修复
 */
export async function recalculateAllSplits(logs: LogEntry[]): Promise<void> {
  console.log('开始重新计算拆分记录...');

  // 清空所有拆分记录
  const allSplitLogs = await splitLogService.getByDate(''); // 获取所有
  for (const split of allSplitLogs) {
    await splitLogService.deleteByParentId(split.parentId);
  }

  // 重新计算
  await batchHandleLogSplit(logs);

  console.log('拆分记录重新计算完成');
}
