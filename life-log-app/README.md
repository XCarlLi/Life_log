# Life Log Application

这是Life Log应用的主目录，基于React 18 + TypeScript + Vite构建。

## 📦 安装

```bash
# 安装依赖
npm install
```

## 🚀 开发

```bash
# 启动开发服务器（默认端口5173）
npm run dev

# 类型检查
npm run type-check

# 代码检查
npm run lint
```

访问 `http://localhost:5173` 查看应用

## 🏗️ 构建

```bash
# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

构建产物将生成在 `dist` 目录

## 📁 项目结构

```
src/
├── components/          # React组件
│   ├── common/         # 通用组件
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── Modal.tsx
│   ├── log/            # 日志相关组件
│   │   ├── LogCard.tsx
│   │   ├── LogList.tsx
│   │   ├── LogForm.tsx
│   │   └── ActiveTaskCard.tsx
│   ├── dashboard/      # 仪表盘组件
│   │   └── DashboardHeader.tsx
│   ├── category/       # 分类组件
│   │   ├── CategoryBadge.tsx
│   │   └── CategoryManager.tsx
│   └── charts/         # 图表组件
│       ├── PieChart.tsx
│       ├── LineChart.tsx
│       ├── BarChart.tsx
│       ├── HeatMap.tsx
│       └── RadarChart.tsx
├── pages/              # 页面组件
│   ├── Home.tsx        # 主页+快速记录
│   ├── Dashboard.tsx   # 数据仪表盘
│   ├── Logs.tsx        # 日志列表（日/周/月视图）
│   ├── Categories.tsx  # 分类管理
│   └── Settings.tsx    # 设置页面
├── stores/             # Zustand状态管理
│   ├── useLogStore.ts      # 日志状态
│   ├── useCategoryStore.ts # 分类状态
│   └── useSettingsStore.ts # 设置状态
├── services/           # 业务逻辑服务
│   ├── db.ts          # IndexedDB数据库操作
│   ├── statistics.ts  # 统计计算服务
│   ├── export.ts      # 数据导出服务
│   └── splitLog.ts    # 跨天任务拆分逻辑
├── types/             # TypeScript类型定义
│   └── index.ts       # 所有类型定义
├── utils/             # 工具函数
│   ├── date.ts        # 日期处理工具（基于date-fns）
│   ├── format.ts      # 格式化工具
│   └── validation.ts  # 数据验证工具（基于Zod）
├── constants/         # 常量配置
│   ├── categories.ts  # 预设分类配置
│   └── index.ts       # 其他常量
├── hooks/             # 自定义React Hooks
│   ├── useTimer.ts    # 计时器Hook
│   └── useStatistics.ts # 统计数据Hook
├── App.tsx            # 主应用组件
└── main.tsx          # 应用入口
```

## 🗄️ 数据存储

应用使用IndexedDB进行本地数据存储，通过Dexie.js进行封装。

### 数据表

| 表名 | 说明 | 主键 |
|------|------|------|
| categories | 分类表 | id (UUID) |
| logs | 日志记录表 | id (UUID) |
| splitLogs | 拆分记录表（跨天任务） | id (UUID) |
| settings | 用户设置表 | id (自增) |

### 数据模型

详细的数据模型定义见 `src/types/index.ts`

## 🎨 样式系统

### Tailwind CSS配置

项目使用Tailwind CSS v3进行样式管理，配置了自定义的暖色调主题。

**主要配置：**
- 自定义颜色系统（暖色调）
- 自定义字体大小
- 自定义圆角和阴影
- 响应式断点

配置文件：`tailwind.config.js`

### 设计令牌

```javascript
// 主色调
primary: '#FF8966'      // 珊瑚橙
secondary: '#FFD4A3'    // 暖杏色
accent: '#FFAD84'       // 桃色

// 背景色
background: '#FFF9F0'   // 米白色
card: '#FFFFFF'         // 纯白

// 文字色
text-primary: '#5C4033'    // 深棕色
text-secondary: '#8B7355'  // 棕灰色
```

## 🔧 核心功能实现

### 1. 数据库操作

```typescript
import { db, logService, categoryService } from './services/db';

// 创建日志
const logId = await logService.create({
  startTime: new Date().toISOString(),
  endTime: null,
  categoryIds: ['category-id-1', 'category-id-2'],
  description: '开发新功能',
  location: '办公室',
  duration: null,
  status: 'active'
});

// 获取日志
const logs = await logService.getAll();
const todayLogs = await logService.getByDate('2025-11-09');
```

### 2. 统计计算

```typescript
import { getDayStatistics, getWeekStatistics } from './services/statistics';

