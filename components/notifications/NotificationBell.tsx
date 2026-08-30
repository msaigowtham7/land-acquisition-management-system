'use client';

import { useState } from 'react';
import { Bell, ChevronDown } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { cn } from '@/lib/utils';

interface NotificationBellProps {
  className?: string;
}

export function NotificationBell({ className }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const {
    notifications,
    unreadCount,
    markAsRead,
    deleteNotification,
    markAllAsRead,
  } = useNotifications();

  const recentNotifications = notifications.slice(0, 5);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'text-red-600';
      case 'high':
        return 'text-orange-600';
      case 'medium':
        return 'text-yellow-600';
      default:
        return 'text-blue-600';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'relative p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition',
          className
        )}
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center font-semibold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="border-b border-gray-200 p-4 flex items-center justify-between bg-gov-50">
            <h3 className="font-semibold text-gov-900">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllAsRead()}
                  className="text-xs text-gov-accent hover:underline font-medium"
                >
                  Mark all as read
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto flex-1">
            {recentNotifications.length === 0 ? (
              <div className="p-8 text-center text-gov-600">
                <Bell className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {recentNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={cn(
                      'p-3 hover:bg-gray-50 transition cursor-pointer',
                      !notif.isRead && 'bg-blue-50'
                    )}
                    onClick={() => markAsRead(notif.id)}
                  >
                    <div className="flex gap-2">
                      <div className={cn('text-lg flex-shrink-0', getPriorityColor(notif.priority))}>
                        🔔
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gov-900 truncate">
                          {notif.title}
                        </p>
                        <p className="text-xs text-gov-600 mt-1 line-clamp-2">
                          {notif.message}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notif.id);
                        }}
                        className="text-gray-400 hover:text-red-600 flex-shrink-0"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-3 bg-gov-50 text-center">
            <a
              href="/notifications"
              className="text-sm font-medium text-gov-accent hover:underline"
            >
              View all notifications
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
