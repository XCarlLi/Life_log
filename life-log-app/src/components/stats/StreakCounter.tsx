import React from 'react';
import { Card, CardContent } from '../common';

interface StreakCounterProps {
  currentStreak: number;
  longestStreak: number;
}

export const StreakCounter: React.FC<StreakCounterProps> = ({
  currentStreak,
  longestStreak,
}) => {
  return (
    <Card>
      <CardContent>
        <div className="text-center">
          <div className="text-6xl mb-4">🔥</div>
          <div className="mb-4">
            <div className="text-4xl font-bold text-primary mb-1">{currentStreak}</div>
            <div className="text-sm text-gray-600">连续记录天数</div>
          </div>
          <div className="pt-4 border-t border-gray-200">
            <div className="text-2xl font-semibold text-gray-700 mb-1">{longestStreak}</div>
            <div className="text-xs text-gray-500">最长记录</div>
          </div>
          {currentStreak > 0 && (
            <div className="mt-4 text-sm text-gray-600">
              {currentStreak === longestStreak && currentStreak > 7
                ? '🎉 太棒了！你创造了新纪录！'
                : currentStreak >= 30
                ? '👏 坚持一个月了，继续加油！'
                : currentStreak >= 7
                ? '💪 坚持了一周，很棒！'
                : '👍 继续保持记录习惯！'}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
