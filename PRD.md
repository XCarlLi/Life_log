# Life Log 产品需求文档 (PRD)

**版本**: 1.0
**日期**: 2025-11-09
**项目类型**: Web应用
**开发周期**: 约7个工作日

---

## 1. 产品概述

### 1.1 产品定位
Life Log 是一个温暖、舒适的时间记录工具，帮助用户记录日常活动，养成良好的时间管理习惯。通过直观的数据可视化，让用户清晰了解时间分配，优化生活工作平衡。

### 1.2 核心价值
- 🎯 **简单易用**: 快速记录，无学习成本
- 📊 **数据洞察**: 可视化呈现时间分配
- 🎨 **温暖设计**: 暖色调界面，愉悦的使用体验
- 💪 **习惯养成**: 通过连续记录培养自我管理能力

### 1.3 目标用户
- 需要时间管理的职场人士
- 希望优化生活平衡的自由职业者
- 想要培养自律习惯的个人

---

## 2. 功能需求

### 2.1 核心功能

#### 2.1.1 时间记录
**功能描述**: 用户可以记录活动的开始时间和结束时间

**交互流程**:
```
用户点击"开始新任务"
→ 填写描述(必填,1-140字)
→ 选择分类(多标签)
→ 添加地点(可选)
→ 点击"开始"
→ 任务进入"进行中"状态
→ 点击"结束"
→ 任务完成，自动计算时长
```

**多任务并行支持**:
- 允许同时进行多个任务
- "进行中任务"区域显示所有活跃任务
- 每个任务独立计时
- 可选择性结束任何一个任务

**智能时间处理**:
- 如果用户直接点"结束"但没有对应的"开始"，提示用户补充开始时间
- 长时间未结束的任务（默认>6小时）自动提醒用户
- 支持跨天任务（自动按自然日拆分用于统计）

#### 2.1.2 分类系统
**预设分类** (8个，不可删除):
- 🏢 工作 (Work) - #FF6B6B
- 🎮 娱乐 (Entertainment) - #4ECDC4
- 🚗 通勤 (Commute) - #FFE66D
- 😴 休息 (Rest) - #95E1D3
- 🍔 吃饭 (Meal) - #FF8B94
- 📚 学习 (Study) - #A8E6CF
- 💪 运动 (Exercise) - #FFDAC1
- 👨‍👩‍👧‍👦 社交 (Social) - #B4A7D6

**分类管理**:
- 用户可添加自定义分类（需指定名称、颜色）
- 用户可删除自定义分类（删除后该分类的log保留，显示为"未分类"）
- 支持多标签：一个任务可选择多个分类
- 多标签统计：采用**平均分配**算法（3小时任务×3标签=每个标签1小时）

#### 2.1.3 地点记录
- 可选字段，自由文本输入
- 最大50字符
- 用于记录活动发生地点（如：办公室、家里、咖啡厅）

#### 2.1.4 描述字段
- **必填**字段
- 纯文本，1-140字符
- 支持中文、英文、数字、标点、emoji
- 实时显示字符计数

### 2.2 查看功能

#### 2.2.1 日视图
- 以时间轴形式展示当天所有任务
- 显示每条log的：开始时间、结束时间、时长、分类、描述、地点
- 跨天任务标注"[延续自昨日]"或"[跨天至次日]"
- 支持编辑、删除操作
- 显示当日统计：总时长、任务数量、分类分布

#### 2.2.2 周视图
- 显示本周7天的汇总数据
- 堆叠柱状图展示每天的分类时间分配
- 周总计时长、日均时长
- 可切换周起始日（周一/周日）

#### 2.2.3 月视图
- 日历形式展示整月
- 每日显示总时长
- 月度分类统计
- 点击日期跳转到日视图

### 2.3 数据可视化

#### 2.3.1 仪表盘布局
```
┌─────────────────────────────────────────┐
│  📊 Dashboard - 今日概览                │
│  ⏱️ 总时长: 8h 30m  📝 记录: 5条        │
│  🔥 连续记录: 12天                      │
├─────────────────────────────────────────┤
│  [分类分布饼图]  [每日趋势折线图]       │
├─────────────────────────────────────────┤
│  [本周时间分配堆叠柱状图]               │
├─────────────────────────────────────────┤
│  [月度热力图]                           │
├─────────────────────────────────────────┤
│  [工作生活平衡雷达图]                   │
└─────────────────────────────────────────┘
```

