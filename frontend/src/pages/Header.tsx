import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import '../styles/Header.css';
import picture from '../images/logoSyntaxBase.png';

interface HeaderProps {
    bgColor?: string;
}

export function Header({ bgColor = '#333' }: HeaderProps) {
    const [isLoggedIn, setIsLoggedIn] = useState(false); 
    const navigate = useNavigate(); 
    const location = useLocation(); 

    const handleProtectedNavigation = (path: string) => {
        if (!isLoggedIn) {
            sessionStorage.setItem('redirectAfterLogin', path);
            navigate('/login'); 
        } else {
            navigate(path);
        }
    };

    const handleScroll = () => {
        if (location.pathname === '/') {
            const targetSection = document.getElementById('getting-started');
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            navigate('/?scrollTo=getting-started');
        }
    };

    const handleScrollCourses = () => {
        if (location.pathname === '/') {
            const targetSection = document.getElementById('courses');
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            navigate('/?scrollTo=courses');
        }
    };

    return (
        <header className='header' style={{ backgroundColor: bgColor }}>
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
            <a href="/contact">
                <button className='divni1'>Contact</button>
            </a>
        </header>
    );
}
