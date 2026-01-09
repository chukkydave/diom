import { useState, useEffect, useCallback } from 'react';
import { NotificationLog } from '@/types/admin';

const STORAGE_KEY = 'diom_notifications';

const getInitialNotifications = (): NotificationLog[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  }

  // Sample data for demo
  const sampleNotifications: NotificationLog[] = [
    {
      id: 'notif-1',
      bookingId: 'booking-1',
      type: 'email',
      recipient: 'customer@example.com',
      subject: 'Your Tracking Number: DIOM-20250109-A1B2',
      message: 'Your shipment has been booked. Track it using: DIOM-20250109-A1B2',
      status: 'sent',
      sentAt: '2025-01-09T10:30:00Z',
    },
    {
      id: 'notif-2',
      bookingId: 'booking-2',
      type: 'sms',
      recipient: '+234 800 123 4567',
      message: 'Your package is out for delivery. Expected arrival: 2-4 PM',
      status: 'sent',
      sentAt: '2025-01-09T09:15:00Z',
    },
    {
      id: 'notif-3',
      bookingId: 'booking-3',
      type: 'whatsapp',
      recipient: '+234 801 234 5678',
      message: 'Quote ready for your shipment. Total: ₦15,500. Reply YES to confirm.',
      status: 'sent',
      sentAt: '2025-01-08T16:45:00Z',
    },
    {
      id: 'notif-4',
      bookingId: 'booking-4',
      type: 'email',
      recipient: 'failed@example.com',
      subject: 'Delivery Confirmation',
      message: 'Your package has been delivered successfully.',
      status: 'failed',
      sentAt: '2025-01-08T14:20:00Z',
    },
    {
      id: 'notif-5',
      bookingId: 'booking-5',
      type: 'sms',
      recipient: '+234 802 345 6789',
      message: 'Your shipment is in transit. Tracking: DIOM-20250107-C3D4',
      status: 'pending',
      sentAt: '2025-01-09T11:00:00Z',
    },
  ];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleNotifications));
  return sampleNotifications;
};

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setNotifications(getInitialNotifications());
    setIsLoading(false);
  }, []);

  const saveNotifications = useCallback((newNotifications: NotificationLog[]) => {
    setNotifications(newNotifications);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newNotifications));
  }, []);

  const createNotification = useCallback((notifData: Omit<NotificationLog, 'id' | 'sentAt'>): NotificationLog => {
    const newNotif: NotificationLog = {
      ...notifData,
      id: crypto.randomUUID(),
      sentAt: new Date().toISOString(),
    };

    const newNotifications = [newNotif, ...notifications];
    saveNotifications(newNotifications);
    return newNotif;
  }, [notifications, saveNotifications]);

  const updateNotificationStatus = useCallback((notifId: string, status: NotificationLog['status']) => {
    const newNotifications = notifications.map(notif => {
      if (notif.id !== notifId) return notif;
      return { ...notif, status };
    });
    saveNotifications(newNotifications);
  }, [notifications, saveNotifications]);

  const deleteNotification = useCallback((notifId: string) => {
    const newNotifications = notifications.filter(n => n.id !== notifId);
    saveNotifications(newNotifications);
  }, [notifications, saveNotifications]);

  const getNotificationsByBooking = useCallback((bookingId: string) => {
    return notifications.filter(n => n.bookingId === bookingId);
  }, [notifications]);

  const getNotificationsByType = useCallback((type: NotificationLog['type']) => {
    return notifications.filter(n => n.type === type);
  }, [notifications]);

  const getNotificationsByStatus = useCallback((status: NotificationLog['status']) => {
    return notifications.filter(n => n.status === status);
  }, [notifications]);

  return {
    notifications,
    isLoading,
    createNotification,
    updateNotificationStatus,
    deleteNotification,
    getNotificationsByBooking,
    getNotificationsByType,
    getNotificationsByStatus,
  };
};
