'use client';

import { useEffect } from 'react';
import { useNotificationStore } from '@/store/notificationStore';
import { useAuth } from './useAuth';

export const useNotifications = () => {
  const { user } = useAuth();
  const store = useNotificationStore();

  useEffect(() => {
    if (user?.id) {
      store.fetchNotifications(user.id);
      // Optionally poll for new notifications every 30 seconds
      const interval = setInterval(() => {
        store.fetchNotifications(user.id);
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [user?.id, store]);

  return {
    notifications: store.notifications,
    unreadCount: store.unreadCount,
    loading: store.loading,
    error: store.error,
    filters: store.filters,
    markAsRead: store.markAsRead,
    markAsUnread: store.markAsUnread,
    markAllAsRead: store.markAllAsRead,
    deleteNotification: store.deleteNotification,
    setFilter: store.setFilter,
    clearFilters: store.clearFilters,
  };
};
