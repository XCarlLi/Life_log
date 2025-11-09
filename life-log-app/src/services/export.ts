import type { LogEntry, Category, ExportData } from '../types';
import { formatDate, formatDateTime } from '../utils/date';
import { formatDuration, escapeCsvField } from '../utils/format';
import { calculateCategoryStats } from './statistics-helpers';

/**
 * 导出为CSV格式
 * @param logs 日志数组
 * @param categories 分类数组
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @returns CSV字符串
 */
export async function exportToCsv(
  logs: LogEntry[],
  categories: Category[]
): Promise<string> {
  // CSV表头
  const headers = ['开始时间', '结束时间', '时长(分钟)', '时长(格式化)', '分类', '地点', '描述'];
  const rows: string[] = [headers.map(h => escapeCsvField(h)).join(',')];

  // 创建分类ID到名称的映射
  const categoryMap = new Map(categories.map(c => [c.id, c.name]));

  // 处理每条日志
  logs.forEach(log => {
    if (log.endTime) {
      const duration = Math.floor((new Date(log.endTime).getTime() - new Date(log.startTime).getTime()) / (1000 * 60));
      const row = [
        formatDateTime(log.startTime),
        log.endTime ? formatDateTime(log.endTime) : '',
        duration.toString(),
        formatDuration(duration * 60), // Convert minutes to seconds
        log.categoryIds.map(id => categoryMap.get(id) || '未知').join(';'),
        log.location || '',
        log.description,
      ];

      rows.push(row.map(cell => escapeCsvField(cell)).join(','));
    }
  });

  return rows.join('\n');
}

/**
 * 导出为JSON格式
 * @param logs 日志数组
 * @param categories 分类数组
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @returns JSON字符串
 */
export async function exportToJson(
  logs: LogEntry[],
  categories: Category[],
  startDate: string,
  endDate: string
): Promise<string> {
  const completedLogs = logs.filter(log => log.endTime);
  const categoryStats = calculateCategoryStats(completedLogs, categories);

  const totalDuration = completedLogs.reduce((sum, log) => {
    if (log.endTime) {
      return sum + Math.floor((new Date(log.endTime).getTime() - new Date(log.startTime).getTime()) / (1000 * 60));
    }
    return sum;
  }, 0);

  const exportData: ExportData = {
    exportDate: new Date().toISOString(),
    dateRange: {
      start: startDate,
      end: endDate,
    },
    logs: completedLogs,
    summary: {
      totalDuration,
      logCount: completedLogs.length,
      categoryStats,
    },
  };

  return JSON.stringify(exportData, null, 2);
}

/**
 * 下载文件
 * @param content 文件内容
 * @param filename 文件名
 * @param mimeType MIME类型
 */
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * 导出日志
 * @param logs 日志数组
 * @param categories 分类数组
 * @param format 导出格式
 * @param startDate 开始日期
 * @param endDate 结束日期
 */
export async function exportLogs(
  logs: LogEntry[],
  categories: Category[],
  format: 'csv' | 'json',
  startDate: string,
  endDate: string
): Promise<void> {
  const timestamp = formatDate(new Date(), 'yyyyMMdd_HHmmss');
  const filename = `life-log_${startDate}_${endDate}_${timestamp}.${format}`;

  if (format === 'csv') {
    const csvContent = await exportToCsv(logs, categories);
    downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
  } else {
    const jsonContent = await exportToJson(logs, categories, startDate, endDate);
    downloadFile(jsonContent, filename, 'application/json');
  }
}
