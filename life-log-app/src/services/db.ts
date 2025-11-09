import Dexie, { type Table } from 'dexie';
import type { Category, LogEntry, SplitLogEntry, UserSettings, ChartType } from '../types';
import { generateDefaultCategories, DEFAULT_LONG_TASK_THRESHOLD, DEFAULT_WEEK_START_DAY, DEFAULT_EXPORT_FORMAT, DEFAULT_VISIBLE_CHARTS } from '../constants';

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
      categories: 'id, name, isDefault, order',
      logs: 'id, startTime, endTime, status, *categoryIds, createdAt',
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
      const defaultSettings: UserSettings = {
        longTaskThreshold: DEFAULT_LONG_TASK_THRESHOLD,
        weekStartDay: DEFAULT_WEEK_START_DAY,
        defaultExportFormat: DEFAULT_EXPORT_FORMAT,
        dashboardLayout: {
          visibleCharts: DEFAULT_VISIBLE_CHARTS as ChartType[],
          chartOrder: DEFAULT_VISIBLE_CHARTS as ChartType[],
        },
        streakCount: 0,
        lastActiveDate: new Date().toISOString().split('T')[0],
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

  // 删除分类（仅限非默认分类）
  async delete(id: string): Promise<void> {
    const category = await db.categories.get(id);
    if (category?.isDefault) {
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
        if (!log.endTime) return log.status === 'active'; // 进行中的任务
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
      .where('status')
      .equals('active')
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

    const start = new Date(log.startTime);
    const end = new Date(endTime);
    const duration = Math.round((end.getTime() - start.getTime()) / (1000 * 60));

    await db.logs.update(id, {
      endTime,
      duration,
      status: 'completed',
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
    if (settings.length > 0) {
      await db.settings.update(1, updates);
    } else {
      // 如果没有设置，创建新的
      const defaultSettings: UserSettings = {
        longTaskThreshold: DEFAULT_LONG_TASK_THRESHOLD,
        weekStartDay: DEFAULT_WEEK_START_DAY,
        defaultExportFormat: DEFAULT_EXPORT_FORMAT,
        dashboardLayout: {
          visibleCharts: DEFAULT_VISIBLE_CHARTS as ChartType[],
          chartOrder: DEFAULT_VISIBLE_CHARTS as ChartType[],
        },
        streakCount: 0,
        lastActiveDate: new Date().toISOString().split('T')[0],
        ...updates,
      };
      await db.settings.add(defaultSettings);
    }
  },

  // 更新连续记录天数
  async updateStreak(): Promise<number> {
    const settings = await this.get();
    if (!settings) return 0;

    const today = new Date().toISOString().split('T')[0];
    const lastActive = settings.lastActiveDate;

    // 计算日期差
    const lastDate = new Date(lastActive);
    const todayDate = new Date(today);
    const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

    let newStreak = settings.streakCount;

    if (diffDays === 0) {
      // 今天已经记录过，不改变streak
      newStreak = settings.streakCount;
    } else if (diffDays === 1) {
      // 连续记录
      newStreak = settings.streakCount + 1;
    } else {
      // 中断了，重新开始
      newStreak = 1;
    }

    await this.update({
      streakCount: newStreak,
      lastActiveDate: today,
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
