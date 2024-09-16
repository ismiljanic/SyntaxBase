import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Header.css';
import picture from '../images/logoSyntaxBase.png';
import { SettingsMenu } from './SettingsMenu';

interface HeaderProps {
    bgColor?: string;
}

export function Header({ bgColor = '#333' }: HeaderProps) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const headerRef = useRef<HTMLElement>(null);
    const [headerVisible, setHeaderVisible] = useState(false);
    const [dropdownActive, setDropdownActive] = useState(false);

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

    const handleContactClick = () => {
        if (isLoggedIn && userId) {
            navigate(`/contact/${userId}`);
        } else {
            navigate('/contact');
        }
    };

    useEffect(() => {
        const storedUserId = sessionStorage.getItem('userId');
        if (storedUserId) {
            setUserId(storedUserId);
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setHeaderVisible(true);
                    } else {
                        setHeaderVisible(false);
                    }
                });
            },
            { threshold: 0.1 }
        );

        if (headerRef.current) {
            observer.observe(headerRef.current);
        }

        return () => {
            if (headerRef.current) {
                observer.unobserve(headerRef.current);
            }
        };
    }, []);

    return (
        <header
            ref={headerRef}
            className={`header ${headerVisible ? 'header-visible' : 'header-hidden'} ${dropdownActive ? 'header-expanded' : ''} ${isLoggedIn ? 'logged-in' : 'logged-out'}`}
            style={{ backgroundColor: bgColor }}
        >
            <a href="/">
                <img src={picture} alt="Logo SyntaxBase" />
            </a>
            <div className='divni2'>
                <div className='divni3' onClick={handleScroll}>Getting started</div>
                <div className="dropdown" onClick={() => setDropdownActive(!dropdownActive)}>
                    <div className='divni3' id='tutorials'>
                        Tutorials
                    </div>
                    <div className='dropdown-overlay'>
                        <div className='dropdown-curtain'>
                            <a onClick={() => handleProtectedNavigation('/webDevelopment')} className='dropdownA'>Web Development</a>
                            <a onClick={() => handleProtectedNavigation('/gameDevelopment')} className='dropdownA'>Game Development</a>
                            <a onClick={() => handleProtectedNavigation('/databaseManagment')} className='dropdownA'>Database Management</a>
                            <a onClick={() => handleProtectedNavigation('/problemSolving')} className='dropdownA'>Problem Solving</a>
                        </div>
                    </div>
                </div>
                <div className='divni3' onClick={handleScrollCourses}>Courses</div>
                <a href='/about' className='divni3'>About</a>
                <a href='/help' className='divni3'>Help</a>
                {isLoggedIn && userId && (
                    <a href={`/homepage/${userId}`} className='divni3' style={{ marginRight: '5em' }}>Homepage</a>
                )}
            </div>
            {isLoggedIn && userId ? (
                <SettingsMenu />
            ) : (
                <a href="/contact">
                    <button className='divni1'>Contact</button>
                </a>
            )}
            {dropdownActive && <div className="header-overlay" onClick={() => setDropdownActive(false)}></div>}
        </header>
    );
}
