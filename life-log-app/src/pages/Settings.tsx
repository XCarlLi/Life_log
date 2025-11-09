import React, { useState, useEffect } from 'react';
import { Button, Card, CardHeader, CardTitle, CardContent, Select } from '../components/common';
import { useSettingsStore, useToastStore } from '../stores';
import { exportService } from '../services/export-helpers';
import { useLogStore } from '../stores';

export const Settings: React.FC = () => {
  const { settings, updateSettings } = useSettingsStore();
  const { addToast } = useToastStore();
  const { loadLogsByDateRange } = useLogStore();

  const [longTaskThreshold, setLongTaskThreshold] = useState('6');
  const [exportFormat, setExportFormat] = useState<'csv' | 'json'>('csv');

  useEffect(() => {
    if (settings) {
      setLongTaskThreshold(settings.longTaskThreshold.toString());
      setExportFormat(settings.exportFormat);
    }
  }, [settings]);

  const handleSaveSettings = async () => {
    try {
      await updateSettings({
        longTaskThreshold: parseInt(longTaskThreshold),
        exportFormat,
      });
      addToast('success', '设置已保存', '你的偏好设置已更新');
    } catch (error) {
      addToast('error', '保存失败', (error as Error).message);
    }
  };

  const handleExportData = async () => {
    try {
      // Export all data from the last year
      const endDate = new Date();
      const startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 1);

      const logs = await loadLogsByDateRange(startDate, endDate);

      if (logs.length === 0) {
        addToast('warning', '没有数据', '没有可导出的记录');
        return;
      }

      if (exportFormat === 'csv') {
        exportService.exportToCSV(logs);
      } else {
        exportService.exportToJSON(logs);
      }

      addToast('success', '导出成功', `已导出 ${logs.length} 条记录`);
    } catch (error) {
      addToast('error', '导出失败', (error as Error).message);
    }
  };

  if (!settings) {
    return <div className="text-center text-gray-500">加载中...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">设置</h1>
        <p className="text-gray-600 mt-1">管理应用偏好和数据</p>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle>通用设置</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              长任务提醒阈值（小时）
            </label>
            <Select
              value={longTaskThreshold}
              onChange={(e) => setLongTaskThreshold(e.target.value)}
              options={[
                { value: '3', label: '3小时' },
                { value: '6', label: '6小时' },
                { value: '12', label: '12小时' },
                { value: '24', label: '24小时' },
              ]}
            />
            <p className="mt-1 text-sm text-gray-500">
              当任务进行时间超过此阈值时，会显示提醒
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Data Export */}
      <Card>
        <CardHeader>
          <CardTitle>数据导出</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              导出格式
            </label>
            <Select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value as 'csv' | 'json')}
              options={[
                { value: 'csv', label: 'CSV（表格）' },
                { value: 'json', label: 'JSON（数据）' },
              ]}
            />
          </div>
          <Button onClick={handleExportData} variant="outline">
            导出最近一年的数据
          </Button>
          <p className="text-sm text-gray-500">
            导出所有记录到本地文件，数据将保存到下载文件夹
          </p>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>使用统计</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <div className="text-2xl font-bold text-primary">
                {settings.consecutiveDays}
              </div>
              <div className="text-sm text-gray-600 mt-1">连续记录天数</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">
                {settings.longestStreak}
              </div>
              <div className="text-sm text-gray-600 mt-1">最长连续记录</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">
                {settings.totalLogCount || 0}
              </div>
              <div className="text-sm text-gray-600 mt-1">总记录数</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardHeader>
          <CardTitle>关于</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-600">
            <p><strong>Life Log</strong> - 温暖、舒适的时间记录工具</p>
            <p>版本: 1.0.0</p>
            <p>数据存储在浏览器本地，确保你的隐私安全</p>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button variant="primary" onClick={handleSaveSettings} size="lg">
          保存设置
        </Button>
      </div>
    </div>
  );
};
