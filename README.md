# Life Log - 温暖舒适的时间记录工具

<div align="center">

**一款帮助您记录日常活动、优化时间分配、培养良好习惯的Web应用**

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

</div>

---

## ✨ 特性

### 核心功能

- ⏱️ **多任务并行管理** - 同时记录多个进行中的活动
- 🏷️ **多标签分类系统** - 8个预设分类 + 自定义分类，支持多标签
- 📊 **数据可视化** - 饼图、折线图、柱状图、热力图、雷达图
- 📅 **多视图展示** - 日视图、周视图、月视图
- 💾 **数据导出** - 支持CSV和JSON格式
- 🌙 **跨天任务支持** - 自动按自然日拆分统计
- 📍 **地点记录** - 可选的活动地点标记
- 🔥 **连续记录统计** - 追踪您的记录习惯

### 设计理念

- 🎨 **暖色调设计** - 温暖舒适的视觉体验
- 📱 **响应式布局** - 支持桌面端、平板、移动端
- 💪 **离线优先** - 基于IndexedDB的本地存储
- ⚡ **快速响应** - 优化的性能和流畅的动画

---

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0 或 yarn >= 1.22.0

### 安装步骤

1. **克隆仓库**

```bash
git clone https://github.com/XCarlLi/Life_log.git
cd Life_log/life-log-app
```

2. **安装依赖**

```bash
npm install
```

3. **启动开发服务器**

```bash
npm run dev
```

应用将在 `http://localhost:5173` 运行

4. **构建生产版本**

```bash
npm run build
```

构建产物将生成在 `dist` 目录

---

## 📖 使用指南

### 基础操作

#### 1. 开始记录任务

1. 点击"开始新任务"按钮
2. 填写任务描述（1-140字符，必填）
3. 选择一个或多个分类标签
4. （可选）添加地点信息
5. 点击"开始"，任务开始计时

#### 2. 管理进行中的任务

- 在"进行中的任务"区域查看所有活跃任务
- 每个任务显示实时计时
- 点击"结束"完成任务
- 点击"编辑"修改任务信息

#### 3. 查看统计数据

**日视图**
- 时间轴展示当天所有任务
- 查看总时长和任务数量
- 分类分布统计

**周视图**
- 7天汇总统计
- 堆叠柱状图展示分类时间分配
- 周总计和日均时长

**月视图**
- 日历形式展示整月
- 热力图显示每日活跃度
- 月度分类统计

#### 4. 数据可视化

访问仪表盘查看：
- 📊 分类分布饼图
- 📈 每日趋势折线图
- 📊 周时间分配柱状图
- 🗓️ 月度热力图
- 🕸️ 工作生活平衡雷达图

#### 5. 数据导出

1. 选择日期范围
2. 选择分类筛选（可选）
3. 选择导出格式（CSV或JSON）
4. 点击"导出"下载文件

### 高级功能

#### 自定义分类

1. 进入分类管理页面
2. 点击"添加分类"
3. 设置分类名称、颜色和图标
4. 自定义分类可以编辑和删除

#### 多标签统计

- 支持为一个任务选择多个分类
- 统计时采用**平均分配算法**
  - 例如：3小时任务 × 3个标签 = 每个标签1小时

#### 跨天任务处理

- 支持跨越午夜的任务记录
- 自动按自然日拆分统计
- 日视图中标注"延续自昨日"或"跨天至次日"

#### 长任务提醒

- 默认超过6小时的任务会收到提醒
- 可在设置中调整阈值（1/3/6/12/24小时）
- 提醒时可选择结束、继续或稍后提醒

---

## 🏗️ 技术架构

### 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 18 | UI框架 |
| TypeScript | 5 | 类型安全 |
| Vite | 5 | 构建工具 |
| Tailwind CSS | 3 | 样式框架 |
| Zustand | - | 状态管理 |
| Dexie.js | - | IndexedDB封装 |
| Recharts | - | 图表库 |
| date-fns | - | 日期处理 |
| React Hook Form | - | 表单管理 |
| Zod | - | 数据验证 |

### 项目结构

