import { create } from 'zustand';

export interface Notification {
  id: string;
  userId: string;
  projectId?: string;
  state?: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
  relatedEntity?: string;
}

export type NotificationType = 
  | 'proposal_submitted'
  | 'proposal_scrutiny'
  | 'approval_pending'
  | 'approval_approved'
  | 'approval_rejected'
  | 'document_missing'
  | 'verification_pending'
  | 'notification_issued'
  | 'award_declared'
  | 'compensation_pending'
  | 'compensation_disbursed'
  | 'possession_pending'
  | 'rr_pending'
  | 'milestone_delayed'
  | 'deadline_approaching';

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error?: string;
  filters: {
    projectId?: string;
    state?: string;
    type?: NotificationType;
  };
  fetchNotifications: (userId: string) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAsUnread: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  setFilter: (filter: string, value: string | undefined) => void;
  clearFilters: () => void;
}

const notificationMessages: Record<NotificationType, { title: string; description: (data: any) => string; priority: 'low' | 'medium' | 'high' | 'critical' }> = {
  proposal_submitted: {
    title: 'Proposal Submitted',
    description: (data) => `Project "${data.projectName}" proposal has been submitted for review`,
    priority: 'medium',
  },
  proposal_scrutiny: {
    title: 'Proposal Under Scrutiny',
    description: (data) => `Project "${data.projectName}" is now undergoing digital scrutiny`,
    priority: 'medium',
  },
  approval_pending: {
    title: 'Approval Pending',
    description: (data) => `Approval required for project "${data.projectName}" in ${data.state}`,
    priority: 'high',
  },
  approval_approved: {
    title: 'Project Approved',
    description: (data) => `Project "${data.projectName}" has been approved by the authority`,
    priority: 'medium',
  },
  approval_rejected: {
    title: 'Project Rejected',
    description: (data) => `Project "${data.projectName}" proposal has been rejected. Reason: ${data.reason}`,
    priority: 'critical',
  },
  document_missing: {
    title: 'Missing Documents',
    description: (data) => `${data.count} required documents are missing for project "${data.projectName}"`,
    priority: 'high',
  },
  verification_pending: {
    title: 'Verification Pending',
    description: (data) => `Field verification pending for ${data.count} land parcels in project "${data.projectName}"`,
    priority: 'high',
  },
  notification_issued: {
    title: 'Notification Issued',
    description: (data) => `Official notification has been issued for project "${data.projectName}" in ${data.state}`,
    priority: 'medium',
  },
  award_declared: {
    title: 'Award Declared',
    description: (data) => `Award declared for ${data.count} land parcels in project "${data.projectName}"`,
    priority: 'high',
  },
  compensation_pending: {
    title: 'Compensation Pending',
    description: (data) => `Compensation assessment pending for ${data.count} affected families in "${data.projectName}"`,
    priority: 'high',
  },
  compensation_disbursed: {
    title: 'Compensation Disbursed',
    description: (data) => `Compensation of ₹${data.amount} disbursed to ${data.count} beneficiaries in project "${data.projectName}"`,
    priority: 'medium',
  },
  possession_pending: {
    title: 'Possession Pending',
    description: (data) => `Physical possession of ${data.count} land parcels pending in project "${data.projectName}"`,
    priority: 'high',
  },
  rr_pending: {
    title: 'R&R Implementation Pending',
    description: (data) => `Rehabilitation & Resettlement for ${data.count} families pending in "${data.projectName}"`,
    priority: 'high',
  },
  milestone_delayed: {
    title: 'Project Milestone Delayed',
    description: (data) => `Project "${data.projectName}" milestone "${data.milestone}" is delayed by ${data.days} days`,
    priority: 'critical',
  },
  deadline_approaching: {
    title: 'Deadline Approaching',
    description: (data) => `Deadline for "${data.activity}" in project "${data.projectName}" is approaching in ${data.days} days`,
    priority: 'high',
  },
};

const generateMockNotifications = (userId: string): Notification[] => {
  const today = new Date();
  const types: NotificationType[] = [
    'proposal_submitted',
    'approval_pending',
    'document_missing',
    'verification_pending',
    'award_declared',
    'compensation_pending',
    'possession_pending',
    'rr_pending',
    'milestone_delayed',
    'deadline_approaching',
  ];

  return types.map((type, index) => {
    const config = notificationMessages[type];
    const daysAgo = index * 2;
    const createdAt = new Date(today);
    createdAt.setDate(createdAt.getDate() - daysAgo);

    const mockData = {
      projectName: 'National Highway Expansion - NH-44',
      state: 'Uttar Pradesh',
      count: 5 + index,
      amount: (5000000 * (index + 1)).toLocaleString(),
      reason: 'Incomplete environmental clearance documentation',
      milestone: 'Land Notification',
      days: 5 - index,
      activity: 'Land Verification',
    };

    return {
      id: `NOTIF-${userId}-${index}`,
      userId,
      projectId: 'PROJ-2024-001',
      state: 'Uttar Pradesh',
      type,
      title: config.title,
      message: config.description(mockData),
      priority: config.priority,
      isRead: index > 2,
      createdAt,
      actionUrl: `/projects/PROJ-2024-001`,
      relatedEntity: 'PROJ-2024-001',
    };
  });
};

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: undefined,
  filters: {},

  fetchNotifications: async (userId: string) => {
    set({ loading: true, error: undefined });
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const notifications = generateMockNotifications(userId);
      const unreadCount = notifications.filter(n => !n.isRead).length;
      set({ notifications, unreadCount, loading: false });
    } catch (error) {
      set({ loading: false, error: 'Failed to fetch notifications' });
    }
  },

  markAsRead: async (notificationId: string) => {
    set((state) => {
      const notifications = state.notifications.map((n) =>
        n.id === notificationId ? { ...n, isRead: true } : n
      );
      const unreadCount = notifications.filter(n => !n.isRead).length;
      return { notifications, unreadCount };
    });
  },

  markAsUnread: async (notificationId: string) => {
    set((state) => {
      const notifications = state.notifications.map((n) =>
        n.id === notificationId ? { ...n, isRead: false } : n
      );
      const unreadCount = notifications.filter(n => !n.isRead).length;
      return { notifications, unreadCount };
    });
  },

  markAllAsRead: async () => {
    set((state) => {
      const notifications = state.notifications.map((n) => ({ ...n, isRead: true }));
      return { notifications, unreadCount: 0 };
    });
  },

  deleteNotification: async (notificationId: string) => {
    set((state) => {
      const notifications = state.notifications.filter((n) => n.id !== notificationId);
      const unreadCount = notifications.filter(n => !n.isRead).length;
      return { notifications, unreadCount };
    });
  },

  setFilter: (filterName: string, value: string | undefined) => {
    set((state) => ({
      filters: {
        ...state.filters,
        [filterName]: value,
      },
    }));
  },

  clearFilters: () => {
    set({ filters: {} });
  },
}));
