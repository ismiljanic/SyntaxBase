import React, { useState, useEffect } from 'react';
import '../styles/Homepage.css';
import { HomepageHeader } from './HomepageHeader';
import { Footer2 } from './Footer2';
import { Footer } from './Footer';
import CoursesList from '../components/CoursesList';
import { useAuth0 } from '@auth0/auth0-react';

const Homepage: React.FC = () => {
    const { isAuthenticated, user, isLoading } = useAuth0();

    if (isLoading) {
        return <p>Loading user information...</p>;
    }

    return (
        <div className='homepageContainer'>
            <HomepageHeader bgColor="rgb(247, 250, 251)" />
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