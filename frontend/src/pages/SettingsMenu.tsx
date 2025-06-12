import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/SettingsMenu.css';
import { useAuth0 } from '@auth0/auth0-react';

type SettingsMenuProps = {
    role: string;
};

export function SettingsMenu({ role }: SettingsMenuProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { getAccessTokenSilently, logout, user } = useAuth0();
    const auth0UserId = user?.sub;

    const handleMenuToggle = () => setMenuOpen(prev => !prev);

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

    const handleChangePersonalInfo = () => {
        if (auth0UserId) {
            navigate(`/change-personal-info/${auth0UserId}`);
        } else {
            console.error('User ID not found');
        }
    };

    const handleContact = () => {
        if (auth0UserId) {
            navigate(`/contact/${auth0UserId}`);
        } else {
            navigate('/contact');
        }
    };

    const handleAccountInformation = () => {
        if (auth0UserId) {
            navigate(`/accountInformation/${auth0UserId}`);
        } else {
            console.error('User ID not found');
        }
    };

    const handleNotifications = () => {
        if (auth0UserId) {
            navigate(`/notifications/${auth0UserId}`);
        } else {
            console.error('User ID not auth0UserId');
        }
    };

    return (
        <div className={`settings-menu ${role === 'ADMIN' ? 'admin-menu' : 'user-menu'}`}>
            <button className="settings-button" onClick={handleMenuToggle}>
                <div className="line"></div>
                <div className="line"></div>
                <div className="line"></div>
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
                        <button onClick={() => navigate(`/accountInformation/${auth0UserId}`)}>Account Information</button>
                        <button onClick={() => navigate(`/change-personal-info/${auth0UserId}`)}>Change Personal Information</button>
                        <button onClick={() => navigate(`/contact/${auth0UserId}`)}>Contact Us</button>
                        <button onClick={() => navigate(`/notifications/${auth0UserId}`)}>New Messages</button>
                        <button onClick={handleLogout} className="logout-button">Logout</button>
                    </>
                )}
            </div>
        </div>
    );
}
