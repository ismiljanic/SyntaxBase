// pages/NotificationsPage.tsx
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNotificationSocket } from '../services/notificationSocket';
import NotificationItem from '../components/NotificationItem';
import { Notification } from '../models/Notifications';
import '../styles/NotificationsPage.css';
import { Header } from './Header';
import { Footer } from './Footer';
import { Footer2 } from './Footer2';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

export function NotificationsPage() {
  const { userId } = useParams<{ userId: string }>();
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { getAccessTokenSilently } = useAuth0();
  const unreadNotifications = notifications.filter(n => !n.read);

  useNotificationSocket((notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
    setLoading(false);
  });


  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = await getAccessTokenSilently();
        const res = await axios.get<Notification[]>('http://localhost:8090/api/notifications', {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const sortedNotifications = res.data.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setNotifications(sortedNotifications);
      } catch (err) {
        console.error('Error fetching notifications:', err);
      }
    };

    if (userId) fetchNotifications();
  }, [userId, getAccessTokenSilently]);



  const markAsRead = async (id: number) => {
    try {
      const token = await getAccessTokenSilently();
      await axios.put(`http://localhost:8090/api/notifications/${id}/read`, {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error('Failed to mark as read', err);
    }
  };


  return (
    <div>
      <Header bgColor='#f6f6f6'></Header>
      <div className="notif-page">
        <h2>
          New messages and notifications
        </h2>

        <div className="notif-list">
          {unreadNotifications.length === 0 ? (
            <div className="empty-state">No unread notifications.</div>
          ) : (
            unreadNotifications.map(n => (
              <NotificationItem key={n.id} notification={n} onMarkAsRead={markAsRead} />
            ))
          )}
        </div>
      </div>
      <Footer2 bgColor='#f6f6f6'></Footer2>
      <Footer bgColor='#f6f6f6'></Footer>
    </div>
  );
}
