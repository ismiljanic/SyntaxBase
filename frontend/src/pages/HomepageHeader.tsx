import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import '../styles/Header.css';
import picture from '../images/logoSyntaxBase.png';

interface HeaderProps {
    bgColor?: string;
}

export function HomepageHeader({ bgColor = '#333' }: HeaderProps) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams<{ id: string }>();  // Get the user ID from the URL parameters
    const headerRef = useRef<HTMLElement>(null); // Ref for the header
    const [headerVisible, setHeaderVisible] = useState(false); // State to track visibility

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
                observer.unobserve(headerRef.current); // Clean up observer
            }
        };
    }, []);

    const handleMyCoursesNavigation = () => {
        if (id) {
            navigate(`/myCourses/${id}`);  // Use the user ID to navigate to the appropriate route
        } else {
            console.error("User ID is missing");
        }
    };

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
                {/* Use onClick to dynamically navigate to /myCourses/{id} */}
                <div className='divni3' onClick={handleMyCoursesNavigation}>My Courses</div>
                <div className="dropdown">
                    <div className='divni3' id='tutorials'>
                        Tutorials
                        <span className="arrow down"></span>
                    </div>
                    <div className='dropdown-curtain'>
                        <a href='/webDevelopment'>Web Development</a>
                        <a href='/gameDevelopment'>Game Development</a>
                        <a href='/databaseManagment'>Database Management</a>
                        <a href='/problemSolving'>Problem Solving</a>
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
