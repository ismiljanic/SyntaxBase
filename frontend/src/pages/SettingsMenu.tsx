import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/SettingsMenu.css';
import { useAuth0 } from '@auth0/auth0-react';
import { useNotificationSocket } from '../services/notificationSocket';

type SettingsMenuProps = {
    role: string;
};

export function SettingsMenu({ role }: SettingsMenuProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const [unreadCount, setUnreadCount] = useState(0);
    const { getAccessTokenSilently, logout, user, isAuthenticated } = useAuth0();
    const auth0UserId = user?.sub;

    const handleMenuToggle = () => setMenuOpen(prev => !prev);

    useEffect(() => {
        const fetchUnreadNotifications = async () => {
            if (!auth0UserId) return;
            try {
                const token = await getAccessTokenSilently();
                const res = await axios.get('http://localhost:8090/api/notifications', {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                });
                const unread = res.data.filter((n: any) => !n.read);
                setUnreadCount(unread.length);
            } catch (err) {
                console.error('Failed to fetch notifications:', err);
            }
        };

        if (isAuthenticated) fetchUnreadNotifications();
    }, [auth0UserId, getAccessTokenSilently, isAuthenticated]);

    useNotificationSocket((payload: { unreadCount?: number }) => {
        if (payload.unreadCount !== undefined) {
            setUnreadCount(payload.unreadCount);
        } else {
            setUnreadCount(prev => prev + 1);
        }
    });

    const handleLogout = async () => {
        try {
            const token = await getAccessTokenSilently();
            await fetch("http://localhost:8080/api/auth/logout", {
                method: "POST",
                credentials: "include",
                headers: { Authorization: `Bearer ${token}` },
            });
            logout({ logoutParams: { returnTo: window.location.origin } });
        } catch (e) {
            console.error("Logout failed", e);
        }
    };

    const handleChangePersonalInfo = () => auth0UserId
        ? navigate(`/change-personal-info/${auth0UserId}`)
        : console.error('User ID not found');

    const handleContact = () => auth0UserId
        ? navigate(`/contact/${auth0UserId}`)
        : navigate('/contact');

    const handleAccountInformation = () => auth0UserId
        ? navigate(`/accountInformation/${auth0UserId}`)
        : console.error('User ID not found');

    const handleNotifications = () => auth0UserId
        ? navigate(`/notifications/${auth0UserId}`)
        : console.error('User ID not auth0UserId');

    return (
        <div className={`settings-menu ${role === 'ADMIN' ? 'admin-menu' : 'user-menu'}`}>
            <button className="settings-button" onClick={handleMenuToggle}>
                <div className="line"></div>
                <div className="line"></div>
                <div className="line"></div>
                {unreadCount > 0 && (
                    <span
                        className="settings-badge"
                        onClick={() => navigate(`/notifications/${auth0UserId}`)}
                    >
                        {unreadCount}
                    </span>
                )}
            </button>
            <div className={`settings-dropdown ${menuOpen ? 'show' : ''}`}>
                {role === 'ADMIN' ? (
                    <>
                        <button onClick={() => navigate('/admin')}>Manage Users</button>
                        <button onClick={() => navigate('/admin/settings')}>Admin Settings</button>
                        <button onClick={handleLogout} className="logout-button">Logout</button>
                    </>
                ) : (
                    <>
                        <button onClick={handleAccountInformation}>Account Information</button>
                        <button onClick={handleChangePersonalInfo}>Change Personal Information</button>
                        <button onClick={handleContact}>Contact Us</button>
                        <button onClick={handleNotifications} className="notif-button">
                            New Messages
                            {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
                        </button>
                        <button onClick={handleLogout} className="logout-button">Logout</button>
                    </>
                )}
            </div>
        </div>
    );
}
