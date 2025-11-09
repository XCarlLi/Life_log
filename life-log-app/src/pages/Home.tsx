import React, { useEffect, useState } from 'react';
import { Modal } from '../components/common';
import { LogForm, ActiveTaskCard, LogList } from '../components/log';
import { useLogStore, useCategoryStore, useToastStore } from '../stores';
import type { LogFormData } from '../components/log';
import type { LogEntry } from '../types';

export const Home: React.FC = () => {
  const { activeLogs, recentLogs, loadActiveLogs, loadRecentLogs, startLog, endLog, updateLog, deleteLog } =
    useLogStore();
  const { categories } = useCategoryStore();
  const { addToast } = useToastStore();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<LogEntry | null>(null);
  const [endingLogId, setEndingLogId] = useState<string | null>(null);

  useEffect(() => {
    loadActiveLogs();
    loadRecentLogs(7); // Load last 7 days
  }, [loadActiveLogs, loadRecentLogs]);

  const handleCreateLog = async (data: LogFormData) => {
    try {
      await startLog({
        description: data.description,
        categoryIds: data.categoryIds,
        location: data.location || undefined,
        startTime: new Date().toISOString(),
      });
      setIsCreateModalOpen(false);
      addToast('success', '任务已开始', '开始记录时间啦！');
    } catch (error) {
      addToast('error', '创建失败', (error as Error).message);
    }
  };

  const handleEndLog = async (id: string, location?: string) => {
    setEndingLogId(id);
    try {
      await endLog(id, new Date().toISOString(), location);
      addToast('success', '任务已结束', '记录完成！');
    } catch (error) {
      addToast('error', '结束失败', (error as Error).message);
    } finally {
      setEndingLogId(null);
    }
  };

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
    if (!confirm('确定要删除这条记录吗？')) return;

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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Life Log</h1>
          <p className="text-gray-600 mt-1">记录你的每一刻，让时间更有温度</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-primary text-white px-6 py-3 rounded-lg font-semibold shadow-soft hover:bg-primary/90 transition-all duration-200 hover:shadow-medium hover:-translate-y-0.5 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          开始新任务
        </button>
      </div>

      {/* Active Tasks */}
      {activeLogs.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            进行中的任务 ({activeLogs.length})
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {activeLogs.map((log) => (
              <ActiveTaskCard
                key={log.id}
                log={log}
                categories={categories}
                onEnd={handleEndLog}
                onEdit={openEditModal}
                isEnding={endingLogId === log.id}
              />
            ))}
          </div>
        </div>
      )}

      {/* Recent Logs */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">最近7天</h2>
        <LogList
          logs={recentLogs}
          categories={categories}
          onEdit={openEditModal}
          onDelete={handleDeleteLog}
          groupByDate
        />
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="开始新任务"
        size="md"
      >
        <LogForm
          categories={categories}
          onSubmit={handleCreateLog}
          onCancel={() => setIsCreateModalOpen(false)}
          submitLabel="开始记录"
        />
      </Modal>

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
