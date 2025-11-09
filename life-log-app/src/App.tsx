import { useEffect, useState } from 'react';
import { initializeDatabase } from './services/db';

function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        await initializeDatabase();
        setIsInitialized(true);
        console.log('✅ Life Log 应用初始化成功！');
      } catch (err) {
        setError(err instanceof Error ? err.message : '初始化失败');
        console.error('❌ 初始化失败:', err);
      }
    };

    init();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-white rounded-large p-8 shadow-large max-w-md">
          <h1 className="text-h2 text-error mb-4">初始化失败</h1>
          <p className="text-body text-text-secondary">{error}</p>
        </div>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-body text-text-secondary">正在初始化...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 临时首页 */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary mb-2">
              Life Log
            </h1>
            <p className="text-body text-text-secondary">
              温暖、舒适的时间记录工具
            </p>
          </div>

          {/* 状态卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-medium p-6 shadow-small">
              <div className="text-3xl mb-2">✅</div>
              <h3 className="text-h3 mb-2">数据库已就绪</h3>
              <p className="text-small text-text-secondary">
                IndexedDB 已初始化
              </p>
            </div>

            <div className="bg-white rounded-medium p-6 shadow-small">
              <div className="text-3xl mb-2">🎨</div>
              <h3 className="text-h3 mb-2">暖色调主题</h3>
              <p className="text-small text-text-secondary">
                Tailwind CSS 已配置
              </p>
            </div>

            <div className="bg-white rounded-medium p-6 shadow-small">
              <div className="text-3xl mb-2">🏗️</div>
              <h3 className="text-h3 mb-2">架构完成</h3>
              <p className="text-small text-text-secondary">
                TypeScript + Zustand
              </p>
            </div>
          </div>

          {/* 功能预览 */}
          <div className="bg-white rounded-large p-8 shadow-medium">
            <h2 className="text-h2 mb-6">核心功能</h2>
            <ul className="space-y-3 text-body">
              <li className="flex items-start">
                <span className="text-primary mr-3">⏱️</span>
                <span>多任务并行管理 - 同时记录多个活动</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-3">🏷️</span>
                <span>多标签分类系统 - 8个预设分类 + 自定义分类</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-3">📊</span>
                <span>数据可视化 - 饼图、折线图、柱状图、热力图、雷达图</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-3">📅</span>
                <span>多视图展示 - 日视图、周视图、月视图</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-3">💾</span>
                <span>数据导出 - 支持CSV和JSON格式</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-3">🌙</span>
                <span>跨天任务支持 - 自动按自然日拆分统计</span>
              </li>
            </ul>
          </div>

          {/* 开发状态 */}
          <div className="mt-8 text-center">
            <div className="inline-block bg-primary/10 rounded-medium px-6 py-3">
              <p className="text-small text-primary font-medium">
                🚧 正在开发中 - UI组件即将完成
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
