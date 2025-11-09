export * from './categories';

// 时间常量
export const MINUTES_PER_HOUR = 60;
export const HOURS_PER_DAY = 24;
export const MINUTES_PER_DAY = MINUTES_PER_HOUR * HOURS_PER_DAY;
export const DAYS_PER_WEEK = 7;
export const MILLISECONDS_PER_SECOND = 1000;
export const SECONDS_PER_MINUTE = 60;

// 描述字段限制
export const DESCRIPTION_MIN_LENGTH = 1;
export const DESCRIPTION_MAX_LENGTH = 140;

// 地点字段限制
export const LOCATION_MAX_LENGTH = 50;

// 分类名称限制
export const CATEGORY_NAME_MAX_LENGTH = 20;

// 长任务阈值选项（小时）
export const LONG_TASK_THRESHOLD_OPTIONS = [1, 3, 6, 12, 24];
export const DEFAULT_LONG_TASK_THRESHOLD = 6;

// 周开始日选项
export const WEEK_START_DAY_OPTIONS = [
  { value: 0, label: '周日' },
  { value: 1, label: '周一' },
] as const;

export const DEFAULT_WEEK_START_DAY = 1; // 周一

// 导出格式
export const EXPORT_FORMATS = ['csv', 'json'] as const;
export const DEFAULT_EXPORT_FORMAT = 'csv';

// 图表类型
export const CHART_TYPES = [
  'pieChart',
  'lineChart',
  'barChart',
  'heatMap',
  'radarChart',
] as const;

// 默认可见图表
export const DEFAULT_VISIBLE_CHARTS = [
  'pieChart',
  'lineChart',
  'barChart',
  'heatMap',
  'radarChart',
];

// Toast持续时间（毫秒）
export const TOAST_DURATION = 3000;

// 本地存储键
export const STORAGE_KEYS = {
  USER_SETTINGS: 'life-log-user-settings',
  DASHBOARD_LAYOUT: 'life-log-dashboard-layout',
} as const;

// 热力图等级阈值（分钟）
export const HEATMAP_LEVEL_THRESHOLDS = {
  LEVEL_0: 0,      // 无数据
  LEVEL_1: 60,     // 1小时
  LEVEL_2: 180,    // 3小时
  LEVEL_3: 360,    // 6小时
  LEVEL_4: 540,    // 9小时
};

// 日期格式
export const DATE_FORMATS = {
  DATE: 'yyyy-MM-dd',
  DATETIME: 'yyyy-MM-dd HH:mm:ss',
  TIME: 'HH:mm',
  MONTH: 'yyyy-MM',
  YEAR: 'yyyy',
  DISPLAY_DATE: 'MM月dd日',
  DISPLAY_DATETIME: 'MM月dd日 HH:mm',
  DISPLAY_WEEKDAY: 'EEEE',
  ISO: "yyyy-MM-dd'T'HH:mm:ssXXX",
} as const;

// 颜色选择器预设颜色
export const PRESET_COLORS = [
  '#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3',
  '#FF8B94', '#A8E6CF', '#FFDAC1', '#B4A7D6',
  '#F8B500', '#6C5CE7', '#00D2D3', '#FD79A8',
  '#A29BFE', '#55EFC4', '#FFEAA7', '#DFE6E9',
];
