import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/AccountInformation.css';
import { Header } from './Header';
import { Footer2 } from './Footer2';
import { Footer } from './Footer';
import { useAuth0 } from '@auth0/auth0-react';

interface User {
    name: string;
    surname: string;
    username: string;
    dateCreated: string;
}

interface Post {
    id: number;
    content: string;
    userId: number;
    username: string;
    createdAt: string;
}

interface UserAccount {
    name: string;
    surname: string;
    username: string;
    dateCreated: string;
    userPosts: Post[];
    deletedPosts: Post[];
}

export function AccountInformation() {
    const { userId } = useParams<{ userId: string }>();
    const [accountInfo, setAccountInfo] = useState<UserAccount | null>(null);
    const [error, setError] = useState<string>('');
    const [showMorePosts, setShowMorePosts] = useState<boolean>(false);
    const [showMoreDeletedPosts, setShowMoreDeletedPosts] = useState<boolean>(false);
    const initialPostCount = 5;
    const { getAccessTokenSilently, isAuthenticated } = useAuth0();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (userId) {
                    const token = await getAccessTokenSilently();

                    const response = await axios.get<UserAccount>(
                        `http://localhost:8080/api/users/accountInformation/${encodeURIComponent(userId)}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    setAccountInfo(response.data);
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

    if (!accountInfo) {
        return <div className="loading">Loading...</div>;
    }

    const toggleShowMorePosts = () => {
        setShowMorePosts(!showMorePosts);
    };

    const toggleShowMoreDeletedPosts = () => {
        setShowMoreDeletedPosts(!showMoreDeletedPosts);
    };

    return (
        <div className='accountDiv'>
            <Header bgColor='#fcfafa' />
            <h1 className='account'>Account Information</h1>
            <div className="account-container">
                <div className="account-info-section">
                    <button onClick={() => window.location.href = '/request-instructor'}>
                        Become Instructor
                    </button>
                    <div className="account-info-title">About Your Account</div>
                    <div className="account-info-item">
                        <strong>Name:</strong> <span className="account-info-value">{accountInfo?.name}</span>
                    </div>
                    <div className="account-info-item">
                        <strong>Surname:</strong> <span className="account-info-value">{accountInfo?.surname}</span>
                    </div>
                    <div className="account-info-item">
                        <strong>Username:</strong> <span className="account-info-value">{accountInfo?.username}</span>
                    </div>
                    <div className="account-info-item">
                        <strong>Date Created:</strong> <span className="account-info-value">{new Date(accountInfo?.dateCreated).toLocaleDateString()}</span>
                    </div>
                </div>

                <div className="user-posts-section">
                    <h2 className="user-posts-title">Your Posts</h2>
                    <div className="user-posts-content">
                        {accountInfo.userPosts.length > 0 ? (
                            accountInfo.userPosts.slice(0, showMorePosts ? accountInfo.userPosts.length : initialPostCount).map(post => (
                                <div key={post.id} className="user-post-item">
                                    <div className="user-post-header">
                                        <strong className="user-post-date">{new Date(post.createdAt).toLocaleString()}</strong>
                                    </div>
                                    <p className="user-post-content">{post.content}</p>
                                </div>
                            ))
                        ) : (
                            <p className="no-posts-message">No posts found.</p>
                        )}
                        {accountInfo.userPosts.length > initialPostCount && (
                            <button className="show-more-button" onClick={toggleShowMorePosts}>
                                {showMorePosts ? 'Show Less' : 'Show More'}
                            </button>
                        )}
                    </div>
                </div>

                <div className="deleted-posts-section">
                    <h2 className="deleted-posts-title">Deleted Posts</h2>
                    <div className="deleted-posts-content">
                        {accountInfo.deletedPosts.length > 0 ? (
                            accountInfo.deletedPosts.slice(0, showMoreDeletedPosts ? accountInfo.deletedPosts.length : initialPostCount).map(post => (
                                <div key={post.id} className="deleted-post-item">
                                    <div className="deleted-post-header">
                                        <strong className="deleted-post-date">{new Date(post.createdAt).toLocaleString()}</strong>
                                        <span className="deleted-post-status"> (Deleted)</span>
                                    </div>
                                    <p className="deleted-post-content">{post.content}</p>
                                </div>
                            ))
                        ) : (
                            <p className="no-deleted-posts-message">No deleted posts found.</p>
                        )}
                        {accountInfo.deletedPosts.length > initialPostCount && (
                            <button className="show-more-button" onClick={toggleShowMoreDeletedPosts}>
                                {showMoreDeletedPosts ? 'Show Less' : 'Show More'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <Footer2 bgColor='rgb(227, 238, 246)' />
            <Footer bgColor='rgb(227, 238, 246)' />
        </div>
    );
}
