import React, { useState } from 'react';
import "../styles/NotificationPopup.css";
import SingleNotificationPopup from './SingleNotificationPopup';

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

const truncateMessage = (message: string, wordLimit: number = 5): string => {
    const words = message.split(' ');
    if (words.length > wordLimit) {
        return words.slice(0, wordLimit).join(' ') + '...';
    }
    return message;
};

interface NotificationPopupProps {
    notifications: Notification[];
    onNotificationClick: (notification: Notification) => void;
    onDismiss: (id: number) => void;
    onClose: () => void;
}

const NotificationPopup: React.FC<NotificationPopupProps> = ({
    notifications,
    onNotificationClick,
    onDismiss,
    onClose,
}) => {
    // Filter unread notifications only
    const unreadNotifications = notifications.filter(notification => !notification.read);
    const [openPopupId, setOpenPopupId] = useState<number | null>(null); 

    const handleNotificationClick = (notification: Notification) => {
        onNotificationClick(notification);
        setOpenPopupId(notification.id);
    };

    const handleCloseSinglePopup = () => {
        setOpenPopupId(null); 
    };

    return (
        <div className="notification-popup">
            <button className="close-button" onClick={onClose}>
                &times;
            </button>
            {unreadNotifications.length === 0 ? (
                <p>No new notifications</p>
            ) : (
                unreadNotifications.map(notification => (
                    <div
                        key={notification.id}
                        className="notification-summary"
                        onClick={() => handleNotificationClick(notification)}
                    >
                        <div className="notification-text">
                            <strong>{notification.username}:</strong> {truncateMessage(notification.message)}
                        </div>
                        <small className="notification-date">{new Date(notification.createdAt).toLocaleString()}</small>
                        {openPopupId === notification.id && ( 
                            <SingleNotificationPopup
                                notification={notification}
                                onDismiss={(id) => {
                                    onDismiss(id);
                                    handleCloseSinglePopup(); 
                                }}
                                onClose={handleCloseSinglePopup} 
                            />
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default NotificationPopup;
