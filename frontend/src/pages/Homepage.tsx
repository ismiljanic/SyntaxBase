import React, { useState, useEffect } from 'react';
import '../styles/Homepage.css';
import { HomepageHeader } from './HomepageHeader';
import { Footer2 } from './Footer2';
import { Footer } from './Footer';
import CoursesList from '../components/CoursesList';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

const Homepage: React.FC = () => {
    const { isAuthenticated, user, isLoading, getAccessTokenSilently } = useAuth0();
    const [role, setRole] = useState<string | null>(null);
    useEffect(() => {
        const fetchRole = async () => {
            if (user?.sub) {
                const token = await getAccessTokenSilently();
                const response = await axios.get(`http://localhost:8080/api/users/accountInformation/${encodeURIComponent(user.sub)}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setRole(response.data.role);
            }
        };

        fetchRole();
    }, [user]);

    if (isLoading) {
        return <p>Loading user information...</p>;
    }
    return (
        <div className='homepageContainer'>
            <HomepageHeader bgColor="rgb(247, 250, 251)" />
            {role === 'INSTRUCTOR' && (
                <div className="instructor-badge">
                    <span role="img" aria-label="badge">🎓</span> Welcome, Instructor!
                </div>
            )}
            {isAuthenticated && user?.sub ? (
                <CoursesList userId={user.sub} />
            ) : (
                <p
                    className="unauthorized-message"
                    title="Click to go to homepage"
                >
                    Please log in to see your courses.<br />
                </p>
            )}
            <Footer2 bgColor="rgb(247, 250, 251)" />
            <Footer bgColor="rgb(247, 250, 251)" />
        </div>
    );
};

export default Homepage;