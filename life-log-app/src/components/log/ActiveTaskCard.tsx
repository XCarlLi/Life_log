import React, { useState, useEffect } from 'react';
import { Card, CardContent, Badge, Button } from '../common';
import { formatDuration } from '../../utils/format';
import type { LogEntry, Category } from '../../types';

interface ActiveTaskCardProps {
  log: LogEntry;
  categories: Category[];
  onEnd: (id: string, location?: string) => void;
  onEdit: (log: LogEntry) => void;
  isEnding?: boolean;
}

export const ActiveTaskCard: React.FC<ActiveTaskCardProps> = ({
  log,
  categories,
  onEnd,
  onEdit,
  isEnding = false,
}) => {
  const [elapsed, setElapsed] = useState(0);
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [endLocation, setEndLocation] = useState(log.location || '');

  useEffect(() => {
    const updateElapsed = () => {
      const now = new Date();
      const diff = now.getTime() - new Date(log.startTime).getTime();
      setElapsed(Math.floor(diff / 1000));
    };

    updateElapsed();
    const interval = setInterval(updateElapsed, 1000);

    return () => clearInterval(interval);
  }, [log.startTime]);

  const selectedCategories = categories.filter((cat) =>
    log.categoryIds.includes(cat.id)
  );

  const handleEndTask = () => {
    if (!log.location && !showLocationInput) {
      setShowLocationInput(true);
    } else {
      onEnd(log.id, endLocation || undefined);
    }
  };

  const hours = Math.floor(elapsed / 3600);
  const isLongTask = hours >= 6;

  return (
    <Card
      className={`${isLongTask ? 'border-2 border-yellow-400 bg-yellow-50/50' : ''}`}
      hover
    >
      <CardContent>
        <div className="flex items-start justify-between gap-4">
          {/* Task Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="relative">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping" />
              </div>
              <span className="text-sm text-gray-500">进行中</span>
            </div>

            <h4 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {log.description}
            </h4>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedCategories.map((category) => (
                <Badge key={category.id} color={category.color} variant="subtle" size="sm">
                  {category.icon} {category.name}
                </Badge>
              ))}
            </div>

            {/* Location */}
            {log.location && (
              <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>{log.location}</span>
              </div>
            )}

            {/* Start Time */}
            <div className="text-sm text-gray-500">
              开始于 {new Date(log.startTime).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>

          {/* Timer & Actions */}
          <div className="flex flex-col items-end gap-3">
            <div className="text-right">
              <div className={`text-2xl font-bold ${isLongTask ? 'text-yellow-600' : 'text-primary'}`}>
                {formatDuration(elapsed)}
              </div>
              {isLongTask && (
                <div className="text-xs text-yellow-600 mt-1">⚠️ 任务已超过6小时</div>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(log)}
              >
                编辑
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={handleEndTask}
                isLoading={isEnding}
              >
                结束
              </Button>
            </div>
          </div>
        </div>

        {/* Location Input (when ending without location) */}
        {showLocationInput && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <input
              type="text"
              placeholder="在哪里结束的？（可选）"
              value={endLocation}
              onChange={(e) => setEndLocation(e.target.value)}
              maxLength={50}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              autoFocus
            />
            <div className="flex gap-2 mt-2">
              <Button
                size="sm"
                variant="primary"
                onClick={() => onEnd(log.id, endLocation || undefined)}
                isLoading={isEnding}
                className="flex-1"
              >
                确认结束
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowLocationInput(false)}
              >
                取消
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
