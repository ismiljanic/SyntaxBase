import React, { useState, useEffect } from 'react';
import '../styles/Footer2.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

interface FooterProps {
    bgColor?: string;
}

export function Footer2({ bgColor = '#333' }: FooterProps) {
    const [email, setEmail] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [status, setStatus] = useState<string>('');
    const navigate = useNavigate();
    const { getAccessTokenSilently, isAuthenticated } = useAuth0();

    const handleScroll = () => {
        const targetSection = document.getElementById('getting-started');
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        } else {
            navigate('/?scrollTo=getting-started');
        }
    };

    const handleScrollCourses = () => {
        const target = document.getElementById('courses');
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        } else {
            navigate('/?scrollTo=courses');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const token = await getAccessTokenSilently();

            await axios.post(
                'http://localhost:8080/api/feedback/email',
                { email, message },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setStatus('Feedback submitted successfully!');
            setEmail('');
            setMessage('');
        } catch (error) {
            console.error('Error submitting feedback:', error);
            setStatus('Failed to submit feedback. Please try again.');
        }
    };

    return (
        <div className="footer2" style={{ backgroundColor: bgColor }}>
            <div className='footer2Box'></div>
            <div className="footer2-content">
                <div className="footer2-feedback">
                    <h2>We would appreciate any kind of feedback</h2>
                    <form className="footer2-feedback-form" onSubmit={handleSubmit}>
                        <div className="input-field">
                            <input
                                type="email"
                                id="feedback-email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <label htmlFor="feedback-email">Your Email</label>
                        </div>

                        <div className="input-field">
                            <textarea
                                id="feedback-message"
                                name="message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                            ></textarea>
                            <label htmlFor="feedback-message">Feedback</label>
                        </div>

                        <button type="submit">Submit Feedback</button>
                    </form>
                    {status && <p>{status}</p>}
                </div>
                <div className='footerNav'>
                    <div className="footer2-nav">
                        <div className="footer2-brand">SyntaxBase</div>
                        <div className="div2" onClick={handleScroll}>Getting Started</div>
                        <div className="div2"><a href='/tutorials' style={{ color: 'black' }}> Tutorials</a></div>
                        <div className="div2" onClick={handleScrollCourses}>Courses</div>
                        <div className="div2"><a href='/help' style={{ color: 'black' }}> Help </a></div>
                        <div className="div2"><a href='/about' style={{ color: 'black' }}> About </a></div>
                        <div className="div2"><a href='/contact' style={{ color: 'black' }}> Contact </a></div>
                    </div>
                    <div className="footer2-nav">
                        <div className="footer2-brand">Social</div>
                        <div className="div2"><a href='https://github.com/ismiljanic' style={{color: 'black'}}>GitHub</a></div>
                        <div className="div2">Instagram</div>
                        <div className="div2">WhatsApp</div>
                        <div className="div2"><a href='https://t.me/+3vncHfqfDR5mZjI0' style={{color: 'black'}}>Telegram</a></div>
                    </div>
                </div>
            </div>
            <div className='footer2Box2'></div>
        </div>
    );
}
