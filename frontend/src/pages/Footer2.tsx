import React from 'react';
import '../styles/Footer2.css'; // Import styles specific to Footer2
import { useLocation, useNavigate } from 'react-router-dom';

interface FooterProps {
    bgColor?: string;
}

export function Footer2({ bgColor = '#333' }: FooterProps) {

    const location = useLocation();
    const navigate = useNavigate();

    const handleScroll = () => {
        const targetSection = document.getElementById('getting-started');
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        } else {
            navigate('/?scrollTo=getting-started');
        }
    }

    const handleScrollCourses = () => {
        const target = document.getElementById('courses');
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        } else {
            navigate('/?scrollTo=courses');
        }
    }

    const handleScrollTutorials = () => {
        const target = document.getElementById('tutorials');
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        } else {
            navigate('/?scrollTo=tutorials');
        }
    }
    return (
        <div className="footer2" style={{ backgroundColor: bgColor }}>
            <div className='footer2Box'></div>
            <div className="footer2-content">
                <div className="footer2-feedback">
                    <h2>We would appreciate any kind of feedback</h2>
                    <form className="footer2-feedback-form">
                        <div className="input-field">
                            <input
                                type="email"
                                id="feedback-email"
                                name="email"
                                required
                            />
                            <label htmlFor="feedback-email">Email</label>
                        </div>

                        <div className="input-field">
                            <textarea
                                id="feedback-message"
                                name="message"
                                required
                            ></textarea>
                            <label htmlFor="feedback-message">Message</label>
                        </div>

                        <button type="submit">Submit Feedback</button>
                    </form>
                </div>
                <div className='footerNav'>
                    <div className="footer2-nav">
                        <div className="footer2-brand">SyntaxBase</div>
                        <div className="div2" onClick={handleScroll}>Getting Started</div>
                        <div className="div2" onClick={handleScrollTutorials}>Tutorials</div>
                        <div className="div2" onClick={handleScrollCourses}>Courses</div>
                        <div className="div2"><a href='/help' style={{ color: 'black' }}> Help </a></div>
                        <div className="div2"><a href='/about' style={{ color: 'black' }}> About </a></div>
                        <div className="div2"><a href='/contact' style={{ color: 'black' }}> Contact </a></div>
                    </div>
                    <div className="footer2-nav">
                        <div className="footer2-brand">Social</div>
                        <div className="div2">Github</div>
                        <div className="div2">Instagram</div>
                        <div className="div2">WhatsApp</div>
                        <div className="div2">Telegram</div>
                    </div>
                </div>
            </div>
            <div className='footer2Box2'></div>
        </div>
    );
}
