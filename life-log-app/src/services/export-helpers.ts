import type { LogEntry } from '../types';
import { formatDateTime } from '../utils/format';

/**
 * 导出日志为CSV格式
 */
export function exportToCSV(logs: LogEntry[]): void {
  const headers = ['开始时间', '结束时间', '描述', '分类', '地点', '时长（秒）'];
  const csvRows = [headers.join(',')];

  logs.forEach(log => {
    const duration = log.endTime
      ? (new Date(log.endTime).getTime() - new Date(log.startTime).getTime()) / 1000
      : 0;

    const description = log.description.replace(/"/g, '""');

    const row = [
      formatDateTime(log.startTime, 'datetime'),
      log.endTime ? formatDateTime(log.endTime, 'datetime') : '进行中',
      `"${description}"`,
      log.categoryIds.join(';'),
      log.location || '',
      duration.toString(),
    ];
    csvRows.push(row.join(','));
  });

  const csvContent = csvRows.join('\n');
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `life-log-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * 导出日志为JSON格式
 */
export function exportToJSON(logs: LogEntry[]): void {
  const exportData = {
    exportDate: new Date().toISOString(),
    version: '1.0.0',
    totalLogs: logs.length,
    logs: logs.map(log => ({
      ...log,
      // Times are already in ISO string format
    })),
  };

  const jsonContent = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `life-log-${new Date().toISOString().split('T')[0]}.json`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const exportService = {
  exportToCSV,
  exportToJSON,
};
