import React from 'react';
import "../styles/NotificationPopup.css";

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

interface SingleNotificationPopupProps {
    notification: Notification;
    onDismiss: (id: number) => void;
    onClose: () => void;
}

const SingleNotificationPopup: React.FC<SingleNotificationPopupProps> = ({
    notification,
    onDismiss,
    onClose,
}) => {
    return (    
        <div className={`notification ${notification.read ? 'readNotification2' : 'unreadNotification2'}`}>
            <button className="close-button" onClick={onClose} aria-label="Close notification">
                &times;
            </button>

            <div className="notification-content">
                <div className="notification-text">
                    <strong>{notification.username}</strong>: {notification.message}
                </div>
                <small className="notification-date">
                    {new Date(notification.createdAt).toLocaleString()}
                </small>
                <button className="mark-read-button" onClick={() => onDismiss(notification.id)}>
                    Mark as read
                </button>
            </div>
        </div>
    );
};

export default SingleNotificationPopup;
