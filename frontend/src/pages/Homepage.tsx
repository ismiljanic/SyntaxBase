import React, { useState, useEffect } from 'react';
import '../styles/Homepage.css';
import { HomepageHeader } from './HomepageHeader';
import { Footer2 } from './Footer2';
import { Footer } from './Footer';
import CoursesList from '../components/CoursesList';

const Homepage: React.FC = () => {
    const [userId, setUserId] = useState<string | null>(null);
    const [loadingUserId, setLoadingUserId] = useState<boolean>(true);

    useEffect(() => {
        const storedUserId = sessionStorage.getItem('userId');
        if (storedUserId) {
            setUserId(storedUserId);
        }
        setLoadingUserId(false);
    }, []);


    if (loadingUserId) {
        return <p>Loading user information...</p>;
    }

    return (
        <div className='homepageContainer'>
            <HomepageHeader bgColor='rgb(247, 250, 251)' />
            {userId ? (
                <CoursesList userId={Number(userId)} />
            ) : (
                <p>Please log in to see your courses.</p>
            )}
            <Footer2 bgColor='rgb(247, 250, 251)' />
            <Footer bgColor="rgb(247, 250, 251)" />
        </div>
    );
};

export default Homepage;
