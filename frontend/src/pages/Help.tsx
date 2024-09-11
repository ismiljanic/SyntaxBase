import React, { useState } from 'react';
import '../styles/Help.css';
import { Header } from './Header';
import { Footer } from './Footer';
import { Footer2 } from './Footer2';

export function Help() {
    return (
        <div className="help-container">
            <Header bgColor='#fafafa'></Header>
            <div className='help-container2'>
                <h1>Need Help? We're Here for You!</h1>
                <p>Whether you're stuck on a coding challenge or need advice to improve your skills, our experienced developers are ready to assist you. Explore the resources below to find the guidance you need.</p>
                <div className="faq-section" style={{marginLeft: '0.1em', borderTop: '1px solid #dee2e6', paddingTop: '0.5em', paddingBottom: '0.5em', fontSize: '1.1em'}}>
                    <h2 style={{fontSize: '1.4em', paddingBottom: '1em'}}>Frequently Asked Questions</h2>
                    <div className="faq-item">
                        <h3>What courses do you provide?</h3>
                        <p>We provide various computer science courses. You can get more information or apply for course by selecting courses option from top menu where you can find out about all of courses we provide.</p>
                    </div>
                    <div className="faq-item">
                        <h3>Where can I find your tutorials?</h3>
                        <p>All our tutorials are available in the "Tutorials" section of the website, which you can access from the top menu.</p>
                    </div>
                    <div className="faq-item">
                        <h3>Can you apply for more courses at the same time?</h3>
                        <p>Yes! You can apply for more courses at the same time. Choose courses you want to listen and apply for them. They will be available to you as long as you want once you apply for them.</p>
                    </div>
                    <div className="faq-item">
                        <h3>Do i have to pay for tutorials or courses?</h3>
                        <p>You do not have to pay for any tutorials or courses. These tutorials and courses are made for everyone to learn for free without any limitations. If you want to support work of SyntaxBase you can contact us via email.</p>
                    </div>
                </div>

                <div id="community" className="community-section" style={{borderTop: '1px solid #dee2e6', paddingTop: '1em'}}>
                    <h2 style={{fontSize: '1.4em'}}>Join Our Developer Community</h2>
                    <p style={{fontSize: '1.1em'}}>Get support and collaborate with other learners and experienced developers in our active community. Share your problems, get feedback, and grow your skills together.</p>
                    <a href="/community" className="community-button">Join the Community</a>
                </div>

                {/* Live Support Section */}
                <div id="live-support" className="live-support-section">
                    <h2 style={{fontSize: '1.4em'}}>Live Support</h2>
                    <p style={{fontSize: '1.1em'}}>If you're facing an urgent issue or need real-time assistance, connect with one of our developers via live chat.</p>
                    <a href="/live-chat" className="live-support-button">Chat Now</a>
                    <p style={{fontSize: '1.1em'}}>Or, <a href="/schedule-call" style={{color: '#007bff'}}>schedule a call</a> for personalized help at a time that suits you.</p>
                </div>

                {/* Tutorials Section */}
                <div id="tutorials" className="tutorials-section">
                    <h2 style={{fontSize: '1.4em'}}>Explore Our Tutorials</h2>
                    <p style={{fontSize: '1.1em'}}>Our tutorials are designed to guide you through coding concepts, from beginner to advanced topics. Choose your level and start learning!</p>
                    <a href="/tutorials" className="tutorial-button">Browse Tutorials</a>
                </div>

                {/* Personalized Guidance Section */}
                <div id="personalized-advice" className="personalized-guidance-section" style={{paddingBottom: '1em'}}>
                    <h2 style={{fontSize: '1.4em'}}>Request Personalized Guidance</h2>
                    <p style={{fontSize: '1.1em'}}>If you need one-on-one advice or have a specific question, submit a request for personalized help. Our experts will review your query and provide detailed feedback.</p>
                    <a href="/request-help" className="personalized-help-button">Request Help</a>
                </div>

                <div className='formDiv' style={{paddingTop: '5em', marginLeft: '0.5em', borderTop: '1px solid #dee2e6'}}>
                    <div className='aboutYouDiv'>Contact us</div>
                    <div className='formDiv2'>
                        <div className="footer2-feedback">
                            <form className="footer2-feedback-form">
                                <div className="input-pair">
                                    <div className="input-field">
                                        <input type="text" id="first-name" name="name" required />
                                        <label htmlFor="first-name">First name</label>
                                    </div>
                                    <div className="input-field">
                                        <input type="text" id="surname" name="surname" required />
                                        <label htmlFor="surname">Surname</label>
                                    </div>
                                </div>

                                <div className="input-pair">
                                    <div className="input-field">
                                        <input type="text" id="phone" name="phone" required />
                                        <label htmlFor="phone">Phone</label>
                                    </div>
                                    <div className="input-field">
                                        <input type="email" id="email" name="email" required />
                                        <label htmlFor="email">Email</label>
                                    </div>
                                </div>

                                <div className="input-field full-width">
                                    <input type="text" id="username" name="username" required />
                                    <label htmlFor="username">Username</label>
                                </div>

                                <div className="input-field">
                                    <textarea id="message" name="message" required></textarea>
                                    <label htmlFor="message">How can we assist you?</label>
                                </div>

                                <button type="submit">Submit Feedback</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Footer2 bgColor='#fafafa'></Footer2>
            <Footer bgColor='#fafafa'></Footer>
        </div>
    );
}
