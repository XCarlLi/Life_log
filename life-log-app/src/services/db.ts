import Dexie, { type Table } from 'dexie';
import type { Category, LogEntry, SplitLogEntry, UserSettings } from '../types';
import { generateDefaultCategories } from '../constants';

// 定义数据库类
export class LifeLogDatabase extends Dexie {
  categories!: Table<Category, string>;
  logs!: Table<LogEntry, string>;
  splitLogs!: Table<SplitLogEntry, string>;
  settings!: Table<UserSettings, number>;

  constructor() {
    super('LifeLogDatabase');

    // 定义数据库schema
    this.version(1).stores({
      categories: 'id, name, isPreset, order',
      logs: 'id, startTime, endTime, *categoryIds, createdAt',
      splitLogs: 'id, parentId, date, *categoryIds',
      settings: '++id',
    });
  }
}

// 创建数据库实例
export const db = new LifeLogDatabase();

// ============ 初始化数据库 ============
export async function initializeDatabase(): Promise<void> {
  try {
    // 检查是否已有分类数据
    const categoriesCount = await db.categories.count();

    if (categoriesCount === 0) {
      // 首次使用，初始化预设分类
      const defaultCategories = generateDefaultCategories();
      await db.categories.bulkAdd(defaultCategories);
      console.log('预设分类已初始化');
    }

    // 检查是否已有设置数据
    const settingsCount = await db.settings.count();

    if (settingsCount === 0) {
      // 首次使用，初始化默认设置
      const now = new Date().toISOString();
      const defaultSettings: UserSettings = {
        theme: 'light',
        language: 'zh-CN',
        weekStartsOn: 1,
        longTaskThreshold: 6,
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
        createdAt: now,
        updatedAt: now,
      };
      await db.settings.add(defaultSettings);
      console.log('默认设置已初始化');
    }

    console.log('数据库初始化完成');
  } catch (error) {
    console.error('数据库初始化失败:', error);
    throw error;
  }
}

// ============ 分类操作 ============
export const categoryService = {
  // 获取所有分类
  async getAll(): Promise<Category[]> {
    return await db.categories.orderBy('order').toArray();
  },

  // 根据ID获取分类
  async getById(id: string): Promise<Category | undefined> {
    return await db.categories.get(id);
  },

  // 创建分类
  async create(category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = new Date().toISOString();
    const { v4: uuidv4 } = await import('uuid');
    const newCategory: Category = {
      ...category,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };
    await db.categories.add(newCategory);
    return newCategory.id;
  },

  // 更新分类
  async update(id: string, updates: Partial<Category>): Promise<void> {
    const now = new Date().toISOString();
    await db.categories.update(id, {
      ...updates,
      updatedAt: now,
    });
  },

  // 删除分类（仅限非预设分类）
  async delete(id: string): Promise<void> {
    const category = await db.categories.get(id);
    if (category?.isPreset) {
      throw new Error('无法删除预设分类');
    }
    await db.categories.delete(id);
  },
};

// ============ 日志操作 ============
export const logService = {
  // 获取所有日志
  async getAll(): Promise<LogEntry[]> {
    return await db.logs.orderBy('startTime').reverse().toArray();
  },

  // 根据ID获取日志
  async getById(id: string): Promise<LogEntry | undefined> {
    return await db.logs.get(id);
  },

  // 根据日期范围获取日志
  async getByDateRange(startDate: string, endDate: string): Promise<LogEntry[]> {
    const start = new Date(startDate).toISOString();
    const end = new Date(endDate + 'T23:59:59').toISOString();

    return await db.logs
      .where('startTime')
      .between(start, end, true, true)
      .toArray();
  },

  // 根据日期获取日志（包括跨天任务）
  async getByDate(date: string): Promise<LogEntry[]> {
    const dayStart = new Date(date + 'T00:00:00').toISOString();
    const dayEnd = new Date(date + 'T23:59:59').toISOString();

    // 获取在当天开始的任务
    const startedToday = await db.logs
      .where('startTime')
      .between(dayStart, dayEnd, true, true)
      .toArray();

    // 获取跨天的任务（开始时间早于今天，结束时间在今天或之后）
    const crossDay = await db.logs
      .where('startTime')
      .below(dayStart)
      .filter(log => {
        if (!log.endTime) return true; // 进行中的任务
        return log.endTime >= dayStart; // 结束时间在今天或之后
      })
      .toArray();

    // 合并并去重
    const allLogs = [...startedToday, ...crossDay];
    const uniqueLogs = Array.from(new Map(allLogs.map(log => [log.id, log])).values());

    return uniqueLogs.sort((a, b) =>
      new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );
  },

  // 获取进行中的任务
  async getActiveLogs(): Promise<LogEntry[]> {
    return await db.logs
      .filter(log => !log.endTime)
      .toArray();
  },

  // 创建日志
  async create(log: Omit<LogEntry, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = new Date().toISOString();
    const { v4: uuidv4 } = await import('uuid');
    const newLog: LogEntry = {
      ...log,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };
    await db.logs.add(newLog);
    return newLog.id;
  },

  // 更新日志
  async update(id: string, updates: Partial<LogEntry>): Promise<void> {
    const now = new Date().toISOString();
    await db.logs.update(id, {
      ...updates,
      updatedAt: now,
    });
  },

  // 删除日志
  async delete(id: string): Promise<void> {
    // 同时删除相关的拆分记录
    await db.splitLogs.where('parentId').equals(id).delete();
    await db.logs.delete(id);
  },

  // 完成任务（设置结束时间）
  async complete(id: string, endTime: string): Promise<void> {
    const log = await db.logs.get(id);
    if (!log) {
      throw new Error('日志不存在');
    }

    await db.logs.update(id, {
      endTime,
      updatedAt: new Date().toISOString(),
    });
  },
};