#### 2.3.2 图表类型
1. **分类分布饼图**: 展示各分类时间占比
2. **每日趋势折线图**: 近7天/30天总时长趋势
3. **周时间分配堆叠柱状图**: 7天×分类的二维展示
4. **月度热力图**: 日历形式，颜色深浅表示时长
5. **工作生活平衡雷达图**: 8大分类的雷达图（支持切换周/月数据）

#### 2.3.3 仪表盘自定义
- 用户可拖拽调整图表顺序
- 用户可隐藏/显示特定图表
- 设置保存在LocalStorage

### 2.4 导出功能

#### 2.4.1 CSV导出
```csv
开始时间,结束时间,时长(分钟),分类,地点,描述
2025-11-08 09:00:00,2025-11-08 12:00:00,180,工作;学习,办公室,开发新功能
```

#### 2.4.2 JSON导出
```json
{
  "exportDate": "2025-11-08T15:30:00+08:00",
  "dateRange": {
    "start": "2025-11-01",
    "end": "2025-11-08"
  },
  "logs": [
    {
      "id": "uuid",
      "startTime": "2025-11-08T09:00:00+08:00",
      "endTime": "2025-11-08T12:00:00+08:00",
      "duration": 180,
      "categories": ["工作", "学习"],
      "location": "办公室",
      "description": "开发新功能"
    }
  ],
  "summary": {
    "totalDuration": 510,
    "logCount": 5,
    "categoryStats": {...}
  }
}
```

#### 2.4.3 导出筛选
- 按日期范围筛选
- 按分类筛选（支持多选）
- 按地点筛选

### 2.5 其他功能

#### 2.5.1 分类管理
- 查看所有分类列表
- 添加自定义分类（名称、颜色选择器）
- 编辑自定义分类
- 删除自定义分类（需二次确认）

#### 2.5.2 设置
- 长任务提醒阈值（1/3/6/12/24小时，默认6小时）
- 周起始日（周日/周一，默认周一）
- 默认导出格式（CSV/JSON）

---

## 3. 数据模型

### 3.1 Category (分类)
```typescript
interface Category {
  id: string;                // UUID
  name: string;              // 分类名称，最大20字符
  color: string;             // HEX颜色，如 "#FF6B6B"
  emoji?: string;            // emoji图标，如 "🏢"
  isDefault: boolean;        // 是否为预设分类（不可删除）
  order: number;             // 排序权重
  createdAt: string;         // ISO 8601时间戳
  updatedAt: string;
}
```

### 3.2 LogEntry (日志条目)
```typescript
interface LogEntry {
  id: string;                // UUID
  startTime: string;         // ISO 8601，如 "2025-11-08T09:00:00+08:00"
  endTime: string | null;    // null表示进行中
  categoryIds: string[];     // 分类ID数组（多标签）
  description: string;       // 1-140字符
  location?: string;         // 可选，最大50字符
  duration: number | null;   // 分钟数，进行中为null
  status: 'active' | 'completed'; // 任务状态
  createdAt: string;
  updatedAt: string;
}
```

### 3.3 SplitLogEntry (拆分记录 - 用于跨天统计)
```typescript
interface SplitLogEntry {
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
```

### 3.4 UserSettings (用户设置)
```typescript
interface UserSettings {
  longTaskThreshold: number;      // 小时数，默认6
  weekStartDay: 0 | 1;            // 0=周日, 1=周一
  defaultExportFormat: 'csv' | 'json';
  dashboardLayout: {
    visibleCharts: string[];      // 显示的图表ID
    chartOrder: string[];         // 图表顺序
  };
  streakCount: number;            // 连续记录天数
  lastActiveDate: string;         // 最后活跃日期
}
```

---

## 4. UI/UX设计

### 4.1 暖色调设计系统

