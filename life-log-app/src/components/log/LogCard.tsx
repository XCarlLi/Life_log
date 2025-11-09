import React, { useState } from 'react';
import { Card, CardContent, Badge, Button } from '../common';
import { formatDuration, formatDateTime } from '../../utils/format';
import type { LogEntry, Category } from '../../types';

interface LogCardProps {
  log: LogEntry;
  categories: Category[];
  onEdit?: (log: LogEntry) => void;
  onDelete?: (id: string) => void;
  showDate?: boolean;
  compact?: boolean;
}

export const LogCard: React.FC<LogCardProps> = ({
  log,
  categories,
  onEdit,
  onDelete,
  showDate = true,
  compact = false,
}) => {
  const [showActions, setShowActions] = useState(false);

  const selectedCategories = categories.filter((cat) =>
    log.categoryIds.includes(cat.id)
  );

  const duration = log.endTime
    ? Math.floor((log.endTime.getTime() - log.startTime.getTime()) / 1000)
    : 0;

  const isCrossDay = log.endTime &&
    log.startTime.toDateString() !== log.endTime.toDateString();

  return (
    <Card
      hover
      padding={compact ? 'sm' : 'md'}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <CardContent>
        <div className="flex items-start justify-between gap-4">
          {/* Task Info */}
          <div className="flex-1 min-w-0">
            {showDate && (
              <div className="text-xs text-gray-500 mb-1">
                {formatDateTime(log.startTime, 'date')}
              </div>
            )}

            <h4 className={`font-semibold text-gray-900 mb-2 ${compact ? 'text-sm' : 'text-base'} line-clamp-2`}>
              {log.description}
            </h4>

            {/* Categories */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              {selectedCategories.map((category) => (
                <Badge
                  key={category.id}
                  color={category.color}
                  variant="subtle"
                  size={compact ? 'sm' : 'md'}
                >
                  {category.icon} {category.name}
                </Badge>
              ))}
            </div>

            {/* Time & Location */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>
                  {log.startTime.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                  {' - '}
                  {log.endTime
                    ? log.endTime.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
                    : '进行中'}
                </span>
              </div>

              {log.location && (
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                  </svg>
                  <span>{log.location}</span>
                </div>
              )}
            </div>

            {isCrossDay && (
              <div className="mt-2 text-xs text-yellow-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                跨天任务（已按自然日拆分统计）
              </div>
            )}
          </div>

          {/* Duration & Actions */}
          <div className="flex flex-col items-end gap-2">
            <div className={`font-bold text-primary ${compact ? 'text-base' : 'text-lg'}`}>
              {formatDuration(duration)}
            </div>

            {showActions && (onEdit || onDelete) && (
              <div className="flex gap-1">
                {onEdit && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEdit(log)}
                  >
                    编辑
                  </Button>
                )}
                {onDelete && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDelete(log.id)}
                  >
                    删除
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
