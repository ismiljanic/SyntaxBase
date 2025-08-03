import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Notification {
    id: number;
    userId: number; 
    postId: number; 
    replyId: number;
    message: string;
    isRead: boolean;
    createdAt: string;
}

interface NotificationsProps {
    userId: number;
}

const Notifications: React.FC<NotificationsProps> = ({ userId }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get(`http://localhost:8090/api/posts/notifications/${userId}`);
                setNotifications(response.data);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();
    }, [userId]);

    return (
        <div className="notifications">
            <h3>Notifications</h3>
            {notifications.length > 0 ? (
                notifications.map(notification => (
                    <div key={notification.id} className={`notification ${notification.isRead ? 'read' : 'unread'}`}>
                        <p>{notification.message}</p>
                        <small>{new Date(notification.createdAt).toLocaleString()}</small>
                    </div>
                ))
            ) : (
                <p>No new notifications.</p>
            )}
        </div>
    );
};

export default Notifications;