#### 4.1.1 色彩规范
```
主色调:
- Primary: #FF8966 (珊瑚橙)
- Primary Hover: #FF7549
- Primary Light: #FFB199

次要色:
- Secondary: #FFD4A3 (暖杏色)
- Accent: #FFAD84 (桃色)

背景色:
- Background: #FFF9F0 (米白色)
- Card Background: #FFFFFF
- Card Border: #FFE4D6

文字色:
- Primary Text: #5C4033 (深棕色)
- Secondary Text: #8B7355 (棕灰色)
- Disabled Text: #C4B5A0

状态色:
- Success: #A8E6CF (薄荷绿)
- Warning: #FFE66D (暖黄色)
- Error: #FF8B94 (柔和红)
- Info: #A8D8EA (柔和蓝)
```

#### 4.1.2 字体规范
```
字体家族:
- 中文: "PingFang SC", "Microsoft YaHei"
- 英文: "Inter", "SF Pro Display"
- 数字: "JetBrains Mono" (等宽，用于时间显示)

字号:
- H1: 32px (页面标题)
- H2: 24px (区块标题)
- H3: 18px (卡片标题)
- Body: 14px (正文)
- Small: 12px (辅助信息)
```

#### 4.1.3 圆角与阴影
```
圆角:
- Small: 8px (按钮、输入框)
- Medium: 12px (卡片)
- Large: 16px (模态框)

阴影:
- Small: 0 2px 8px rgba(255,137,102,0.08)
- Medium: 0 4px 16px rgba(255,137,102,0.12)
- Large: 0 8px 24px rgba(255,137,102,0.16)
```

### 4.2 响应式设计

#### 4.2.1 断点
```
- Desktop: 1440px+ (主要优化目标)
- Laptop: 1024px - 1439px
- Tablet: 768px - 1023px
- Mobile: 375px - 767px
```

#### 4.2.2 布局适配
```
Desktop/Laptop:
- 侧边栏导航 + 主内容区
- 仪表盘采用Grid布局（2列）

Tablet:
- 顶部导航 + 主内容区
- 仪表盘采用Grid布局（1列）

Mobile:
- 底部Tab导航
- 所有图表单列展示
- 简化数据展示
```

### 4.3 交互设计

#### 4.3.1 微交互
- 按钮hover时轻微放大（scale: 1.05）
- 卡片hover时阴影加深
- 加载状态使用骨架屏而非spinner
- 操作成功使用Toast提示（右上角，3秒自动消失）

#### 4.3.2 动画
- 页面切换：淡入淡出（duration: 200ms）
- 列表项添加：从上滑入（duration: 300ms）
- 模态框：缩放弹出（duration: 250ms）
- 所有动画使用 ease-in-out

---

## 5. 技术架构

### 5.1 技术栈
```
前端框架: React 18 + TypeScript
构建工具: Vite 5
样式方案: Tailwind CSS 3
路由: React Router 6
状态管理: Zustand
图表库: Recharts
日期处理: date-fns
表单管理: React Hook Form
数据验证: Zod
数据库: IndexedDB (Dexie.js)
工具库: lodash-es
```

### 5.2 项目结构
```
/src
  /components
    /common
      Button.tsx
      Input.tsx
      Card.tsx
      Modal.tsx
      Select.tsx
      DatePicker.tsx
    /log
      LogCard.tsx
      LogList.tsx
      LogForm.tsx
      ActiveTaskCard.tsx
    /dashboard
      DashboardHeader.tsx
      PieChart.tsx
      LineChart.tsx
      BarChart.tsx
      HeatMap.tsx
      RadarChart.tsx
    /category
      CategoryBadge.tsx
      CategoryManager.tsx
      CategoryForm.tsx
  /pages
    Home.tsx              # 主页+快速记录
    Dashboard.tsx         # 仪表盘
    Logs.tsx             # 日志列表（日/周/月视图）
    Categories.tsx        # 分类管理
    Settings.tsx          # 设置
  /stores
    useLogStore.ts        # 日志状态
    useCategoryStore.ts   # 分类状态
    useSettingsStore.ts   # 设置状态
  /services
    db.ts                 # 数据库操作
    export.ts             # 导出功能
    statistics.ts         # 统计计算
    splitLog.ts           # 跨天拆分逻辑
  /types
    index.ts              # 所有TypeScript类型定义
  /utils
    date.ts               # 日期工具函数
    format.ts             # 格式化函数
    validation.ts         # 验证函数
  /constants
    categories.ts         # 预设分类
    colors.ts             # 颜色常量
  /hooks
    useTimer.ts           # 计时器hook
    useStatistics.ts      # 统计数据hook
  App.tsx
  main.tsx
```

