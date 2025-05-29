import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import '../styles/Header.css';
import picture from '../images/logoSyntaxBase.png';
import { SettingsMenu } from './SettingsMenu';
import { Header } from './Header';

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
    const { user, isAuthenticated } = useAuth0();
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams<{ id: string }>();
    const headerRef = useRef<HTMLElement>(null);
    const [headerVisible, setHeaderVisible] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [showPopup, setShowPopup] = useState<boolean>(true);
    const baseUrl = process.env.REACT_APP_API_BASE_URL;

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

    const handleMyCoursesNavigation = () => {
        if (user?.sub) {
            navigate(`/myCourses/${user.sub}`);
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
       <Header bgColor='#f9f9f9'></Header>
    );
}
