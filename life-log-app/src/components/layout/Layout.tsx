import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Navigation } from './Navigation';
import { ToastContainer } from '../common';
import { useToastStore, useCategoryStore, useSettingsStore } from '../../stores';
import { useLongTaskNotification } from '../../hooks';
import { initializeDatabase } from '../../services/db';

export const Layout: React.FC = () => {
  const { toasts, removeToast } = useToastStore();
  const { loadCategories } = useCategoryStore();
  const { loadSettings } = useSettingsStore();

  // Enable long task notifications
  useLongTaskNotification();

  useEffect(() => {
    // Initialize database and load initial data
    const initializeApp = async () => {
      try {
        await initializeDatabase();
        await loadCategories();
        await loadSettings();
      } catch (error) {
        console.error('Failed to initialize app:', error);
      }
    };

    initializeApp();
  }, [loadCategories, loadSettings]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
        <Outlet />
      </main>
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
};
