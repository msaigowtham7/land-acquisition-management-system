'use client';

import { useState } from 'react';
import { Bell, X, CheckCheck, MessageSquareX } from 'lucide-react';
import { Notification } from '@/store/notificationStore';
import { formatDateTime, calculateDaysAgo } from '@/lib/utils';
import Link from 'next/link';

interface NotificationPanelProps {
  notifications: Notification[];
  unreadCount: number;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onMarkAllAsRead: () => void;
}

export function NotificationPanel({
  notifications,
  unreadCount,
  onMarkAsRead,
  onDelete,
  onMarkAllAsRead,
}: NotificationPanelProps) {
  const [selectedNotif, setSelectedNotif] = useState<Notification | null>(null);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 border-red-300 text-red-800';
      case 'high':
        return 'bg-orange-100 border-orange-300 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      default:
        return 'bg-blue-100 border-blue-300 text-blue-800';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical':
        return '🔴';
      case 'high':
        return '🟠';
      case 'medium':
        return '🟡';
      default:
        return '🔵';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gov-900">Notifications</h2>
          {unreadCount > 0 && (
            <p className="text-sm text-gov-600 mt-1">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllAsRead}
            className="px-3 py-2 text-sm font-medium text-gov-accent hover:bg-gov-100 rounded-lg transition"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="card p-8 text-center">
          <Bell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gov-600 font-medium">No notifications</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`card p-4 border-l-4 cursor-pointer transition ${
                notif.isRead ? 'bg-white' : 'bg-blue-50'
              } ${getPriorityColor(notif.priority)}`}
              onClick={() => {
                if (!notif.isRead) {
                  onMarkAsRead(notif.id);
                }
                setSelectedNotif(notif);
              }}
            >
              <div className="flex gap-3 items-start">
                {/* Priority Indicator */}
                <div className="text-xl mt-1 flex-shrink-0">
                  {getPriorityBadge(notif.priority)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-gov-900">{notif.title}</h3>
                      <p className="text-sm mt-1 text-gov-700">{notif.message}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gov-600">
                        {notif.projectId && (
                          <span className="bg-gov-200 px-2 py-1 rounded">
                            {notif.projectId}
                          </span>
                        )}
                        {notif.state && (
                          <span className="bg-gov-200 px-2 py-1 rounded">
                            {notif.state}
                          </span>
                        )}
                        <span>{calculateDaysAgo(notif.createdAt)}</span>
                      </div>
                    </div>
                    {!notif.isRead && (
                      <div className="w-2 h-2 bg-gov-accent rounded-full flex-shrink-0 mt-1" />
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(notif.id);
                  }}
                  className="p-1 text-gov-600 hover:bg-white hover:bg-opacity-50 rounded transition flex-shrink-0"
                  title="Delete notification"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