// ============ 拆分记录操作 ============
export const splitLogService = {
  // 根据父日志ID获取拆分记录
  async getByParentId(parentId: string): Promise<SplitLogEntry[]> {
    return await db.splitLogs
      .where('parentId')
      .equals(parentId)
      .toArray();
  },

  // 根据日期获取拆分记录
  async getByDate(date: string): Promise<SplitLogEntry[]> {
    return await db.splitLogs
      .where('date')
      .equals(date)
      .toArray();
  },

  // 创建拆分记录
  async create(splitLog: Omit<SplitLogEntry, 'id'>): Promise<string> {
    const { v4: uuidv4 } = await import('uuid');
    const newSplitLog: SplitLogEntry = {
      ...splitLog,
      id: uuidv4(),
    };
    await db.splitLogs.add(newSplitLog);
    return newSplitLog.id;
  },

  // 批量创建拆分记录
  async bulkCreate(splitLogs: Omit<SplitLogEntry, 'id'>[]): Promise<void> {
    const { v4: uuidv4 } = await import('uuid');
    const newSplitLogs: SplitLogEntry[] = splitLogs.map(log => ({
      ...log,
      id: uuidv4(),
    }));
    await db.splitLogs.bulkAdd(newSplitLogs);
  },

  // 删除父日志的所有拆分记录
  async deleteByParentId(parentId: string): Promise<void> {
    await db.splitLogs.where('parentId').equals(parentId).delete();
  },

  // 根据日志ID获取拆分记录（别名）
  async getByLogId(parentId: string): Promise<SplitLogEntry[]> {
    return await this.getByParentId(parentId);
  },

  // 删除拆分记录
  async delete(id: string): Promise<void> {
    await db.splitLogs.delete(id);
  },
};

// ============ 设置操作 ============
export const settingsService = {
  // 获取设置
  async get(): Promise<UserSettings | undefined> {
    const settings = await db.settings.toArray();
    return settings[0];
  },

  // 更新设置
  async update(updates: Partial<UserSettings>): Promise<void> {
    const settings = await db.settings.toArray();
    const now = new Date().toISOString();

    if (settings.length > 0) {
      await db.settings.update(1, {
        ...updates,
        updatedAt: now,
      });
    } else {
      // 如果没有设置，创建新的
      const defaultSettings: UserSettings = {
        theme: 'light',
        language: 'zh-CN',
        weekStartsOn: 1,
        longTaskThreshold: 6,
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
        createdAt: now,
        updatedAt: now,
        ...updates,
      };
      await db.settings.add(defaultSettings);
    }
  },

  // 更新连续记录天数
  async updateStreak(): Promise<number> {
    const settings = await this.get();
    if (!settings) return 0;

    // 简单实现：每次调用增加1
    const newStreak = settings.consecutiveDays + 1;
    const newLongest = Math.max(newStreak, settings.longestStreak);

    await this.update({
      consecutiveDays: newStreak,
      longestStreak: newLongest,
    });

    return newStreak;
  },
};

// 导出数据库实例和服务
export default {
  db,
  initializeDatabase,
  categoryService,
  logService,
  splitLogService,
  settingsService,
};
