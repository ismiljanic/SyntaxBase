import React, { useState, useEffect } from 'react';
import '../styles/Homepage.css';
import { HomepageHeader } from './HomepageHeader';
import { Footer2 } from './Footer2';
import { Footer } from './Footer';
import CoursesList from '../components/CoursesList';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Homepage: React.FC = () => {
    const { isAuthenticated, user, isLoading, getAccessTokenSilently } = useAuth0();
    const [role, setRole] = useState<string | null>(null);
    const [createdCourses, setCreatedCourses] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            if (user?.sub) {
                const token = await getAccessTokenSilently();

                const roleResponse = await axios.get(
                    `http://localhost:8080/api/users/accountInformation/${encodeURIComponent(user.sub)}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setRole(roleResponse.data.role);

                if (roleResponse.data.role === 'INSTRUCTOR') {
                    const createdResponse = await axios.get(
                        `http://localhost:8080/api/courses/user/${encodeURIComponent(user.sub)}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    setCreatedCourses(createdResponse.data);
                }
            }
        };

        fetchData();
    }, [user, getAccessTokenSilently]);

    const handleCreateCourseClick = () => {
        navigate('/create-course');
    };

    if (isLoading) {
        return <p>Loading user information...</p>;
    }

    return (
        <div className='homepageContainer'>
            <HomepageHeader bgColor="rgb(247, 250, 251)" />

            {role === 'INSTRUCTOR' && (
                <div className="instructor-badge">
                    <span role="img" aria-label="badge">🎓</span> Welcome, Instructor!
                    <button onClick={handleCreateCourseClick} className="create-course-button">
                        + Create Course
                    </button>
                </div>
            )}

            {isAuthenticated && user?.sub ? (
                <>
                    <CoursesList userId={user.sub} title="Enrolled Courses" isCreatorList={false} />
                    {role === 'INSTRUCTOR' && createdCourses.length > 0 && (
                        <CoursesList userId={user.sub} title="Created Courses" courses={createdCourses} isCreatorList={true} />
                    )}
                </>
            ) : (
                <p>Please log in to see your courses.</p>
            )}

            <Footer2 bgColor="rgb(247, 250, 251)" />
            <Footer bgColor="rgb(247, 250, 251)" />
        </div>
    );
};

export default Homepage;