### 5.3 数据流
```
用户操作
→ React Component
→ Zustand Action
→ Service Layer (业务逻辑)
→ DB Layer (IndexedDB)
→ 更新Zustand State
→ 触发Component重渲染
```

### 5.4 性能优化
- 使用React.memo减少不必要的渲染
- 大列表使用虚拟滚动（react-window）
- 图表数据采用useMemo缓存
- IndexedDB查询结果缓存
- 图片/图标使用SVG或IconFont
- 代码分割（React.lazy + Suspense）

---

## 6. 开发计划

### Sprint 1: 基础框架 (Day 1)
- [x] 项目初始化（Vite + React + TS）
- [x] Tailwind配置 + 暖色调主题
- [x] 项目结构搭建
- [x] TypeScript类型定义
- [x] IndexedDB配置（Dexie.js）
- [x] 基础UI组件（Button, Input, Card等）

### Sprint 2: 核心功能 (Day 2-3)
- [ ] 多任务并行管理
  - [ ] 创建新任务
  - [ ] 开始/结束任务
  - [ ] 编辑进行中任务
  - [ ] 任务列表展示
- [ ] 分类系统
  - [ ] 预设8个分类
  - [ ] 多标签选择器
- [ ] 表单验证（描述、地点）
- [ ] 长任务提醒

### Sprint 3: 视图功能 (Day 4)
- [ ] 日视图（时间轴 + 列表）
- [ ] 周视图（汇总统计）
- [ ] 月视图（日历）
- [ ] 跨天任务拆分逻辑
- [ ] CRUD操作（编辑、删除）

### Sprint 4: 数据可视化 (Day 5)
- [ ] 仪表盘主页
- [ ] 分类分布饼图
- [ ] 每日趋势折线图
- [ ] 周时间分配柱状图
- [ ] 月度热力图
- [ ] 工作生活平衡雷达图
- [ ] 连续记录天数统计

### Sprint 5: 高级功能 (Day 6)
- [ ] 分类管理页面
- [ ] 导出功能（CSV/JSON）
- [ ] 日期范围筛选
- [ ] 分类筛选
- [ ] 仪表盘自定义（拖拽排序）
- [ ] 设置页面

### Sprint 6: 优化上线 (Day 7)
- [ ] 响应式设计调整
- [ ] 性能优化
- [ ] 错误处理
- [ ] PWA配置（manifest.json, service worker）
- [ ] 首次使用体验优化
- [ ] 测试与bug修复

---

## 7. 验收标准

### 7.1 功能完整性
- ✅ 能够创建、编辑、删除日志
- ✅ 支持多任务并行
- ✅ 支持多标签分类
- ✅ 跨天任务正确拆分和统计
- ✅ 所有图表正常显示
- ✅ 导出功能正常工作

### 7.2 性能指标
- ✅ 首屏加载时间 < 2秒
- ✅ 页面切换响应 < 200ms
- ✅ 支持至少1000条日志无卡顿
- ✅ Lighthouse性能分数 > 90

### 7.3 用户体验
- ✅ UI符合暖色调设计
- ✅ 移动端可用（基本功能）
- ✅ 无明显bug和错误
- ✅ 操作流畅，反馈及时

---

## 8. 风险与缓解

### 8.1 技术风险
**风险**: IndexedDB浏览器兼容性
**缓解**: 添加LocalStorage降级方案

**风险**: 大量数据导致性能问题
**缓解**: 实现分页、虚拟滚动、数据归档

### 8.2 产品风险
**风险**: 用户不理解多标签统计逻辑
**缓解**: 在统计页面添加说明提示

**风险**: 跨天任务展示混乱
**缓解**: 明确标注"延续自昨日"等提示

---

## 9. 后续迭代方向

### V2.0 (可选)
- 数据云同步（需后端）
- 多用户支持（登录系统）
- AI洞察分析（时间使用建议）
- 数据导入功能
- 番茄钟集成
- 目标设定与追踪

### V3.0 (可选)
- 移动APP（React Native）
- 团队协作功能
- 高级统计报表
- 数据对比分析

---

**文档版本历史**
- V1.0 (2025-11-09): 初始版本，覆盖MVP所有需求
