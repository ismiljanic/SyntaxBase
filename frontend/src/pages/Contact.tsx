import React, { useEffect } from 'react';
import '../styles/Contact.css';
import { Header } from './Header';
import { Footer } from './Footer';
import { Footer2 } from './Footer2';

export function Contact() {
    useEffect(() => {
        document.title = "Contact Us | SyntaxBase";
    }, []);

    return (
        <div className='contactDiv'>
            <Header bgColor='#fcfafa'/>
            <h1 className='contact'>Contact Us</h1>
            <div className="contact-container">
                <div className='formDiv'>
                    <div className='aboutYouDiv'>About you</div>
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
                                    <label htmlFor="message">Message</label>
                                </div>

                                <button type="submit">Submit Feedback</button>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="contact-info">
                    <div className='contact-info-text'>
                        <div className='email'>
                            <h1>Personal email</h1>
                            <p>ssmiljanicivan@gmail.com</p>
                        </div>
                        <div className='email'>
                            <h1>Student email</h1>
                            <p>ivan.smiljanic@fer.hr</p>
                        </div>
                        <div className='email'>
                            <h1>Emergency email</h1>
                            <p>ivanveliki65@gmail.com</p>
                        </div>
                        <div className='email'>
                            <h1>Other</h1>
                            <p>ivansmiljanic9@outlook.com</p>
                        </div>
                        <div className='email'>
                            <h1>Other email</h1>
                            <p>fudansfudans@gmail.com</p>
                        </div>
                    </div>
                </div>
                <div className="contact-info2">
                    <div className='contact-info-text'>
                        <div className='email'>
                            <h1>Address</h1>
                            <p>Ulica Biskupa Augustina Kažotića 4, 10370, Dugo Selo, Hrvatska</p>
                        </div>
                        <div className='email'>
                            <h1>Support Hours</h1>
                            <p>Mon-Fri, 9:00 AM - 5:00 PM</p>
                        </div>
                        <div className='email'>
                            <h1>Phone</h1>
                            <p>(+385) 098-820-245</p>
                        </div>
                    </div>
                </div>
                {/* Optional FAQ Section */}
                <div className="faq-section">
                    <h2>Frequently Asked Questions</h2>
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
            </div>
            <Footer2 bgColor='rgb(227, 238, 246)'></Footer2>
            <Footer bgColor='rgb(227, 238, 246)'></Footer>
        </div>
    );
}