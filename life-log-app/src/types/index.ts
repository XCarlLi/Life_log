// ============ 分类 (Category) ============
export interface Category {
  id: string;                // UUID
  name: string;              // 分类名称，最大20字符
  color: string;             // HEX颜色，如 "#FF6B6B"
  icon?: string;             // emoji图标，如 "🏢"
  description?: string;      // 可选描述
  isPreset: boolean;         // 是否为预设分类（不可删除）
  order: number;             // 排序权重
  createdAt: Date;           // 创建时间
  updatedAt: Date;           // 更新时间
}

// 预设分类类型
export type DefaultCategoryType =
  | 'work'
  | 'entertainment'
  | 'commute'
  | 'rest'
  | 'meal'
  | 'study'
  | 'exercise'
  | 'social';

// ============ 日志条目 (LogEntry) ============
export interface LogEntry {
  id: string;                // UUID
  startTime: Date;           // 开始时间
  endTime?: Date;            // 结束时间，undefined表示进行中
  categoryIds: string[];     // 分类ID数组（多标签）
  description: string;       // 1-140字符
  location?: string;         // 可选，最大50字符
  createdAt: Date;           // 创建时间
  updatedAt: Date;           // 更新时间
}

// ============ 拆分记录 (用于跨天统计) ============
export interface SplitLogEntry {
  id: string;                // UUID
  parentId: string;          // 原始LogEntry的ID
  date: string;              // 所属日期 "2025-11-08"
  startTime: string;         // 拆分后的开始时间
  endTime: string;           // 拆分后的结束时间
  duration: number;          // 该段时长（分钟）
  categoryIds: string[];     // 继承自父记录
  description: string;       // 继承自父记录
  location?: string;         // 继承自父记录
  isFirst: boolean;          // 是否为拆分的第一段
  isLast: boolean;           // 是否为拆分的最后一段
}

// ============ 统计缓存 ============
export interface StatisticsCache {
  date: string;              // "2025-11-08"
  totalDuration: number;     // 分钟
  categoryStats: CategoryStat[];
  logCount: number;
  calculatedAt: string;
}

export interface CategoryStat {
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  totalSeconds: number;      // 秒
  percentage: number;        // 百分比
  count: number;             // 任务数量
}

// ============ 用户设置 ============
export interface UserSettings {
  id?: string;
  theme: 'light' | 'dark';
  language: 'zh-CN' | 'en-US';
  weekStartsOn: 0 | 1;            // 0=周日, 1=周一
  longTaskThreshold: number;      // 小时数，默认6
  enableNotifications: boolean;
  dashboardLayout: DashboardLayout;
  exportFormat: 'csv' | 'json';
  consecutiveDays: number;        // 连续记录天数
  longestStreak: number;          // 最长记录天数
  totalLogCount: number;          // 总记录数
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardLayout {
  widgets: Array<{
    id: string;
    enabled: boolean;
    order: number;
  }>;
}

export type ChartType =
  | 'pieChart'           // 分类分布饼图
  | 'lineChart'          // 每日趋势折线图
  | 'barChart'           // 周时间分配柱状图
  | 'heatMap'            // 月度热力图
  | 'radarChart';        // 工作生活平衡雷达图

// ============ 导出数据格式 ============
export interface ExportData {
  exportDate: string;           // 导出时间
  dateRange: {
    start: string;              // "2025-11-01"
    end: string;                // "2025-11-08"
  };
  logs: LogEntry[];
  summary: {
    totalDuration: number;      // 总时长（分钟）
    logCount: number;           // 日志数量
    categoryStats: CategoryStat[];
  };
}

// ============ 过滤器 ============
export interface LogFilter {
  dateRange?: {
    start: string;
    end: string;
  };
  categoryIds?: string[];        // 分类筛选
  location?: string;             // 地点筛选
  status?: 'active' | 'completed' | 'all';
}

// ============ 统计数据 ============
export interface DayStatistics {
  date: string;                  // "2025-11-08"
  totalSeconds: number;          // 总时长（秒）
  logCount: number;              // 日志数量
  categoryStats: CategoryStat[];
  logs: LogEntry[];
}

export interface WeekStatistics {
  weekStart: string;             // 周开始日期
  weekEnd: string;               // 周结束日期
  totalSeconds: number;          // 总时长（秒）
  averagePerDay: number;         // 日均时长（秒）
  logCount: number;
  dailyStats: DayStatistics[];   // 7天的统计
  categoryStats: CategoryStat[];
}

export interface MonthStatistics {
  year: number;
  month: number;                 // 1-12
  totalDuration: number;
  logCount: number;
  dayStats: DayStatistics[];
  categoryStats: CategoryStat[];
}

// ============ 图表数据格式 ============
export interface PieChartData {
  name: string;                  // 分类名称
  value: number;                 // 时长（分钟）
  color: string;                 // 颜色
  percentage: number;            // 百分比
}

export interface LineChartData {
  label: string;                 // "11-08"
  totalDuration?: number;        // 总时长（秒）
  [key: string]: number | string | undefined;
}

export interface BarChartData {
  label: string;                 // "周一"
  [categoryId: string]: number | string; // 分类ID: 时长（秒）
}

export interface HeatMapCell {
  date: string;                  // "2025-11-08"
  duration: number;              // 时长（分钟）
  level: 0 | 1 | 2 | 3 | 4;     // 热度等级（0=无数据，4=最高）
}

export interface RadarChartData {
  category: string;              // 分类名称
  value: number;                 // 时长（分钟）
  fullMark: number;              // 满分值（用于标准化）
}

// ============ Toast通知 ============
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;             // 显示时长（毫秒），默认3000
}

// ============ 模态框 ============
export interface ModalState {
  isOpen: boolean;
  type?: 'createLog' | 'editLog' | 'deleteLog' | 'createCategory' | 'editCategory' | 'deleteCategory' | 'longTaskReminder';
  data?: any;
}

// ============ 表单数据 ============
export interface LogFormData {
  startTime: string;
  endTime?: string;
  categoryIds: string[];
  description: string;
  location?: string;
}

export interface CategoryFormData {
  name: string;
  color: string;
  emoji?: string;
}

// ============ 视图类型 ============
export type ViewType = 'day' | 'week' | 'month';

// ============ 排序方式 ============
export type SortBy = 'startTime' | 'duration' | 'createdAt';
export type SortOrder = 'asc' | 'desc';
