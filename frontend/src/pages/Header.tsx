import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Header.css';
import picture from '../images/logoSyntaxBase.png';
import { SettingsMenu } from './SettingsMenu';
import { useAuth0 } from "@auth0/auth0-react";

interface HeaderProps {
  bgColor?: string;
}

export function Header({ bgColor = '#333' }: HeaderProps) {
  const { isAuthenticated, user, logout, getAccessTokenSilently } = useAuth0();
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const headerRef = useRef<HTMLElement>(null);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    const fetchTokenAndSetUser = async () => {
      if (isAuthenticated && user?.sub) {
        const token = await getAccessTokenSilently();
        setUserId(user.sub);
        sessionStorage.setItem('userId', user.sub);
        sessionStorage.setItem('userToken', token);
      } else {
        setUserId(null);
        sessionStorage.removeItem('userId');
      }
    };
    fetchTokenAndSetUser();
  }, [isAuthenticated, user]);

  const handleProtectedNavigation = (path: string) => {
    if (!isAuthenticated) {
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
    if (isAuthenticated && userId) {
      navigate(`/contact/${userId}`);
    } else {
      navigate('/contact');
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setHeaderVisible(entry.isIntersecting);
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
      className={`header ${headerVisible ? 'header-visible' : 'header-hidden'} ${isAuthenticated ? 'logged-in' : 'logged-out'
        }`}
      style={{ backgroundColor: bgColor }}
    >
      <a href="/">
        <img src={picture} alt="Logo SyntaxBase" />
      </a>
      <div className={`divni2 ${isAuthenticated && userId ? 'logged-in' : 'logged-out'}`}>
        <div className="divni3" onClick={handleScroll} style={{ cursor: 'pointer' }}>
          Getting started
        </div>
        <div className="divni3" id="tutorials" onClick={() => navigate('/tutorials')} style={{ cursor: 'pointer' }}>
          Tutorials
        </div>
        <div className="divni3" onClick={handleScrollCourses} style={{ cursor: 'pointer' }}>
          Courses
        </div>
        <a href="/about" className="divni3">
          About
        </a>
        <a href="/help" className="divni3">
          Help
        </a>

        {isAuthenticated && userId ? (
          <>
            <a href={`/homepage/${userId}`} className="divni3">
              Homepage
            </a>
            <a href={`/community/${userId}`} className="divni3" style={{ marginRight: '-5em' }}>
              Community
            </a>
          </>
        ) : (
          <a href="/login" className="divni3">
            Login
          </a>
        )}
      </div>

      {isAuthenticated && userId ? (
        <SettingsMenu />
      ) : (
        <a href="/contact">
          <button className="divni1">Contact</button>
        </a>
      )}
    </header>
  );
}
