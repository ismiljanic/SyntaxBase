import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import '../styles/Header.css';
import picture from '../images/logoSyntaxBase.png';
import { SettingsMenu } from './SettingsMenu';

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
    const [showPopup, setShowPopup] = useState<boolean>(true);
    const baseUrl = process.env.REACT_APP_API_BASE_URL;

    const fetchNotifications = async () => {
        const storedUserId = sessionStorage.getItem('userId');
        try {
            const response = await fetch(`${baseUrl}/api/posts/notifications/${storedUserId}`);
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
        setShowPopup(false);
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
                <div className='divni3' id='tutorials'>
                    Tutorials
                </div>
                <div className='divni3' onClick={handleScrollCourses}>Courses</div>
                <a href='/help' className='divni3'>Help</a>

                <a href={`/community/${userId}`} className='divni3' style={{ marginRight: '-1.5em' }}>Community</a>
            </div>
            <SettingsMenu />
        </header>
    );
}