// 获取日统计
const dayStats = await getDayStatistics('2025-11-09');
console.log(dayStats.totalDuration); // 总时长（分钟）
console.log(dayStats.categoryStats); // 分类统计

// 获取周统计
const weekStats = await getWeekStatistics(new Date(), 1); // 周一开始
```

### 3. 数据导出

```typescript
import { exportLogs } from './services/export';

// 导出CSV
await exportLogs(
  logs,
  categories,
  'csv',
  '2025-11-01',
  '2025-11-09'
);

// 导出JSON
await exportLogs(
  logs,
  categories,
  'json',
  '2025-11-01',
  '2025-11-09'
);
```

### 4. 跨天任务处理

```typescript
import { handleLogSplit, isCrossDay } from './services/splitLog';

// 检查是否跨天
if (isCrossDay(log)) {
  // 自动拆分并保存
  await handleLogSplit(log);
}
```

## 🧪 测试

```bash
# 运行单元测试（待实现）
npm run test

# 运行E2E测试（待实现）
npm run test:e2e

# 测试覆盖率
npm run test:coverage
```

## 📊 性能优化

- **代码分割**: 使用React.lazy和Suspense进行路由级别的代码分割
- **虚拟滚动**: 大列表使用react-window进行虚拟滚动
- **数据缓存**: IndexedDB查询结果缓存
- **图表优化**: 使用useMemo缓存图表数据
- **组件优化**: 使用React.memo减少不必要的重渲染

## 🔐 数据安全

- 所有数据存储在本地IndexedDB
- 不涉及后端服务器
- 无数据上传和同步
- 导出数据完全在客户端进行

## 🌐 浏览器兼容性

| 浏览器 | 版本 |
|--------|------|
| Chrome | >= 90 |
| Firefox | >= 88 |
| Safari | >= 14 |
| Edge | >= 90 |

**注意**: 需要浏览器支持IndexedDB和ES2020特性

## 📱 PWA支持（规划中）

- 离线访问
- 安装到桌面
- 推送通知（长任务提醒）
- 后台同步

## 🐛 故障排除

### 常见问题

**1. 数据库初始化失败**
- 清除浏览器IndexedDB数据
- 检查浏览器是否支持IndexedDB
- 查看控制台错误信息

**2. 构建失败**
- 删除node_modules和package-lock.json
- 重新运行npm install
- 检查Node.js版本（需要>=18）

**3. 样式不生效**
- 检查Tailwind CSS配置
- 确保index.css中正确导入了Tailwind
- 清除浏览器缓存

## 📚 参考文档

- [React官方文档](https://react.dev/)
- [TypeScript官方文档](https://www.typescriptlang.org/)
- [Vite官方文档](https://vitejs.dev/)
- [Tailwind CSS官方文档](https://tailwindcss.com/)
- [Dexie.js官方文档](https://dexie.org/)
- [date-fns官方文档](https://date-fns.org/)
- [Recharts官方文档](https://recharts.org/)

## 🎯 开发路线图

### Phase 1: 基础架构 ✅
- [x] 项目初始化
- [x] 数据库层
- [x] 服务层
- [x] 类型定义

### Phase 2: 核心功能（进行中）
- [ ] Zustand状态管理
- [ ] 基础UI组件
- [ ] 任务管理界面
- [ ] 分类选择器

### Phase 3: 数据展示
- [ ] 日/周/月视图
- [ ] 数据可视化仪表盘
- [ ] 统计图表

### Phase 4: 高级功能
- [ ] 分类管理
- [ ] 数据导出界面
- [ ] 长任务提醒
- [ ] 设置页面

### Phase 5: 优化上线
- [ ] 响应式设计
- [ ] PWA配置
- [ ] 性能优化
- [ ] 测试完善

## 💡 技术亮点

1. **类型安全**: 完整的TypeScript类型系统，编译时捕获错误
2. **离线优先**: 基于IndexedDB的本地存储，无需网络连接
3. **智能统计**: 跨天任务自动拆分，多标签平均分配算法
4. **性能优化**: 虚拟滚动、数据缓存、代码分割
5. **用户体验**: 暖色调设计、流畅动画、即时反馈

## 📞 获取帮助

- 查看[项目Wiki](https://github.com/XCarlLi/Life_log/wiki)
- 提交[Issue](https://github.com/XCarlLi/Life_log/issues)
- 查看[FAQ](https://github.com/XCarlLi/Life_log/wiki/FAQ)

---

Made with ❤️ using React + TypeScript + Vite
