export type NotificationCategory = 'orders' | 'security' | 'system';
export type NotificationFilter = 'all' | 'unread';
export type NotificationStatus = 'loading' | 'success' | 'error';

export interface InboxNotification {
  readonly id: string;
  readonly title: string;
  readonly message: string;
  readonly category: NotificationCategory;
  readonly createdAt: string;
  readonly read: boolean;
}

export interface NotificationViewModel {
  readonly status: NotificationStatus;
  readonly notifications: readonly InboxNotification[];
  readonly filter: NotificationFilter;
  readonly unreadCount: number;
  readonly actionError?: string;
  readonly loadError?: string;
}

export const INITIAL_VIEW_MODEL: NotificationViewModel = {
  status: 'loading',
  notifications: [],
  filter: 'all',
  unreadCount: 0,
};

export const MAX_NOTIFICATIONS = 20;
