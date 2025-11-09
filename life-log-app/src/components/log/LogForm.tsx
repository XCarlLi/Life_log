import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Textarea } from '../common';
import { CategorySelector } from './CategorySelector';
import type { Category } from '../../types';

const logFormSchema = z.object({
  description: z
    .string()
    .min(1, '请输入任务描述')
    .max(140, '描述不能超过140个字符'),
  categoryIds: z
    .array(z.string())
    .min(1, '请至少选择一个分类')
    .max(3, '最多只能选择3个分类'),
  location: z.string().max(50, '地点不能超过50个字符').optional(),
});

export type LogFormData = z.infer<typeof logFormSchema>;

interface LogFormProps {
  categories: Category[];
  onSubmit: (data: LogFormData) => void;
  onCancel?: () => void;
  defaultValues?: Partial<LogFormData>;
  submitLabel?: string;
  isLoading?: boolean;
}

export const LogForm: React.FC<LogFormProps> = ({
  categories,
  onSubmit,
  onCancel,
  defaultValues,
  submitLabel = '开始记录',
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<LogFormData>({
    resolver: zodResolver(logFormSchema),
    defaultValues: {
      description: '',
      categoryIds: [],
      location: '',
      ...defaultValues,
    },
  });

  const categoryIds = watch('categoryIds');
  const description = watch('description');
  const location = watch('location');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Textarea
        label="任务描述"
        placeholder="在做什么？"
        required
        {...register('description')}
        value={description}
        error={errors.description?.message}
        showCharCount
        maxLength={140}
        rows={3}
      />

      <CategorySelector
        categories={categories}
        selectedIds={categoryIds}
        onChange={(ids) => setValue('categoryIds', ids)}
        error={errors.categoryIds?.message}
      />

      <Input
        label="地点"
        placeholder="在哪里？（可选）"
        {...register('location')}
        value={location}
        error={errors.location?.message}
        showCharCount
        maxLength={50}
      />

      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          variant="primary"
          className="flex-1"
          isLoading={isLoading}
        >
          {submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            取消
          </Button>
        )}
      </div>
    </form>
  );
};
