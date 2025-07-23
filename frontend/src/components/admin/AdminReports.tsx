import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import '../../styles/AdminReports.css';

interface Report {
    id: number;
    postId: number;
    postContent: string;
    postUserId: string;
    parentPostId: number;
    reporterId: string;
    reason: string;
    createdAt: string;
}

export function AdminReports() {
    const { getAccessTokenSilently } = useAuth0();
    const [reports, setReports] = useState<Report[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [modalMessage, setModalMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const token = await getAccessTokenSilently();
                const response = await axios.get<Report[]>('http://localhost:8080/api/reports', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setReports(response.data);
            } catch (err) {
                console.error('Error fetching reports:', err);
                setError('Failed to load reports');
            }
        };

        fetchReports();
    }, [getAccessTokenSilently]);

    const resolveReport = async (reportId: number) => {
        try {
            const token = await getAccessTokenSilently();
            await axios.post(`http://localhost:8080/api/reports/${reportId}/resolve`, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setReports(reports.filter((r) => r.id !== reportId));
        } catch (err) {
            console.error('Failed to resolve report:', err);
            alert('Could not resolve report');
        }
    };

    const deletePost = async (postId: number, reportId: number) => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;

        try {
            const token = await getAccessTokenSilently();
            await axios.delete(`http://localhost:8080/api/posts/${postId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            await axios.post(`http://localhost:8080/api/reports/${reportId}/resolve`, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setReports(reports.filter((r) => r.id !== reportId));
            setModalMessage("Post resolved successfully!");
        } catch (err) {
            console.error('Failed to delete post:', err);
            setModalMessage('Could not delete post');
        }
    };

    const viewPost = (postId: number, userId: string, parentPostId?: number) => {
        const scrollId = parentPostId ?? postId;
        window.open(`/community/${encodeURIComponent(userId)}?scrollToPost=${scrollId}`, '_blank');
    };


    if (error) return <p>{error}</p>;

    return (
        <div className="admin-reports-container">
            <h2>Reported Posts</h2>
            {reports.length === 0 ? (
                <p>No reports found.</p>
            ) : (
                <table className="reports-table">
                    <thead>
                        <tr>
                            <th>Post ID</th>
                            <th>Content</th>
                            <th>Reason</th>
                            <th>Reporter</th>
                            <th>Reported At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map((report) => (
                            <tr key={report.id}>
                                <td>{report.postId}</td>
                                <td>{report.postContent}</td>
                                <td>{report.reason}</td>
                                <td>{report.reporterId}</td>
                                <td>{new Date(report.createdAt).toLocaleString()}</td>
                                <td className="action-buttons">
                                    <button onClick={() => viewPost(report.postId, report.postUserId, report.parentPostId)} className="view-button">
                                        View
                                    </button>
                                    <button onClick={() => deletePost(report.postId, report.id)} className="delete-button" style={{ marginLeft: '0.5em' }}>
                                        Resolve & Delete Post
                                    </button>
                                    <button onClick={() => resolveReport(report.id)} className="resolve-button" style={{ marginLeft: '-3em' }}>
                                        Mark as Resolved
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {modalMessage && (
                <div className="modal-overlay">
                    <div className="modal">
                        <p>{modalMessage}</p>
                        <button onClick={() => setModalMessage(null)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}