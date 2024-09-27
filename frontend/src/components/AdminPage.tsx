import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/AdminPage.css';
import { Footer2 } from '../pages/Footer2';
import { Footer } from '../pages/Footer';
import { Header } from '../pages/Header';

interface User {
    id: number;
    username: string;
    role: string;
}

const AdminPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get<User[]>('http://localhost:8080/api/users/allUsers', {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('userToken')}`,
                    },
                });
                setUsers(response.data);
            } catch (error) {
                setError('Failed to fetch users');
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="admin-page">
            <Header bgColor='rgb(247, 250, 251)' />
            <div className='containerAdminPage'>
                <h2>User Management</h2>
                {error && <div className="error-message">{error}</div>}
                <div className='centerTable'>
                    <table className="user-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.username}</td>
                                    <td>{user.role}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="action-buttons">
                    <button className="button" onClick={() => {/* Handle adding user */ }}>Add User</button>
                    <button className="button" onClick={() => {/* Handle user roles management */ }}>Manage Roles</button>
                </div>
            </div>
            <Footer2 bgColor='rgb(247, 250, 251)' />
            <Footer bgColor='rgb(247, 250, 251)' />
        </div >
    );
};

export default AdminPage;
