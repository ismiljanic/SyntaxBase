import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

interface InstructorRequest {
    id: number;
    institution: string;
    phone: string;
    address: string;
    credentials: string;
    status: string;
    user: { username: string };
    requestDate: string;
    email: string;
}

export function AdminInstructorRequests() {
    const [requests, setRequests] = useState<InstructorRequest[]>([]);
    const { getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        const fetchRequests = async () => {
            const token = await getAccessTokenSilently();
            const response = await axios.get<InstructorRequest[]>('http://localhost:8080/api/admin/instructor-requests/pending', {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            });
            setRequests(response.data);
        };
        fetchRequests();
    }, []);

    const updateStatus = async (id: number, status: 'APPROVED' | 'REJECTED') => {
        try {
            const token = await getAccessTokenSilently();
            await axios.put(`http://localhost:8080/api/admin/instructor-requests/${id}/${status.toLowerCase()}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            });
            setRequests((prev) => prev.filter((r) => r.id !== id));
            alert(`Request ${status.toLowerCase()} successfully.`);
        } catch (err) {
            console.error(err);
            alert('Failed to update request status.');
        }
    };

    return (
        <div>
            <h2>Pending Instructor Requests</h2>
            {requests.length === 0 && <p>No pending requests.</p>}
            {requests.map((req) => (
                <div key={req.id} style={{ border: '1px solid black', padding: '10px', margin: '10px' }}>
                    <p><strong>User:</strong> {req.user.username}</p>
                    <p><strong>Institution:</strong> {req.institution}</p>
                    <p><strong>Phone:</strong> {req.phone}</p>
                    <p><strong>Address:</strong> {req.address}</p>
                    <p><strong>Credentials:</strong> {req.credentials}</p>
                    <p><strong>Email:</strong> {req.email}</p>
                    <button onClick={() => updateStatus(req.id, 'APPROVED')}>Approve</button>
                    <button onClick={() => updateStatus(req.id, 'REJECTED')}>Reject</button>
                </div>
            ))}
        </div>
    );
}
