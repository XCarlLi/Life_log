import React, { useEffect, useState } from 'react';
import { useLogStore, useCategoryStore, useSettingsStore } from '../stores';
import { StatCard, CategoryPieChart, TrendLineChart, WeeklyBarChart, StreakCounter } from '../components/stats';
import { calculateDayStatistics, calculateWeekStatistics } from '../services/statistics-helpers';
import { formatDuration } from '../utils/format';
import type { DayStatistics, WeekStatistics, PieChartData, LineChartData, BarChartData } from '../types';

export const Dashboard: React.FC = () => {
  const { loadLogsByDateRange } = useLogStore();
  const { categories } = useCategoryStore();
  const { settings } = useSettingsStore();

  const [todayStats, setTodayStats] = useState<DayStatistics | null>(null);
  const [weekStats, setWeekStats] = useState<WeekStatistics | null>(null);
  const [pieData, setPieData] = useState<PieChartData[]>([]);
  const [trendData, setTrendData] = useState<LineChartData[]>([]);
  const [barData, setBarData] = useState<BarChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Load today's logs
      const todayLogs = await loadLogsByDateRange(today, tomorrow);
      const todayStatistics = calculateDayStatistics(todayLogs, categories);
      setTodayStats(todayStatistics);

      // Load week's logs
      const weekStart = new Date(today);
      weekStart.setDate(weekStart.getDate() - 6);
      const weekLogs = await loadLogsByDateRange(weekStart, tomorrow);
      const weekStatistics = calculateWeekStatistics(weekLogs, categories, weekStart);
      setWeekStats(weekStatistics);

      // Prepare pie chart data (today's category distribution)
      const pieChartData: PieChartData[] = todayStatistics.categoryStats
        .map((stat) => ({
          name: stat.categoryName,
          value: stat.totalSeconds,
          color: stat.categoryColor,
          percentage: stat.percentage,
        }))
        .filter((item) => item.value > 0);
      setPieData(pieChartData);

      // Prepare trend line data (last 7 days total duration)
      const lineData: LineChartData[] = weekStatistics.dailyStats.map((day) => ({
        label: new Date(day.date).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' }),
        totalDuration: day.totalSeconds,
      }));
      setTrendData(lineData);

      // Prepare bar chart data (week category distribution)
      const barChartData: BarChartData[] = weekStatistics.dailyStats.map((day) => {
        const data: any = {
          label: new Date(day.date).toLocaleDateString('zh-CN', { weekday: 'short' }),
        };
        day.categoryStats.forEach((stat) => {
          data[stat.categoryId] = stat.totalSeconds;
        });
        return data;
      });
      setBarData(barChartData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  const categoryDataKeys = categories.map((cat) => ({
    key: cat.id,
    name: cat.name,
    color: cat.color,
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">仪表盘</h1>
        <p className="text-gray-600 mt-1">查看你的时间统计与趋势</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="今日总时长"
          value={formatDuration(todayStats?.totalSeconds || 0)}
          subtitle={`${todayStats?.logCount || 0} 条记录`}
          icon="⏱️"
          color="#FF8966"
        />
        <StatCard
          title="本周总时长"
          value={formatDuration(weekStats?.totalSeconds || 0)}
          subtitle={`日均 ${formatDuration(weekStats?.averagePerDay || 0)}`}
          icon="📅"
          color="#FFD4A3"
        />
        <StatCard
          title="活跃分类"
          value={todayStats?.categoryStats.filter((s) => s.totalSeconds > 0).length || 0}
          subtitle={`共 ${categories.length} 个分类`}
          icon="🏷️"
          color="#95E1D3"
        />
        <StreakCounter
          currentStreak={settings?.consecutiveDays || 0}
          longestStreak={settings?.longestStreak || 0}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryPieChart data={pieData} title="今日分类分布" />
        <TrendLineChart
          data={trendData}
          title="最近7天趋势"
          dataKeys={[{ key: 'totalDuration', name: '总时长', color: '#FF8966' }]}
        />
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 gap-6">
        <WeeklyBarChart
          data={barData}
          title="本周分类时长分布"
          dataKeys={categoryDataKeys}
          stacked
        />
      </div>

      {/* Top Categories */}
      {todayStats && todayStats.categoryStats.length > 0 && (
        <div className="bg-white rounded-xl shadow-soft p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">今日分类排行</h3>
          <div className="space-y-3">
            {todayStats.categoryStats
              .filter((stat) => stat.totalSeconds > 0)
              .sort((a, b) => b.totalSeconds - a.totalSeconds)
              .slice(0, 5)
              .map((stat, index) => (
                <div key={stat.categoryId} className="flex items-center gap-4">
                  <div className="text-2xl font-bold text-gray-300 w-8">#{index + 1}</div>
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: stat.categoryColor }}
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{stat.categoryName}</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${stat.percentage}%`,
                          backgroundColor: stat.categoryColor,
                        }}
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      {formatDuration(stat.totalSeconds)}
                    </div>
                    <div className="text-sm text-gray-500">{stat.percentage.toFixed(1)}%</div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
