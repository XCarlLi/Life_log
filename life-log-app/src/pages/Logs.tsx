import React, { useEffect, useState } from 'react';
import { Select, Modal } from '../components/common';
import { LogList } from '../components/log';
import { LogForm } from '../components/log';
import { useLogStore, useCategoryStore, useToastStore } from '../stores';
import type { LogFormData } from '../components/log';
import type { LogEntry } from '../types';

export const Logs: React.FC = () => {
  const { recentLogs, loadRecentLogs, updateLog, deleteLog } = useLogStore();
  const { categories } = useCategoryStore();
  const { addToast } = useToastStore();

  const [timeRange, setTimeRange] = useState('7');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<LogEntry | null>(null);

  useEffect(() => {
    loadRecentLogs(parseInt(timeRange));
  }, [timeRange, loadRecentLogs]);

  const handleEditLog = async (data: LogFormData) => {
    if (!editingLog) return;

    try {
      await updateLog(editingLog.id, {
        description: data.description,
        categoryIds: data.categoryIds,
        location: data.location || undefined,
      });
      setIsEditModalOpen(false);
      setEditingLog(null);
      addToast('success', '任务已更新', '修改成功！');
    } catch (error) {
      addToast('error', '更新失败', (error as Error).message);
    }
  };

  const handleDeleteLog = async (id: string) => {
    if (!confirm('确定要删除这条记录吗？此操作无法撤销。')) return;

    try {
      await deleteLog(id);
      addToast('success', '已删除', '记录已删除');
    } catch (error) {
      addToast('error', '删除失败', (error as Error).message);
    }
  };

  const openEditModal = (log: LogEntry) => {
    setEditingLog(log);
    setIsEditModalOpen(true);
  };

  const timeRangeOptions = [
    { value: '7', label: '最近7天' },
    { value: '30', label: '最近30天' },
    { value: '90', label: '最近90天' },
    { value: '365', label: '最近一年' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">日志记录</h1>
          <p className="text-gray-600 mt-1">查看和管理你的所有记录</p>
        </div>
        <div className="w-48">
          <Select
            options={timeRangeOptions}
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          />
        </div>
      </div>

      {/* Statistics Summary */}
      <div className="bg-white rounded-xl shadow-soft p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{recentLogs.length}</div>
            <div className="text-sm text-gray-600 mt-1">总记录数</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {recentLogs.filter((log) => log.endTime).length}
            </div>
            <div className="text-sm text-gray-600 mt-1">已完成</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {new Set(
                recentLogs.map((log) => new Date(log.startTime).toDateString())
              ).size}
            </div>
            <div className="text-sm text-gray-600 mt-1">活跃天数</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {new Set(recentLogs.flatMap((log) => log.categoryIds)).size}
            </div>
            <div className="text-sm text-gray-600 mt-1">使用分类数</div>
          </div>
        </div>
      </div>

      {/* Log List */}
      <LogList
        logs={recentLogs}
        categories={categories}
        onEdit={openEditModal}
        onDelete={handleDeleteLog}
        groupByDate
        emptyMessage={`最近${timeRange}天没有记录`}
      />

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingLog(null);
        }}
        title="编辑任务"
        size="md"
      >
        {editingLog && (
          <LogForm
            categories={categories}
            onSubmit={handleEditLog}
            onCancel={() => {
              setIsEditModalOpen(false);
              setEditingLog(null);
            }}
            defaultValues={{
              description: editingLog.description,
              categoryIds: editingLog.categoryIds,
              location: editingLog.location || '',
            }}
            submitLabel="保存修改"
          />
        )}
      </Modal>
    </div>
  );
};
