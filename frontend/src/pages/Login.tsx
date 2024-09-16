import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LoginComponent } from "../components/Login";
import '../styles/Login.css';


export function Login() {
    const navigate = useNavigate();

    useEffect(() => {
        const isLoggedIn = sessionStorage.getItem('userToken');
        const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
        const userId = sessionStorage.getItem('userId');

        if (isLoggedIn) {
            if (redirectUrl) {
                sessionStorage.removeItem('redirectAfterLogin'); 
                navigate(redirectUrl);
            } else if (userId) {
                navigate(`/homepage/${userId}`); 
            } else {
                navigate('/homepage');
            }
        }
    }, [navigate]);

    return (
        <div className="login-page">
            <div className="login-header">
                <h1>Welcome Back!</h1>
                <p>Please log in to access your account.</p>
            </div>
            <LoginComponent />
            <div className="login-footer">
                <Link to="/forgot-password" className="footer-link">Forgot Password?</Link>
                <div className="footer-text">Don't have an account? <Link to="/register" className="footer-link">Sign Up</Link></div>
                <div className="footer-text" style={{marginTop: '-1em', marginLeft: '3em'}}>Go to <Link to="/" className="footer-link">Homepage</Link></div>
            </div>
        </div>
    );
}
