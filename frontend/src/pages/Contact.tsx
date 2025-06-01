import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/Contact.css';
import { Header } from './Header';
import { Footer } from './Footer';
import { Footer2 } from './Footer2';
import { useAuth0 } from '@auth0/auth0-react';

interface FormData {
    name: string;
    surname: string;
    phone: string;
    email: string;
    username: string;
    message: string;
}

export function Contact() {
    const navigate = useNavigate();
    const { userId } = useParams<{ userId?: string }>();
    const [formData, setFormData] = useState<FormData>({
        name: '',
        surname: '',
        phone: '',
        email: '',
        username: '',
        message: ''
    });
    const [status, setStatus] = useState<string>('');
    const { getAccessTokenSilently, isAuthenticated } = useAuth0();

    useEffect(() => {
        document.title = "Contact Us | SyntaxBase";

        const fetchData = async () => {
            try {
                const token = await getAccessTokenSilently();

                const response = await axios.get(`http://localhost:8080/api/users/userInformation`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    withCredentials: true
                });

                const { name = '', surname = '', username = '', email = '', phone = '' } = response.data;
                setFormData(prevData => ({
                    ...prevData,
                    name,
                    surname,
                    username,
                    email,
                    phone
                }));
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };

        fetchData();
    }, []);



    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const token = await getAccessTokenSilently();
            await axios.post(`http://localhost:8080/api/contact/email`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true
            });
            setStatus('Feedback submitted successfully!');
            setFormData({
                name: '',
                surname: '',
                phone: '',
                email: '',
                username: '',
                message: ''
            });
        } catch (error) {
            console.error('Error submitting feedback:', error);
            setStatus('Failed to submit feedback. Please try again.');
        }
    };

    return (
        <div className='contactDiv'>
            <Header bgColor='#fcfafa' />
            <h1 className='contact'>Contact Us</h1>
            <div className="contact-container">
                <div className='formDiv'>
                    <div className='aboutYouDiv'>About you</div>
                    <div className='formDiv2'>
                        <div className="footer2-feedback">
                            <form className="footer2-feedback-form" onSubmit={handleSubmit}>
                                <div className="input-pair">
                                    <div className="input-field">
                                        <input
                                            type="text"
                                            id="first-name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                        <label htmlFor="first-name">First name</label>
                                    </div>
                                    <div className="input-field">
                                        <input
                                            type="text"
                                            id="surname"
                                            name="surname"
                                            value={formData.surname}
                                            onChange={handleChange}
                                            required
                                        />
                                        <label htmlFor="surname">Surname</label>
                                    </div>
                                </div>
                                <div className="input-pair">
                                    <div className="input-field full-width">
                                        <input
                                            type="text"
                                            id="username"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            required
                                        />
                                        <label htmlFor="username">Username</label>
                                    </div>
                                    <div className="input-field">
                                        <input
                                            type="text"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                        />
                                        <label htmlFor="phone">Phone</label>
                                    </div>
                                </div>

                                <div className="input-field">
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        style={{ width: '45em' }}
                                    />
                                    <label htmlFor="email">Email</label>
                                </div>
                                <div className="input-field">
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                    ></textarea>
                                    <label htmlFor="message">Feedback</label>
                                </div>

                                <button type="submit">Submit Feedback</button>
                                {status && <p>{status}</p>}
                            </form>
                        </div>
                    </div>
                </div>
                <div className="contact-info">
                    <div className='contact-info-text'>
                        <div className='email'>
                            <h1>Official email</h1>
                            <a href="mailto:SyntaxBaseDev@gmail.com" className='contactEmailDiv'>SyntaxBaseDev@gmail.com</a>
                        </div>
                        <div className='email'>
                            <h1>Personal email</h1>
                            <a href="mailto:ssmiljanicivan@gmail.com" className='contactEmailDiv'>ssmiljanicivan@gmail.com</a>
                        </div>
                        <div className='email'>
                            <h1>Emergency email</h1>
                            <a href="mailto:ivansmiljanic9@outlook.com" className='contactEmailDiv'>ivansmiljanic9@outlook.com</a>
                        </div>
                        <div className='email'>
                            <h1>Other</h1>
                            <a href="mailto:fudansfudans@gmail.com" className='contactEmailDiv' style={{ marginLeft: '0.5em' }}>fudansfudans@gmail.com</a>
                        </div>
                        <div className='email'>
                            <h1>Other email</h1>
                            <a href="mailto:ivan.smiljanic@fer.hr" className='contactEmailDiv' style={{ marginLeft: '0.5em' }}>ivan.smiljanic@fer.hr</a>
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
