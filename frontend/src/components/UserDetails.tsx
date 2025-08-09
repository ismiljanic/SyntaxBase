import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import '../styles/UserDetails.css';
import { Header } from '../pages/Header';
import AnimatedProgressBar from './AnimatedProgressBar';

type CourseProgress = {
    courseId: number;
    courseName: string;
    description?: string;
    totalLessons: number;
    completedLessons: number;
    progress: number;
    rating: number | null;
};

type Post = {
    id: number;
    content: string;
    createdAt: string;
    deleted?: boolean;
};

type UserDetailsResponse = {
    username: string;
    name: string;
    surname: string;
    dateCreated: string;
    userPosts: Post[];
    deletedPosts: Post[];
    courses: CourseProgress[];
    role: string;
    active: boolean;
};

export default function UserDetails() {
    const { userId } = useParams<{ userId: string }>();
    const { getAccessTokenSilently } = useAuth0();
    const [user, setUser] = useState<UserDetailsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) return;

        const fetchUser = async () => {
            try {
                const token = await getAccessTokenSilently();
                const res = await fetch(`http://localhost:8080/api/admin/users/${encodeURIComponent(userId)}`, {
                    headers: { Authorization: `Bearer ${token}` },
                    credentials: 'include',
                });
                if (!res.ok) throw new Error('Failed to fetch user data');
                const data = await res.json();
                setUser(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId, getAccessTokenSilently]);

    if (loading) return <p>Loading user details...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!user) return <p>User not found.</p>;

    const handleDeletePost = async (postId: number) => {
        const confirmed = window.confirm('Are you sure you want to delete this post?');
        if (!confirmed) return;

        try {
            const token = await getAccessTokenSilently();
            const res = await fetch(`http://localhost:8080/api/admin/users/posts/${postId}/delete`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` },
                credentials: 'include',
            });

            if (!res.ok) throw new Error('Failed to delete post');

            setUser((prev) =>
                prev
                    ? {
                        ...prev,
                        userPosts: prev.userPosts.map((post) =>
                            post.id === postId ? { ...post, content: '[Deleted]', deleted: true } : post
                        ),
                    }
                    : prev
            );
        } catch (err: any) {
            alert(`Error: ${err.message}`);
        }
    };

    const handleRestorePost = async (postId: number) => {
        try {
            const confirmed = window.confirm('Are you sure you want to restore this post?');
            if (!confirmed) return;

            const token = await getAccessTokenSilently();
            const res = await fetch(`http://localhost:8080/api/admin/users/posts/${postId}/restore`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` },
                credentials: 'include',
            });

            if (!res.ok) throw new Error('Failed to restore post');

            setUser((prev) => {
                if (!prev) return prev;

                const restoredPost = prev.deletedPosts.find(post => post.id === postId);
                if (!restoredPost) return prev;

                return {
                    ...prev,
                    userPosts: [...prev.userPosts, { ...restoredPost, deleted: false }],
                    deletedPosts: prev.deletedPosts.filter(post => post.id !== postId),
                };
            });
        } catch (err: any) {
            alert(`Error: ${err.message}`);
        }
    };

    const handleRemoveUserFromCourse = async (courseId: number) => {
        const confirmed = window.confirm('Are you sure you want to remove this user from this course?');
        if (!confirmed) return;
        if (!userId) {
            alert('User ID is not defined.');
            return;
        }

        try {
            const token = await getAccessTokenSilently();
            const res = await fetch(`http://localhost:8080/api/admin/users/${encodeURIComponent(userId)}/courses/${courseId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!res.ok) throw new Error('Failed to remove user from course');

            setUser(prev => {
                if (!prev) return prev;
                return {
                    ...prev,
                    courses: prev.courses.filter(course => course.courseId !== courseId),
                };
            });

            alert('User removed from course successfully');
        } catch (err: any) {
            alert(`Error: ${err.message}`);
        }
    };

    return (
        <div>
            <Header bgColor="#f5f5f5" />
            <div className="ud-container">
                <h2 className="ud-header">User Details</h2>
                <div className="ud-mainGrid">
                    <aside className="ud-sidebar">
                        <div className="ud-userInfo">
                            <p><strong>Username:</strong> {user.username}</p>
                            <p><strong>Role:</strong> {user.role}</p>
                            <p><strong>Status:</strong> {user.active ? 'Active' : 'Suspended'}</p>
                            <p><strong>Name:</strong> {user.name} {user.surname}</p>
                            <p><strong>Joined:</strong> {user.dateCreated}</p>
                        </div>
                    </aside>

                    <section className="ud-mainContent">
                        <div>
                            <h3 className="ud-subheader">Enrolled Courses</h3>
                            <div className="ud-coursesGrid">
                                {user.courses.map(course => (
                                    <div key={course.courseId} className="ud-course">
                                        <p><strong>Course:</strong> {course.courseName}</p>
                                        <p><strong>Description:</strong> {course.description}</p>
                                        <p>
                                            <strong>Progress:</strong> {course.completedLessons} / {course.totalLessons} ({course.progress.toFixed(1)}%)
                                        </p>
                                        <div style={{ marginLeft: '45px' }}>
                                            <AnimatedProgressBar progress={course.progress} />
                                        </div>
                                        <p><strong>Rating:</strong> {course.rating ?? 'Not rated yet'}</p>
                                        <button
                                            className="ud-btn ud-btn-delete"
                                            onClick={() => handleRemoveUserFromCourse(course.courseId)}
                                        >
                                            Remove from Course
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="ud-subheader">Forum Posts</h3>
                            <ul className="ud-postsList">
                                {user.userPosts.map((post) => (
                                    <li key={post.id ?? post.createdAt} className="ud-postsListItem">
                                        <div className="ud-postContent">
                                            <span className={post.deleted ? 'ud-post-deleted' : ''}>
                                                {post.deleted ? '[This post was deleted]' : post.content}
                                            </span>
                                            <em className="ud-postDate">
                                                ({new Date(post.createdAt).toLocaleDateString()})
                                            </em>
                                        </div>
                                        <div className="ud-postActions">
                                            <button
                                                className="ud-btn ud-btn-delete"
                                                onClick={() => handleDeletePost(post.id)}
                                                disabled={post.deleted}
                                            >
                                                Delete
                                            </button>
                                            <a
                                                href={`/community/${userId}`}
                                                className="ud-btn ud-btn-view"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                View Thread
                                            </a>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            <h3 className="ud-subheader">Deleted Posts</h3>
                            <ul className="ud-postsList">
                                {user.deletedPosts.map((post) => {
                                    return (
                                        <li key={post.id ?? post.createdAt} className="ud-postsListItem ud-post-deleted">
                                            <span>[Deleted] {post.content}</span>
                                            <em className="ud-postDate">
                                                ({new Date(post.createdAt).toLocaleDateString()})
                                            </em>
                                            <button
                                                className="ud-btn ud-btn-restore"
                                                onClick={() => {
                                                    handleRestorePost(post.id);
                                                }}
                                            >
                                                Restore
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </section>
                </div>
            </div >
        </div >
    );
}
