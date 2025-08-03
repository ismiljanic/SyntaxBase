import React, { useState, useCallback } from 'react';
import SingleNotificationPopup from './SingleNotificationPopup';
import { useNotificationSocket } from '../services/notificationSocket';
import axios from 'axios';
import '../styles/NotificationPopup.css';

interface Notification {
  id: number;
  userId: number;
  postId: number;
  replyId: number;
  message: string;
  read: boolean;
  createdAt: string;
  username: string;
}

const NotificationPopup: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const handleNewNotification = useCallback((notification: Notification) => {
    setNotifications((prev) => [notification, ...prev]);
  }, []);

  useNotificationSocket(handleNewNotification);

  const dismissNotification = async (id: number) => {
    try {
      await axios.put(`http://localhost:8090/api/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error('Failed to mark notification as read', error);
    }
  };

  const closeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <section aria-label="Notifications" className="notification-popup-container">
      {notifications.length === 0 ? (
        <div className="no-notifications">
          <p>No new notifications</p>
        </div>
      ) : (
        notifications.map((notification) => (
          <SingleNotificationPopup
            key={notification.id}
            notification={notification}
            onDismiss={dismissNotification}
            onClose={() => closeNotification(notification.id)}
          />
        ))
      )}
    </section>
  );
};

export default NotificationPopup;
