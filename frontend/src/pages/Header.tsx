import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Header.css';
import picture from '../images/logoSyntaxBase.png';

interface HeaderProps {
    bgColor?: string;
}

export function Header({ bgColor = '#333' }: HeaderProps) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const headerRef = useRef<HTMLElement>(null); // Ref for the header
    const [headerVisible, setHeaderVisible] = useState(false); // State to track visibility

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

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setHeaderVisible(true); // Set state to true when header is visible
                    } else {
                        setHeaderVisible(false); // Set state to false when header is not visible
                    }
                });
            },
            { threshold: 0.1 } // Adjust threshold for triggering visibility
        );

        if (headerRef.current) {
            observer.observe(headerRef.current);
        }

        return () => {
            if (headerRef.current) {
                observer.unobserve(headerRef.current); // Clean up observer
            }
        };
    }, []);

    return (
        <header
            ref={headerRef}
            className={`header ${headerVisible ? 'header-visible' : 'header-hidden'}`}
            style={{ backgroundColor: bgColor }}
        >
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
