import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { path: '/', icon: '🏠', label: '首页' },
  { path: '/dashboard', icon: '📊', label: '仪表盘' },
  { path: '/logs', icon: '📝', label: '日志' },
  { path: '/categories', icon: '🏷️', label: '分类' },
  { path: '/settings', icon: '⚙️', label: '设置' },
];

export const Navigation: React.FC = () => {
  return (
    <nav className="bg-white shadow-soft border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="text-3xl">⏰</div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Life Log</h1>
              <p className="text-xs text-gray-500">温暖的时间记录</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-white shadow-soft'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`
                }
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-strong z-50">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive ? 'text-primary' : 'text-gray-600'
                }`
              }
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};
