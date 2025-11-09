import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { ToastMessage, ToastType } from '../components/common/Toast';

interface ToastStore {
  toasts: ToastMessage[];
  addToast: (type: ToastType, title: string, message?: string, duration?: number) => void;
  removeToast: (id: string) => void;
  clearAll: () => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],

  addToast: (type, title, message, duration = 5000) => {
    const id = uuidv4();
    set((state) => ({
      toasts: [...state.toasts, { id, type, title, message, duration }],
    }));
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },

  clearAll: () => {
    set({ toasts: [] });
  },
}));
