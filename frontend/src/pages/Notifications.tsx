import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/Notifications.css';
import { Header } from './Header';
import { Footer2 } from './Footer2';
import { Footer } from './Footer';

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

interface Post {
    id: number;
    userId: number;
    content: string;
    createdAt: string;
    username: string;
    replies: Post[];
}

export function Notifications() {
    const { userId } = useParams<{ userId: string }>();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);

    const fetchNotifications = async () => {
        if (!userId) return;

        try {
            const response = await fetch(`http://localhost:8080/api/posts/notifications/${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch notifications');
            }
            const data: Notification[] = await response.json();

            const sortedNotifications = data.sort((a, b) => {
                if (!a.read && b.read) return -1;  
                if (a.read && !b.read) return 1;  
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); 
            });

            setNotifications(sortedNotifications);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchPostAndReplies = async (postId: number) => {
        try {
            const response = await fetch(`http://localhost:8080/api/posts/${postId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch post and replies');
            }
            const postData: Post = await response.json();
            setSelectedPost(postData);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred.');
            }
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [userId]);

    const handleNotificationClick = async (notification: Notification) => {
        if (!notification.read) {
            try {
                const response = await fetch(`http://localhost:8080/api/notifications/${notification.id}/mark-read`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to mark notification as read');
                }
                await fetchNotifications();
            } catch (err) {
                console.error(err);
            }
        }

        setSelectedPost(null);
        fetchPostAndReplies(notification.postId);
    };

    return (
        <div className="containerNotifications">
            <Header bgColor='rgb(247, 250, 251)' />
            <div className="contentNotification">
                <h1>Notifications</h1>
                {loading && <p>Loading notifications...</p>}
                {error && <p className="errorNotifications">{error}</p>}

                {selectedPost ? (
                    <div className="notification-detail">
                        <div className="post-container">
                            <h2 className="original-message-title">Original Message</h2>
                            <p className="original-message-content">{selectedPost.content}</p>
                            <small className="original-message-date">
                                Created At: {new Date(selectedPost.createdAt).toLocaleString()}
                            </small>

                            <div className="replies-container">
                                {selectedPost.replies.length > 0 ? (
                                    <ul className="replies-list">
                                        {selectedPost.replies.map(reply => (
                                            <li key={reply.id} className="reply-item">
                                                <div className="reply-header">
                                                    <h3 className="reply-username">{reply.username}</h3>
                                                    <span className="reply-date">{new Date(reply.createdAt).toLocaleString()}</span>
                                                </div>
                                                <p className="reply-content">{reply.content}</p>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="no-replies">No replies yet.</p>
                                )}
                            </div>
                        </div>
                        <button onClick={() => setSelectedPost(null)}>Back to Notifications</button>
                    </div>
                ) : (
                    <div id="notification-list">
                        {notifications.map(notification => (
                            <div
                                key={notification.id}
                                className={`notification ${notification.read ? 'readNotification' : 'unreadNotification'}`}
                                onClick={() => handleNotificationClick(notification)}
                            >
                                <div>
                                    <p>{notification.username}: {notification.message}</p>
                                    <small>{new Date(notification.createdAt).toLocaleString()}</small>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer2 bgColor='rgb(247, 250, 251)' />
            <Footer bgColor='rgb(247, 250, 251)' />
        </div>
    );
}
