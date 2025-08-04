import React from 'react';
import { Notification } from '../models/Notifications';
import '../styles/NotificationItem.css';

interface Props {
  notification: Notification;
  onMarkAsRead: (id: number) => void;
}

const NotificationItem: React.FC<Props> = ({ notification, onMarkAsRead }) => {
  const handleClick = () => {
    if (!notification.read) {
      const confirm = window.confirm('Mark this notification as read?');
      if (confirm) {
        onMarkAsRead(notification.id);
      }
    } 
  };

  return (
    <div
      className={`notif-item ${notification.read ? 'read' : 'unread'}`}
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="notif-header">
        <strong>{notification.username}</strong>
        <small>{new Date(notification.createdAt).toLocaleString()}</small>
      </div>
      <p>{notification.message}</p>
    </div>
  );
};

export default NotificationItem;