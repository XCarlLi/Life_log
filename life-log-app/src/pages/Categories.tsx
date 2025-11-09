import React, { useState } from 'react';
import { Button, Modal, Input, Badge, Card, CardContent } from '../components/common';
import { useCategoryStore, useToastStore } from '../stores';
import { PRESET_CATEGORIES } from '../constants/categories';

export const Categories: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategoryStore();
  const { addToast } = useToastStore();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: '',
    icon: '',
    color: '#FF8966',
    description: '',
  });

  const handleCreateCategory = async () => {
    if (!formData.name.trim()) {
      addToast('error', '名称不能为空', '请输入分类名称');
      return;
    }

    try {
      await addCategory({
        name: formData.name,
        icon: formData.icon || '📁',
        color: formData.color,
        description: formData.description,
        isPreset: false,
      });
      setIsCreateModalOpen(false);
      setFormData({ name: '', icon: '', color: '#FF8966', description: '' });
      addToast('success', '创建成功', '新分类已添加');
    } catch (error) {
      addToast('error', '创建失败', (error as Error).message);
    }
  };

  const handleEditCategory = async () => {
    if (!editingCategory) return;

    try {
      await updateCategory(editingCategory.id, {
        name: formData.name,
        icon: formData.icon,
        color: formData.color,
        description: formData.description,
      });
      setIsEditModalOpen(false);
      setEditingCategory(null);
      setFormData({ name: '', icon: '', color: '#FF8966', description: '' });
      addToast('success', '更新成功', '分类已更新');
    } catch (error) {
      addToast('error', '更新失败', (error as Error).message);
    }
  };

  const handleDeleteCategory = async (id: string, isPreset: boolean) => {
    if (isPreset) {
      addToast('warning', '无法删除', '预设分类不能删除');
      return;
    }

    if (!confirm('确定要删除这个分类吗？使用该分类的记录不会被删除。')) return;

    try {
      await deleteCategory(id);
      addToast('success', '已删除', '分类已删除');
    } catch (error) {
      addToast('error', '删除失败', (error as Error).message);
    }
  };

  const openEditModal = (category: any) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      icon: category.icon,
      color: category.color,
      description: category.description || '',
    });
    setIsEditModalOpen(true);
  };

  const presetCategories = categories.filter((cat) => cat.isPreset);
  const customCategories = categories.filter((cat) => !cat.isPreset);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">分类管理</h1>
          <p className="text-gray-600 mt-1">管理你的任务分类</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} variant="primary">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          新建分类
        </Button>
      </div>

      {/* Preset Categories */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">预设分类</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {presetCategories.map((category) => (
            <Card key={category.id} hover>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                      style={{ backgroundColor: `${category.color}20`, color: category.color }}
                    >
                      {category.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{category.name}</h3>
                      <Badge color={category.color} variant="subtle" size="sm">
                        预设
                      </Badge>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => openEditModal(category)}
                  >
                    编辑
                  </Button>
                </div>
                {category.description && (
                  <p className="text-sm text-gray-600">{category.description}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Custom Categories */}
      {customCategories.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">自定义分类</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {customCategories.map((category) => (
              <Card key={category.id} hover>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                        style={{ backgroundColor: `${category.color}20`, color: category.color }}
                      >
                        {category.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{category.name}</h3>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openEditModal(category)}
                      >
                        编辑
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteCategory(category.id, category.isPreset)}
                      >
                        删除
                      </Button>
                    </div>
                  </div>
                  {category.description && (
                    <p className="text-sm text-gray-600">{category.description}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setFormData({ name: '', icon: '', color: '#FF8966', description: '' });
        }}
        title="新建分类"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="分类名称"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            maxLength={20}
            showCharCount
          />
          <Input
            label="图标 Emoji"
            placeholder="📁"
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            maxLength={2}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              颜色
            </label>
            <input
              type="color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="w-full h-10 rounded-lg border border-gray-300 cursor-pointer"
            />
          </div>
          <Input
            label="描述"
            placeholder="可选"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            maxLength={50}
            showCharCount
          />
          <div className="flex gap-3 pt-4">
            <Button variant="primary" onClick={handleCreateCategory} className="flex-1">
              创建
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setIsCreateModalOpen(false);
                setFormData({ name: '', icon: '', color: '#FF8966', description: '' });
              }}
            >
              取消
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingCategory(null);
          setFormData({ name: '', icon: '', color: '#FF8966', description: '' });
        }}
        title="编辑分类"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="分类名称"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            maxLength={20}
            showCharCount
          />
          <Input
            label="图标 Emoji"
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            maxLength={2}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              颜色
            </label>
            <input
              type="color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="w-full h-10 rounded-lg border border-gray-300 cursor-pointer"
            />
          </div>
          <Input
            label="描述"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            maxLength={50}
            showCharCount
          />
          <div className="flex gap-3 pt-4">
            <Button variant="primary" onClick={handleEditCategory} className="flex-1">
              保存
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setIsEditModalOpen(false);
                setEditingCategory(null);
                setFormData({ name: '', icon: '', color: '#FF8966', description: '' });
              }}
            >
              取消
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