```
Life_log/
├── PRD.md                          # 产品需求文档
├── README.md                       # 项目说明
└── life-log-app/                   # 应用主目录
    ├── src/
    │   ├── components/             # React组件
    │   │   ├── common/            # 通用组件（按钮、输入框等）
    │   │   ├── log/               # 日志相关组件
    │   │   ├── dashboard/         # 仪表盘组件
    │   │   ├── category/          # 分类管理组件
    │   │   └── charts/            # 图表组件
    │   ├── pages/                 # 页面组件
    │   │   ├── Home.tsx           # 主页
    │   │   ├── Dashboard.tsx      # 仪表盘
    │   │   ├── Logs.tsx           # 日志列表
    │   │   ├── Categories.tsx     # 分类管理
    │   │   └── Settings.tsx       # 设置
    │   ├── stores/                # Zustand状态管理
    │   │   ├── useLogStore.ts     # 日志状态
    │   │   ├── useCategoryStore.ts # 分类状态
    │   │   └── useSettingsStore.ts # 设置状态
    │   ├── services/              # 业务逻辑服务
    │   │   ├── db.ts              # 数据库操作
    │   │   ├── statistics.ts      # 统计计算
    │   │   ├── export.ts          # 导出功能
    │   │   └── splitLog.ts        # 跨天拆分
    │   ├── types/                 # TypeScript类型定义
    │   ├── utils/                 # 工具函数
    │   ├── constants/             # 常量配置
    │   └── hooks/                 # 自定义Hooks
    ├── public/                    # 静态资源
    ├── package.json               # 依赖配置
    ├── vite.config.ts             # Vite配置
    ├── tailwind.config.js         # Tailwind配置
    └── tsconfig.json              # TypeScript配置
```

### 数据模型

详见 [PRD.md](./PRD.md#3-数据模型)

---

## 📊 预设分类

| 图标 | 分类 | 颜色 | 用途 |
|------|------|------|------|
| 🏢 | 工作 | #FF6B6B | 工作相关活动 |
| 🎮 | 娱乐 | #4ECDC4 | 休闲娱乐 |
| 🚗 | 通勤 | #FFE66D | 上下班通勤 |
| 😴 | 休息 | #95E1D3 | 睡眠休息 |
| 🍔 | 吃饭 | #FF8B94 | 用餐时间 |
| 📚 | 学习 | #A8E6CF | 学习进修 |
| 💪 | 运动 | #FFDAC1 | 健身运动 |
| 👨‍👩‍👧‍👦 | 社交 | #B4A7D6 | 社交活动 |

---

## 🎨 设计系统

### 暖色调配色

```
主色调：
- Primary: #FF8966 (珊瑚橙)
- Secondary: #FFD4A3 (暖杏色)
- Accent: #FFAD84 (桃色)

背景色：
- Background: #FFF9F0 (米白色)
- Card: #FFFFFF (纯白)
- Border: #FFE4D6 (淡橙)

文字色：
- Primary: #5C4033 (深棕色)
- Secondary: #8B7355 (棕灰色)
```

---

## 🛠️ 开发指南

### 开发命令

```bash
# 启动开发服务器
npm run dev

# 类型检查
npm run type-check

# 代码检查
npm run lint

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

### 代码规范

- 使用ESLint进行代码检查
- 使用Prettier进行代码格式化
- 遵循React Hooks规则
- TypeScript严格模式

### Git提交规范

```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式（不影响代码运行的变动）
refactor: 重构
test: 测试
chore: 构建过程或辅助工具的变动
```

---

## 📝 待办事项

- [ ] Zustand状态管理
- [ ] 基础UI组件库
- [ ] 多任务并行管理界面
- [ ] 分类选择器（多标签）
- [ ] 日/周/月视图页面
- [ ] 数据可视化仪表盘
- [ ] 分类管理页面
- [ ] 导出功能界面
- [ ] 长任务提醒功能
- [ ] 响应式设计优化
- [ ] PWA配置
- [ ] 单元测试
- [ ] E2E测试

---

## 🤝 贡献

欢迎提交Issue和Pull Request！

### 贡献步骤

1. Fork本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交Pull Request

---

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

---

## 📮 联系方式

项目地址: [https://github.com/XCarlLi/Life_log](https://github.com/XCarlLi/Life_log)

---

## 🙏 鸣谢

- React团队
- Vite团队
- Tailwind CSS团队
- 所有开源贡献者

---

<div align="center">

**用心记录生活，用数据优化人生** ❤️

Made with ❤️ by Carl Li

</div>
