import { create } from 'zustand';
import { categoryService } from '../services/db';
import type { Category } from '../types';

interface CategoryStore {
  categories: Category[];
  isLoading: boolean;
  error: string | null;

  // Actions
  loadCategories: () => Promise<void>;
  addCategory: (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  getCategoryById: (id: string) => Category | undefined;
  getCategoriesByIds: (ids: string[]) => Category[];
}

export const useCategoryStore = create<CategoryStore>((set, get) => ({
  categories: [],
  isLoading: false,
  error: null,

  loadCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const categories = await categoryService.getAll();
      set({ categories, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  addCategory: async (category) => {
    set({ isLoading: true, error: null });
    try {
      const id = await categoryService.create(category);
      const newCategory = await categoryService.getById(id);
      if (newCategory) {
        set((state) => ({
          categories: [...state.categories, newCategory],
          isLoading: false,
        }));
      }
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  updateCategory: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      await categoryService.update(id, updates);
      const updatedCategory = await categoryService.getById(id);
      if (updatedCategory) {
        set((state) => ({
          categories: state.categories.map((cat) => (cat.id === id ? updatedCategory : cat)),
          isLoading: false,
        }));
      }
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  deleteCategory: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await categoryService.delete(id);
      set((state) => ({
        categories: state.categories.filter((cat) => cat.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  getCategoryById: (id) => {
    return get().categories.find((cat) => cat.id === id);
  },

  getCategoriesByIds: (ids) => {
    const { categories } = get();
    return ids.map((id) => categories.find((cat) => cat.id === id)).filter(Boolean) as Category[];
  },
}));
