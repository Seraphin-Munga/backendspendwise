export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'reminder';
  date: Date;
  isRead: boolean;
  icon?: string;
}



