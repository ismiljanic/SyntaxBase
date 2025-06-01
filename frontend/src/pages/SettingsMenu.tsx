import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/SettingsMenu.css';
import { useAuth0 } from '@auth0/auth0-react';

export function SettingsMenu() {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const baseUrl = process.env.REACT_APP_API_BASE_URL;

    const handleMenuToggle = () => setMenuOpen((prev) => !prev);

    const { getAccessTokenSilently, logout, user } = useAuth0();
    const auth0UserId = user?.sub;

    const handleLogout = async () => {
        try {
            const token = await getAccessTokenSilently();
            await fetch("http://localhost:8080/api/auth/logout", {
                method: "POST",
                credentials: "include",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
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
        <div className="settings-menu">
            <button className="settings-button" onClick={handleMenuToggle}>
                <div className="line"></div>
                <div className="line"></div>
                <div className="line"></div>
            </button>
            <div className={`settings-dropdown ${menuOpen ? 'show' : ''}`}>
                <button onClick={handleAccountInformation}>Account Information</button>
                <button onClick={handleChangePersonalInfo}>Change Personal Information</button>
                <button onClick={handleContact}>Contact Us</button>
                <button onClick={handleNotifications}>New Messages</button>
                <button className="logout-button" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </div>
    );
}
