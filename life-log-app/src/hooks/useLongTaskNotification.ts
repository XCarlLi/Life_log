import { useEffect, useRef } from 'react';
import { useLogStore, useSettingsStore, useToastStore } from '../stores';

export const useLongTaskNotification = () => {
  const { activeLogs } = useLogStore();
  const { settings } = useSettingsStore();
  const { addToast } = useToastStore();
  const notifiedTasksRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!settings?.enableNotifications || activeLogs.length === 0) {
      return;
    }

    const checkInterval = setInterval(() => {
      const now = new Date();
      const thresholdMs = (settings.longTaskThreshold || 6) * 60 * 60 * 1000; // Convert hours to milliseconds

      activeLogs.forEach((log) => {
        const duration = now.getTime() - new Date(log.startTime).getTime();

        // Check if task exceeds threshold and hasn't been notified yet
        if (duration >= thresholdMs && !notifiedTasksRef.current.has(log.id)) {
          notifiedTasksRef.current.add(log.id);

          // Show notification
          addToast(
            'warning',
            '长任务提醒',
            `任务"${log.description}"已进行超过${settings.longTaskThreshold}小时`,
            8000
          );

          // Browser notification (if permission granted)
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Life Log - 长任务提醒', {
              body: `任务"${log.description}"已进行超过${settings.longTaskThreshold}小时`,
              icon: '/favicon.ico',
              tag: log.id,
            });
          }
        }
      });

      // Clean up notified tasks that are no longer active
      const activeLogIds = new Set(activeLogs.map((log) => log.id));
      notifiedTasksRef.current.forEach((id) => {
        if (!activeLogIds.has(id)) {
          notifiedTasksRef.current.delete(id);
        }
      });
    }, 60000); // Check every minute

    return () => clearInterval(checkInterval);
  }, [activeLogs, settings, addToast]);

  // Request notification permission
  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        addToast('success', '通知已启用', '将在任务时间过长时提醒你');
      }
    }
  };

  return { requestNotificationPermission };
};
