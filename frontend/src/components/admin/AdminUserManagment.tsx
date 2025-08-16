import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import '../../styles/AdminUserManagment.css';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '../LoadingScreen';

type User = {
    auth0UserId: string;
    username: string;
    role: 'ADMIN' | 'USER' | 'INSTRUCTOR';
    active: boolean;
};

export function AdminUserManagement() {
    const { getAccessTokenSilently } = useAuth0();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'SUSPENDED'>('ALL');
    const [roleFilter, setRoleFilter] = useState<'ALL' | 'ADMIN' | 'USER' | 'INSTRUCTOR'>('ALL');
    const navigate = useNavigate();

    const fetchUsers = async () => {
        try {
            const token = await getAccessTokenSilently();
            const res = await fetch('http://localhost:8080/api/admin/users', {
                headers: { Authorization: `Bearer ${token}` },
                credentials: 'include',
            });
            if (!res.ok) throw new Error('Failed to fetch users');
            const data = await res.json();
            setUsers(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const updateUserStatus = async (userId: string, activate: boolean) => {
        const confirmation = window.confirm(
            `Are you sure you want to ${activate ? 'activate' : 'suspend'} this user?`
        );
        if (!confirmation) return;

        try {
            const token = await getAccessTokenSilently();
            const url = `http://localhost:8080/api/admin/users/${userId}/${activate ? 'activate' : 'suspend'}`;
            const res = await fetch(url, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error('Failed to update status');
            setUsers((prev) =>
                prev.map((u) =>
                    u.auth0UserId === userId ? { ...u, active: activate } : u
                )
            );
        } catch (err: any) {
            alert(err.message);
        }
    };

    const updateUserRole = async (userId: string, role: string) => {
        const confirmation = window.confirm(
            `Are you sure you want to change the role to "${role}"?`
        );
        if (!confirmation) return;

        try {
            const token = await getAccessTokenSilently();
            const res = await fetch(`http://localhost:8080/api/admin/users/${userId}/roles`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                credentials: 'include',
                body: JSON.stringify(role),
            });
            if (!res.ok) throw new Error('Failed to update role');
            setUsers((prev) =>
                prev.map((u) =>
                    u.auth0UserId === userId ? { ...u, role: role as User['role'] } : u
                )
            );
        } catch (err: any) {
            alert(err.message);
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesUsername = user.username.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus =
            statusFilter === 'ALL' ||
            (statusFilter === 'ACTIVE' && user.active) ||
            (statusFilter === 'SUSPENDED' && !user.active);
        const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
        return matchesUsername && matchesStatus && matchesRole;
    });

    const deleteUser = async (userId: string) => {
        const confirmation = window.confirm('Are you sure you want to delete this user? This action is irreversible.');
        if (!confirmation) return;

        try {
            const token = await getAccessTokenSilently();
            const res = await fetch(`http://localhost:8080/api/admin/users/deleteAccount/${encodeURIComponent(userId)}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                credentials: 'include',
            });

            if (!res.ok) {
                const errorMsg = await res.text();
                throw new Error(errorMsg);
            }

            setUsers(prev => prev.filter(user => user.auth0UserId !== userId));
            alert('User deleted successfully.');
        } catch (err: any) {
            alert(`Error deleting user: ${err.message}`);
        }
    };


    if (loading) {
        return <LoadingScreen />;
    }
    
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="admin-user-management-container">
            <div className="filters">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search by username..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)}>
                    <option value="ALL">All Statuses</option>
                    <option value="ACTIVE">Active</option>
                    <option value="SUSPENDED">Suspended</option>
                </select>
                <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value as any)}>
                    <option value="ALL">All Roles</option>
                    <option value="ADMIN">Admin</option>
                    <option value="USER">User</option>
                    <option value="INSTRUCTOR">Instructor</option>
                </select>
            </div>

            <table className="admin-user-table">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map(({ auth0UserId, username, role, active }, index) => (
                        <tr
                            key={auth0UserId ?? `user-${index}`}
                        >
                            <td className="username-cell"
                            >
                                <span className="username-link" onClick={() => navigate(`/admin/users/${encodeURIComponent(auth0UserId)}`)}
                                    style={{ cursor: 'pointer' }}>{username}</span>
                            </td>
                            <td>
                                <select
                                    value={role}
                                    onChange={(e) => updateUserRole(auth0UserId, e.target.value)}
                                >
                                    <option value="ADMIN">ADMIN</option>
                                    <option value="USER">USER</option>
                                    <option value="INSTRUCTOR">INSTRUCTOR</option>
                                </select>
                            </td>
                            <td>{active ? 'Active' : 'Suspended'}</td>
                            <td>
                                {active ? (
                                    <button onClick={() => updateUserStatus(auth0UserId, false)} style={{ backgroundColor: '#10b981', marginLeft: '0px' }}>Suspend</button>
                                ) : (
                                    <button onClick={() => updateUserStatus(auth0UserId, true)} style={{ backgroundColor: '#10b981' }}>Activate</button>
                                )}
                                <button onClick={() => deleteUser(auth0UserId)} style={{ marginLeft: '20px', backgroundColor: 'red' }}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}