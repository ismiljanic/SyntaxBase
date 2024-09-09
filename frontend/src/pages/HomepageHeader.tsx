import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Use React Router for navigation
import '../styles/Header.css';
import picture from '../images/logoSyntaxBase.png';

export function HomepageHeader() {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Example logged-in state
    const navigate = useNavigate(); // React Router's navigate function

    // Handle redirect to login page if not logged in
    const handleProtectedNavigation = (path: string) => {
        if (!isLoggedIn) {
            // Store the intended URL in session storage or state
            sessionStorage.setItem('redirectAfterLogin', path);
            navigate('/login'); // Redirect to login page
        } else {
            navigate(path); // Directly navigate to the protected page
        }
    };

    const handleScroll = () => {
        const targetSection = document.getElementById('getting-started');
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleScrollCourses = () => {
        const targetSection = document.getElementById('courses');
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <header className='header'>
            <a href="/">
                <img src={picture} alt="Logo SyntaxBase" />
            </a>
            <div className='divni2'>
                <div className='divni3' onClick={handleScroll}>Getting started</div>
                <div className="dropdown">
                    <div className='divni3' id='tutorials'>
                        Tutorials
                        <span className="arrow down"></span>
                    </div>
                    <div className='dropdown-curtain'>
                        <a onClick={() => handleProtectedNavigation('/webDevelopment')}>Web Development</a>
                        <a onClick={() => handleProtectedNavigation('/gameDevelopment')}>Game Development</a>
                        <a onClick={() => handleProtectedNavigation('/databaseManagment')}>Database Management</a>
                        <a onClick={() => handleProtectedNavigation('/problemSolving')}>Problem Solving</a>
                    </div>
                </div>

                <div className='divni3' onClick={handleScrollCourses}>Courses</div>
                <a href='/help' className='divni3'>Help</a>
                <a href='/about' className='divni3'>About</a>
            </div>
        </header>
    );
}
