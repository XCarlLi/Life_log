import { create } from 'zustand';
import { logService, splitLogService } from '../services/db';
import { handleCrossDayLogs } from '../services/splitLog';
import type { LogEntry } from '../types';

interface LogStore {
  activeLogs: LogEntry[];
  recentLogs: LogEntry[];
  isLoading: boolean;
  error: string | null;

  // Actions
  loadActiveLogs: () => Promise<void>;
  loadRecentLogs: (days?: number) => Promise<void>;
  loadLogsByDateRange: (startDate: Date, endDate: Date) => Promise<LogEntry[]>;

  startLog: (log: Omit<LogEntry, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  endLog: (id: string, endTime: Date, location?: string) => Promise<void>;
  updateLog: (id: string, updates: Partial<LogEntry>) => Promise<void>;
  deleteLog: (id: string) => Promise<void>;

  getLogById: (id: string) => Promise<LogEntry | undefined>;
}

export const useLogStore = create<LogStore>((set, get) => ({
  activeLogs: [],
  recentLogs: [],
  isLoading: false,
  error: null,

  loadActiveLogs: async () => {
    set({ isLoading: true, error: null });
    try {
      const logs = await logService.getActiveLogs();
      set({ activeLogs: logs, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  loadRecentLogs: async (days = 30) => {
    set({ isLoading: true, error: null });
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const logs = await logService.getByDateRange(startDate, endDate);
      set({ recentLogs: logs, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  loadLogsByDateRange: async (startDate, endDate) => {
    try {
      return await logService.getByDateRange(startDate, endDate);
    } catch (error) {
      set({ error: (error as Error).message });
      return [];
    }
  },

  startLog: async (log) => {
    set({ isLoading: true, error: null });
    try {
      const id = await logService.create(log);
      await get().loadActiveLogs();
      set({ isLoading: false });
      return id;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  endLog: async (id, endTime, location) => {
    set({ isLoading: true, error: null });
    try {
      const log = await logService.getById(id);
      if (!log) {
        throw new Error('Log not found');
      }

      await logService.update(id, {
        endTime,
        location: location || log.location,
      });

      // Handle cross-day splitting
      const updatedLog = await logService.getById(id);
      if (updatedLog) {
        await handleCrossDayLogs([updatedLog]);
      }

      await get().loadActiveLogs();
      await get().loadRecentLogs();
      set({ isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  updateLog: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      await logService.update(id, updates);

      // If endTime was updated, check for cross-day splitting
      if (updates.endTime) {
        const updatedLog = await logService.getById(id);
        if (updatedLog) {
          await handleCrossDayLogs([updatedLog]);
        }
      }

      await get().loadActiveLogs();
      await get().loadRecentLogs();
      set({ isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  deleteLog: async (id) => {
    set({ isLoading: true, error: null });
    try {
      // Delete associated split logs
      const splitLogs = await splitLogService.getByLogId(id);
      for (const splitLog of splitLogs) {
        await splitLogService.delete(splitLog.id);
      }

      await logService.delete(id);
      await get().loadActiveLogs();
      await get().loadRecentLogs();
      set({ isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  getLogById: async (id) => {
    try {
      return await logService.getById(id);
    } catch (error) {
      set({ error: (error as Error).message });
      return undefined;
    }
  },
}));
