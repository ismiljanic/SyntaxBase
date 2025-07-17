import React, { useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../Header';
import { Footer2 } from '../Footer2';
import { Footer } from '../Footer';

export function InstructorRequestForm() {
    const [institution, setInstitution] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [credentials, setCredentials] = useState('');
    const [email, setEmail] = useState('');
    const { getAccessTokenSilently } = useAuth0();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = await getAccessTokenSilently();
            await axios.post('http://localhost:8080/api/users/request-instructor', {
                institution,
                phone,
                address,
                credentials,
                email,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true
            });
            alert('Instructor request submitted successfully. You will be notified once your request is processed on the provided email.');
            navigate('/homepage');
        } catch (err) {
            console.error(err);
            alert('You already have a pending instructor request.');
        }
    };

    return (
        <div className="contactDiv">
            <Header bgColor='#f9f9f9'></Header>
            <h1 className="contact">Instructor Request</h1>
            <div className="contact-container">
                <div className="formDiv">
                    <div className="aboutYouDiv">Instructor Details</div>
                    <div className="formDiv2">
                        <form className="footer2-feedback-form" onSubmit={handleSubmit}>
                            <div className="input-field">
                                <input
                                    type="text"
                                    value={institution}
                                    onChange={(e) => setInstitution(e.target.value)}
                                    required
                                />
                                <label>Institution</label>
                            </div>
                            <div className="input-field">
                                <input
                                    type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                                <label>Phone</label>
                            </div>
                            <div className="input-field">
                                <input
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    required
                                />
                                <label>Address</label>
                            </div>
                            <div className="input-field">
                                <textarea
                                    id="credentials"
                                    value={credentials}
                                    onChange={(e) => setCredentials(e.target.value)}
                                    required
                                    placeholder="E.g., BSc in Computer Science, 5 years as a software engineer, AWS Certified Solutions Architect"
                                />
                            </div>
                            <div className="input-field">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <label>Email</label>
                            </div>
                            <button type="submit">Submit Request</button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer2 bgColor='#f9f9f9'></Footer2>
            <Footer bgColor='#f9f9f9'></Footer>
        </div>
    );
}