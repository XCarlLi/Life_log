import { create } from 'zustand';
import { settingsService } from '../services/db';
import type { UserSettings } from '../types';

interface SettingsStore {
  settings: UserSettings | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  loadSettings: () => Promise<void>;
  updateSettings: (updates: Partial<UserSettings>) => Promise<void>;
  resetSettings: () => Promise<void>;
}

const DEFAULT_SETTINGS: Omit<UserSettings, 'id' | 'createdAt' | 'updatedAt'> = {
  theme: 'light',
  language: 'zh-CN',
  weekStartsOn: 1, // Monday
  longTaskThreshold: 6, // 6 hours
  enableNotifications: true,
  dashboardLayout: {
    widgets: [
      { id: 'today-summary', enabled: true, order: 0 },
      { id: 'category-pie', enabled: true, order: 1 },
      { id: 'weekly-trend', enabled: true, order: 2 },
      { id: 'streak-counter', enabled: true, order: 3 },
    ],
  },
  exportFormat: 'csv',
  consecutiveDays: 0,
  longestStreak: 0,
  totalLogCount: 0,
};

export const useSettingsStore = create<SettingsStore>((set) => ({
  settings: null,
  isLoading: false,
  error: null,

  loadSettings: async () => {
    set({ isLoading: true, error: null });
    try {
      let settings = await settingsService.get();

      // If no settings exist, create default settings
      if (!settings) {
        await settingsService.update(DEFAULT_SETTINGS);
        settings = await settingsService.get();
      }

      set({ settings: settings || null, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  updateSettings: async (updates) => {
    set({ isLoading: true, error: null });
    try {
      await settingsService.update(updates);
      const settings = await settingsService.get();
      set({ settings, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  resetSettings: async () => {
    set({ isLoading: true, error: null });
    try {
      await settingsService.update(DEFAULT_SETTINGS);
      const settings = await settingsService.get();
      set({ settings, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },
}));
