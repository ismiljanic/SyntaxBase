import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import '../styles/Header.css';
import picture from '../images/logoSyntaxBase.png';
import { SettingsMenu } from './SettingsMenu';
import NotificationPopup from '../components/NotificationPopup';
import "../styles/NotificationPopup.css";

interface HeaderProps {
    bgColor?: string;
}

interface Notification {
    id: number;
    userId: number;
    postId: number;
    replyId: number;
    message: string;
    read: boolean;
    createdAt: string;
    username: string;
}

export function HomepageHeader({ bgColor = '#333' }: HeaderProps) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [userId, setUserId] = useState<number | null>(null);
    const { id } = useParams<{ id: string }>();
    const headerRef = useRef<HTMLElement>(null);
    const [headerVisible, setHeaderVisible] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [showPopup, setShowPopup] = useState<boolean>(true); // Popup should be shown initially

    const fetchNotifications = async () => {
        const storedUserId = sessionStorage.getItem('userId');
        try {
            const response = await fetch(`http://localhost:8080/api/posts/notifications/${storedUserId}`);
            if (!response.ok) throw new Error('Failed to fetch notifications');
            const data: Notification[] = await response.json();
            setNotifications(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

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
                observer.unobserve(headerRef.current);
            }
        };
    }, []);

    useEffect(() => {
        const storedUserId = sessionStorage.getItem('userId');
        if (storedUserId) {
            setUserId(parseInt(storedUserId, 10));
        }
    }, []);

    const handleMyCoursesNavigation = () => {
        if (id) {
            navigate(`/myCourses/${id}`);
        } else {
            console.error("User ID is missing");
        }
    };

    const handleNotificationClick = (notification: Notification) => {
        console.log("Notification clicked:", notification);
    };

    const handleDismiss = (notificationId: number) => {
        setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
    };

    const handleClosePopup = () => {
        setShowPopup(false); // This will close the popup
    };

    return (
        <header
            ref={headerRef}
            className={`header ${headerVisible ? 'header-visible' : 'header-hidden'}`}
            style={{ backgroundColor: bgColor, paddingBottom: '7em' }}
        >
            <a href="/">
                <img src={picture} alt="Logo SyntaxBase" />
            </a>
            <div className='divni2' style={{ paddingLeft: '27em', paddingRight: '35em' }}>
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

                <a href={`/community/${userId}`} className='divni3' style={{ marginRight: '-1.5em' }}>Community</a>
            </div>
            <SettingsMenu />
        </header>
    );
}
