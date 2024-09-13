import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/AccountInformation.css';
import { Header } from './Header';
import { Footer2 } from './Footer2';
import { Footer } from './Footer';

interface User {
    name: string;
    surname: string;
    username: string;
    dateCreated: string;
}

export function AccountInformation() {
    const { userId } = useParams<{ userId: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (userId) {
                    console.log(userId);
                    const response = await axios.get<User>(`http://localhost:8080/api/users/accountInformation/${userId}`);
                    console.log("API Response:", response.data);
                    setUser(response.data);
                }
            } catch (error: any) {
                console.error('Failed to fetch user data:', error);
                if (error.response) {
                    setError(`Error: ${error.response.status} - ${error.response.data}`);
                } else if (error.request) {
                    setError('Error: No response from server');
                } else {
                    setError(`Error: ${error.message}`);
                }
            }
        };
        fetchUserData();
    }, [userId]);

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!user) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className='container'>
            <Header bgColor='#f5f5f5'></Header>
            <div className="account-information">
                <h1 className="account-info-title">Account Information</h1>
                <div className="account-info-item">
                    <strong>Name:</strong> {user.name}
                </div>
                <div className="account-info-item">
                    <strong>Surname:</strong> {user.surname}
                </div>
                <div className="account-info-item">
                    <strong>Username:</strong> {user.username}
                </div>
                <div className="account-info-item">
                    <strong>Date Created:</strong> {user.dateCreated}
                </div>
            </div>
            <Footer2 bgColor='#f5f5f5'></Footer2>
            <Footer bgColor='#f5f5f5'></Footer>
        </div>
    );
}