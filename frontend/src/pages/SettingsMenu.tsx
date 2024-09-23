import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/SettingsMenu.css';

export function SettingsMenu() {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const handleMenuToggle = () => setMenuOpen(prev => !prev);

    const handleLogout = async () => {
        try {
            await axios.get("http://localhost:8080/api/logout");
            sessionStorage.removeItem('userToken');
            sessionStorage.removeItem('userId');
            sessionStorage.removeItem('redirectAfterLogin');
            navigate('/login');
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const handleChangePersonalInfo = () => {
        const userId = sessionStorage.getItem('userId');
        if (userId) {
            navigate(`/change-personal-info/${userId}`);
        } else {
            console.error('User ID not found');
        }
    };


    const handleContact = () => {
        const userId = sessionStorage.getItem('userId');
        navigate(`/contact/${userId}`);
    };
    const handleAccountInformation = () => {
        const userId = sessionStorage.getItem('userId');
        if (userId) {
            navigate(`/accountInformation/${userId}`);
        } else {
            console.error('User ID not found');
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
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
}
