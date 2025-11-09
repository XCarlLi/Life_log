import React from 'react';
import { LogCard } from './LogCard';
import type { LogEntry, Category } from '../../types';

interface LogListProps {
  logs: LogEntry[];
  categories: Category[];
  onEdit?: (log: LogEntry) => void;
  onDelete?: (id: string) => void;
  groupByDate?: boolean;
  compact?: boolean;
  emptyMessage?: string;
}

export const LogList: React.FC<LogListProps> = ({
  logs,
  categories,
  onEdit,
  onDelete,
  groupByDate = true,
  compact = false,
  emptyMessage = '暂无记录',
}) => {
  if (logs.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="w-16 h-16 mx-auto text-gray-300 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <p className="text-gray-500 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  if (!groupByDate) {
    return (
      <div className="space-y-3">
        {logs.map((log) => (
          <LogCard
            key={log.id}
            log={log}
            categories={categories}
            onEdit={onEdit}
            onDelete={onDelete}
            showDate
            compact={compact}
          />
        ))}
      </div>
    );
  }

  // Group logs by date
  const groupedLogs = logs.reduce((acc, log) => {
    const dateKey = log.startTime.toDateString();
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(log);
    return acc;
  }, {} as Record<string, LogEntry[]>);

  const sortedDates = Object.keys(groupedLogs).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className="space-y-6">
      {sortedDates.map((dateKey) => {
        const dateLogs = groupedLogs[dateKey];
        const date = new Date(dateKey);
        const isToday = date.toDateString() === new Date().toDateString();
        const isYesterday =
          date.toDateString() ===
          new Date(Date.now() - 86400000).toDateString();

        let dateLabel = date.toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long',
        });

        if (isToday) dateLabel = `今天 · ${dateLabel}`;
        else if (isYesterday) dateLabel = `昨天 · ${dateLabel}`;

        // Calculate total duration for the day
        const totalDuration = dateLogs.reduce((sum, log) => {
          if (log.endTime) {
            return sum + (log.endTime.getTime() - log.startTime.getTime()) / 1000;
          }
          return sum;
        }, 0);

        return (
          <div key={dateKey}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">{dateLabel}</h3>
              <div className="text-sm text-gray-500">
                共 {dateLogs.length} 条记录 · 总时长{' '}
                {Math.floor(totalDuration / 3600)}小时{Math.floor((totalDuration % 3600) / 60)}分钟
              </div>
            </div>
            <div className="space-y-3">
              {dateLogs.map((log) => (
                <LogCard
                  key={log.id}
                  log={log}
                  categories={categories}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  showDate={false}
                  compact={compact}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
