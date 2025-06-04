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
    const [error, setError] = useState<string | null>(null);
    const { getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const token = await getAccessTokenSilently();
                const response = await axios.get('http://localhost:8080/api/admin/instructor-requests/pending', {
                    withCredentials: true,
                    headers: { Authorization: `Bearer ${token}` },
                });
                setRequests(response.data);
                setError(null);
            } catch (err: any) {
                if (axios.isAxiosError(err) && err.response?.status === 403) {
                    setError('Unauthorized: You do not have permission to view this page.');
                } else {
                    setError('An error occurred while fetching requests.');
                }
            }
        };
        fetchRequests();
    }, [getAccessTokenSilently]);

    if (error) {
        return (
            <div className="error-container">
                <h2 className="error-title">Access Denied</h2>
                <p className="error-message">{error}</p>
                <div className="button-group">
                    <button
                        className="primary-button"
                        onClick={() => (window.location.href = '/')}
                    >
                        Go to Homepage
                    </button>
                </div>
            </div>
        );
    }

    const updateStatus = async (id: number, status: 'APPROVED' | 'REJECTED') => {
        try {
            const token = await getAccessTokenSilently();
            await axios.put(`http://localhost:8080/api/admin/instructor-requests/${id}/${status.toLowerCase()}`, {}, {
                withCredentials: true,
                headers: { Authorization: `Bearer ${token}` },
            });
            setRequests((prev) => prev.filter((r) => r.id !== id));
            alert(`Request ${status.toLowerCase()} successfully.`);
        } catch (err) {
            console.error(err);
            alert('Failed to update request status.');
        }
    };

    return (
        <div className="admin-container">
            <h2 className="admin-title">Pending Instructor Requests</h2>

            {requests.length === 0 ? (
                <p className="no-requests">No pending requests.</p>
            ) : (
                requests.map((req) => (
                    <div key={req.id} className="request-card">
                        <p className="request-info"><strong>User:</strong> {req.user.username}</p>
                        <p className="request-info"><strong>Institution:</strong> {req.institution}</p>
                        <p className="request-info"><strong>Phone:</strong> {req.phone}</p>
                        <p className="request-info"><strong>Address:</strong> {req.address}</p>
                        <p className="request-info"><strong>Credentials:</strong> {req.credentials}</p>
                        <p className="request-info"><strong>Email:</strong> {req.email}</p>

                        <div className="button-group">
                            <button className="btn btn-approve" onClick={() => updateStatus(req.id, 'APPROVED')}>
                                Approve
                            </button>
                            <button className="btn btn-reject" onClick={() => updateStatus(req.id, 'REJECTED')}>
                                Reject
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
