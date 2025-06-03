import React, { useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

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
            alert('Instructor request submitted successfully.');
            navigate('/homepage');
        } catch (err) {
            console.error(err);
            alert('You already have a pending instructor request.');
        }
    };

    return (
        <div className="instructor-request-form">
            <h2>Request Instructor Role</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Institution:
                    <input value={institution} onChange={(e) => setInstitution(e.target.value)} required />
                </label>
                <label>
                    Phone:
                    <input value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </label>
                <label>
                    Address:
                    <input value={address} onChange={(e) => setAddress(e.target.value)} required />
                </label>
                <label>
                    Credentials:
                    <textarea value={credentials} onChange={(e) => setCredentials(e.target.value)} required />
                </label>
                <label>
                    Email:
                    <input value={email} onChange={(e) => setEmail(e.target.value)} required />
                </label>
                <button type="submit">Submit Request</button>
            </form>
        </div>
    );
}
