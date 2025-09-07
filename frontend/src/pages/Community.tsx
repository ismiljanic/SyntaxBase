import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Header } from './Header';
import { Footer } from './Footer';
import { Footer2 } from './Footer2';
import "../styles/Community.css";
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import LoadingScreen from '../components/LoadingScreen';

interface Post {
    id: number;
    content: string;
    userId: string;
    username: string;
    createdAt: string;
    replies?: Post[];
    parentPostId?: number | null;
    isExpanded?: boolean;
    category: string;
    userRole?: string;
    updatedAt: string;
    deleted: boolean;
    userAccountCreatedAt?: Date;
}

interface BadgeDTO {
    id: string;
    name: string;
    description: string;
    type: string;
    criteria?: string;
    permanent: boolean;
}

interface UserBadge {
    id: string;
    badge: BadgeDTO;
    awardedAt: string;
    revoked: boolean;
    progress?: string;
}

export function Community() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [newPost, setNewPost] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
    const [editingReplyId, setEditingReplyId] = useState<number | null>(null);
    const [editedReplyContent, setEditedReplyContent] = useState('');
    const [editingPostId, setEditingPostId] = React.useState<number | null>(null);
    const [editedPostContent, setEditedPostContent] = React.useState<string>("");
    const [modalMessage, setModalMessage] = useState<string | null>(null);
    const [autoExpandedPostId, setAutoExpandedPostId] = useState<number | null>(null);
    const [showCard, setShowCard] = useState<Number | null>(null);
    const [hoveredUserBadges, setHoveredUserBadges] = useState<{ [userId: string]: UserBadge[] }>({});

    const categories = [
        'General',
        'Web Development',
        'Game Development',
        'Database Manipulation',
        'Problem Solving',
        'Discussion'
    ];

    const [category, setCategory] = useState(categories[0]);
    const navigate = useNavigate();
    const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';
    const [filterCategory, setFilterCategory] = useState('All');
    const location = useLocation();

    const {
        user,
        isAuthenticated,
        getAccessTokenSilently,
        isLoading
    } = useAuth0();

    const userId = user?.sub;
    const username = user?.nickname || user?.name || 'Anonymous';

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const scrollToPost = params.get('scrollToPost');
        if (!scrollToPost) return;

        const postId = Number(scrollToPost);
        if (autoExpandedPostId === postId) return;

        let attempts = 0;
        const maxAttempts = 10;

        const scrollToElement = () => {
            const el = document.getElementById(`post-${postId}`);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });

                setPosts((prevPosts) =>
                    prevPosts.map(post =>
                        post.id === postId ? { ...post, isExpanded: true } : post
                    )
                );
                setAutoExpandedPostId(postId);
            } else if (attempts < maxAttempts) {
                attempts++;
                setTimeout(scrollToElement, 300);
            } else {
                console.warn(`Post with id post-${postId} not found after ${maxAttempts} attempts.`);
            }
        };

        scrollToElement();
    }, [location.search, posts, autoExpandedPostId]);

    const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const fetchUserRole = async () => {
            if (!token || !userId) return;

            try {
                const response = await axios.get<{ role: string }>(`${baseUrl}/api/users/role/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                setUserRole(response.data.role);
            } catch (error) {
                console.error("Failed to fetch user role:", error);
                setUserRole(null);
            }
        };

        fetchUserRole();
    }, [token, userId]);


    useEffect(() => {
        const fetchTokenAndPosts = async () => {
            if (!isAuthenticated || !userId) return;
            try {
                const accessToken = await getAccessTokenSilently();
                setToken(accessToken);

                const response = await axios.get<Post[]>(`${baseUrl}/api/posts`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    withCredentials: true,
                });
                const structuredPosts = response.data.map(post => ({
                    ...post,
                    replies: post.replies || [],
                    isExpanded: false,
                    userRole: post.userRole || undefined,
                }));
                const sortedPosts = structuredPosts.sort((a, b) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                setPosts(sortedPosts);
                setErrorMessage('');
            } catch (error: any) {
                if (axios.isAxiosError(error) && error.response?.status === 401) {
                    navigate('/login');
                } else {
                    setErrorMessage('Failed to fetch posts.');
                }
                console.error('Fetch error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTokenAndPosts();
    }, [isAuthenticated, userId, getAccessTokenSilently]);

    const handlePostSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!newPost.trim() || !token || !userId) return;

        try {
            const response = await axios.post<Post>(`${baseUrl}/api/posts`, {
                content: newPost,
                userId: userId,
                category: category,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            setPosts([{
                ...response.data,
                username: username,
                replies: [],
                isExpanded: false
            }, ...posts]);

            setNewPost('');
            setErrorMessage('');
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    setErrorMessage('Session expired. Please login again.');
                    navigate('/login');
                } else {
                    setErrorMessage(error.response?.data?.message || 'Post failed.');
                }
            } else {
                setErrorMessage('Unknown error occurred.');
            }
        }
    };

    const handleReplySubmit = async (postId: number, replyContent: string) => {
        if (!replyContent.trim() || !token || !userId) return;

        try {
            const response = await axios.post<Post>(`${baseUrl}/api/posts`, {
                content: replyContent,
                userId: userId,
                parentPost: { id: postId },
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            setPosts(posts.map(post => {
                if (post.id === postId) {
                    return {
                        ...post,
                        replies: [...(post.replies || []), {
                            ...response.data,
                            username: username
                        }]
                    };
                }
                return post;
            }));
        } catch (error: any) {
            setErrorMessage('Reply failed. ' + (axios.isAxiosError(error) ? error.response?.data?.message : ''));
        }
    };

    const handleDeletePost = async (postId: number) => {
        if (!token || !userId) return;

        const confirmed = window.confirm("Are you sure you want to delete this post?");
        if (!confirmed) return;

        try {
            await axios.delete(`${baseUrl}/api/posts/${postId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setPosts(posts.filter(post => post.id !== postId));
        } catch (error: any) {
            setErrorMessage('Failed to delete post. ' + (axios.isAxiosError(error) ? error.response?.data?.message : ''));
        }
    };

    const handleSaveEditedPost = async (postId: number) => {
        if (!editedPostContent.trim() || !token) return;

        try {
            await axios.put(
                `${baseUrl}/api/posts/${postId}`,
                { content: editedPostContent },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setPosts(
                posts.map((post) =>
                    post.id === postId ? { ...post, content: editedPostContent } : post
                )
            );

            setEditingPostId(null);
            setEditedPostContent("");
        } catch (error) {
            console.error("Failed to update post:", error);
        }
    };

    const handleSaveEditedReply = async (parentPostId: number, replyId: number) => {
        if (!editedReplyContent.trim() || !token) return;

        try {
            await axios.put(`${baseUrl}/api/posts/${replyId}`, {
                content: editedReplyContent
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setPosts(posts.map(post => {
                if (post.id === parentPostId) {
                    return {
                        ...post,
                        replies: post.replies?.map(reply =>
                            reply.id === replyId
                                ? { ...reply, content: editedReplyContent }
                                : reply
                        )
                    };
                }
                return post;
            }));

            setEditingReplyId(null);
            setEditedReplyContent('');
        } catch (error) {
            console.error('Failed to update reply:', error);
        }
    };



    const toggleExpand = (postId: number) => {
        setPosts(posts.map(post =>
            post.id === postId ? { ...post, isExpanded: !post.isExpanded } : post
        ));
    };

    const wordCount = newPost.trim() ? newPost.trim().split(/\s+/).length : 0;

    if (isLoading || loading) {
        return <LoadingScreen />;
    }

    const handleReport = async (postId: number) => {
        if (!token || !userId) return;

        const reason = window.prompt("Please enter reason for reporting this post:");
        if (!reason || reason.trim().length === 0) return;

        try {
            await axios.post(`http://localhost:8080/api/reports`, {
                postId,
                reporterId: userId,
                reason: reason.trim()
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setModalMessage("Post has been reported. Thank you.");
        } catch (error) {
            console.error("Failed to report post:", error);
            setModalMessage("Failed to report. Please try again.");
        }
    };

    const handleMouseEnter = (id: React.SetStateAction<Number | null>) => {
        if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
        setShowCard(id);
    };

    const handleMouseLeave = () => {
        hideTimeoutRef.current = setTimeout(() => {
            setShowCard(null);
        }, 75);
    };

    const handleHover = async (userId: string) => {
        if (!hoveredUserBadges[userId]) {
            if (!token) return;

            try {
                const res = await fetch(`http://localhost:8080/api/users/${userId}/badges`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    console.error("Failed to fetch badges:", res.status, res.statusText);
                    return;
                }

                const data: UserBadge[] = await res.json();
                setHoveredUserBadges(prev => ({ ...prev, [userId]: data }));
            } catch (err) {
                console.error("Error fetching badges:", err);
            }
        }
    };

    return (
        <div className="community-container" style={{ paddingTop: '0em' }}>
            <Header bgColor="rgb(247, 250, 251)" />

            <div className="community-content">
                <h2 className="community-title">Community Forum</h2>

                <form className="post-form" onSubmit={handlePostSubmit}>
                    <div className="post-form-header">
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="category-select"
                        >
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    <textarea
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        placeholder="Share your thoughts..."
                        required
                        className="post-input"
                    />

                    {errorMessage && <div className="error-message">{errorMessage}</div>}

                    <div className="form-footer">
                        <div className="word-count">Limit 1024 words, Word Count: {wordCount}</div>
                        <button type="submit" className="post-button">
                            Post
                        </button>
                    </div>
                </form>
                <div className="post-list">
                    <div className="community-controls">
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="category-select"
                        >
                            <option value="All">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
                            className="category-select"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                        </select>


                        <div className="word-count">Word count: {wordCount}</div>
                    </div>
                    {posts
                        .filter(post => filterCategory === "All" || post.category === filterCategory)
                        .sort((a, b) => {
                            const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                            return sortOrder === 'newest' ? -diff : diff;
                        })
                        .map((post) => (
                            <div
                                key={post.id}
                                id={`post-${post.id}`}
                                className={`post ${post.isExpanded ? "expanded" : ""}`}
                                onClick={() => toggleExpand(post.id)}
                            >
                                <div className="post-header">
                                    <div className="post-header-left">
                                        <span className={`post-category ${post.category.replace(/\s+/g, '')}`}>
                                            {post.category}
                                        </span>
                                    </div>
                                    <div className="post-header-center">
                                        <div
                                            className="post-user-wrapper"
                                            onMouseEnter={() => {
                                                handleMouseEnter(post.id);
                                                handleHover(post.userId);
                                            }}
                                            onMouseLeave={handleMouseLeave}
                                        >
                                            <span className="post-user">
                                                {post.username}
                                            </span>
                                            {post.userRole && <span className={`user-role-badge ${post.userRole.toLowerCase()}`}>{post.userRole}</span>}

                                            <div className={`user-hover-card ${showCard === post.id ? "visible" : ""}`}>
                                                <div className="user-hover-card-header section">
                                                    <strong>{post.username}</strong>
                                                    {post.userRole && <span className={`user-role-badge ${post.userRole.toLowerCase()}`}>{post.userRole}</span>}
                                                </div>

                                                <div className="user-stats section">
                                                    {post.userAccountCreatedAt && (
                                                        <span>Joined: {new Date(post.userAccountCreatedAt).toLocaleString()}</span>
                                                    )}
                                                </div>

                                                {hoveredUserBadges[post.userId]?.length > 0 && (
                                                    <div className="user-badges section">
                                                        {hoveredUserBadges[post.userId].map((ub) => (
                                                            <span key={ub.id} className={`badge ${ub.badge.type.toLowerCase()}`}>
                                                                {ub.badge.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}

                                                <div className="user-actions section">
                                                    <a href={`/user/${post.username}`} className="view-profile-link">View Profile →</a>
                                                    <a href={`/user/chat/${post.username}`} className="view-profile-link">Chat With User →</a>
                                                </div>
                                            </div>
                                        </div>

                                        <span className="post-time">
                                            {new Date(post.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="post-header-right">
                                        {post.userId === userId && (
                                            <button
                                                className="delete-button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeletePost(post.id);
                                                }}
                                            >
                                                Delete
                                            </button>
                                        )}
                                        {post.userId !== userId && (
                                            <button
                                                className="report-button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleReport(post.id);
                                                }}
                                            >
                                                Report
                                            </button>
                                        )}
                                    </div>
                                    {editingPostId === post.id ? (
                                        <>
                                            <textarea
                                                className="edit-input"
                                                value={editedPostContent}
                                                onChange={(e) => setEditedPostContent(e.target.value)}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                            <button
                                                className="edit-button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSaveEditedPost(post.id);
                                                }}
                                            >
                                                Save
                                            </button>
                                            <button
                                                className="edit-button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEditingPostId(null);
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            {post.userId === userId && (
                                                <button
                                                    className="edit-button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setEditingPostId(post.id);
                                                        setEditedPostContent(post.content);
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                            )}
                                        </>
                                    )}

                                </div>
                                <div
                                    className={`post-expandable ${post.isExpanded ? "expanded" : ""}`}
                                >

                                    <p
                                        className={`post-content ${post.isExpanded ? "expanded" : ""
                                            }`}
                                    >
                                        {post.content}
                                    </p>
                                    {
                                        post.updatedAt && new Date(post.updatedAt).getTime() > new Date(post.createdAt).getTime() && (
                                            <span className="edited-label">(edited)</span>
                                        )
                                    }
                                    {
                                        post.isExpanded && (post.replies ?? []).length > 0 && (
                                            <div className="replies-list">
                                                {(post.replies ?? []).map((reply) => (
                                                    <div key={reply.id} className="reply">
                                                        <div className="reply-header">
                                                            <span className="reply-user">
                                                                {reply.username} (Reply)
                                                                {reply.userRole && (
                                                                    <span className={`user-role-badge ${reply.userRole.toLowerCase()}`}>
                                                                        {reply.userRole}
                                                                    </span>
                                                                )}
                                                            </span>

                                                            <small className="reply-date">
                                                                {new Date(reply.createdAt).toLocaleString()}
                                                            </small>
                                                        </div>
                                                        {editingReplyId === reply.id ? (
                                                            <>
                                                                <textarea
                                                                    className="edit-input"
                                                                    value={editedReplyContent}
                                                                    onChange={(e) => setEditedReplyContent(e.target.value)}
                                                                    onClick={(e) => e.stopPropagation()}
                                                                />
                                                                <button
                                                                    className="edit-button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleSaveEditedReply(post.id, reply.id);
                                                                    }}
                                                                >
                                                                    Save
                                                                </button>

                                                                <button
                                                                    className="edit-button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setEditingReplyId(null);
                                                                    }}
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <p className="reply-content">{reply.content}</p>
                                                                {reply.userId === userId && (
                                                                    <button
                                                                        className="edit-button"
                                                                        onClick={(e) => {
                                                                            setEditingReplyId(reply.id);
                                                                            setEditedReplyContent(reply.content);
                                                                            e.stopPropagation();
                                                                        }}
                                                                    >
                                                                        Edit
                                                                    </button>
                                                                )}
                                                                {reply.userId !== userId && (
                                                                    <button
                                                                        className="report-button"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleReport(reply.id);
                                                                        }}
                                                                    >
                                                                        Report
                                                                    </button>
                                                                )}
                                                            </>
                                                        )}
                                                        {reply.updatedAt && new Date(reply.updatedAt).getTime() > new Date(reply.createdAt).getTime() && (
                                                            <span className="edited-label">(edited)</span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )
                                    }

                                    {
                                        post.isExpanded && (
                                            <div>
                                                <div className="reply-hint">Reply to this message:</div>
                                                <textarea
                                                    placeholder="Type your reply..."
                                                    className="reply-input"
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter" && !e.shiftKey) {
                                                            e.preventDefault();
                                                            handleReplySubmit(post.id, e.currentTarget.value);
                                                            e.currentTarget.value = "";
                                                        }
                                                    }}
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        ))}
                </div>
            </div>
            {
                modalMessage && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <p>{modalMessage}</p>
                            <button onClick={() => setModalMessage(null)}>Close</button>
                        </div>
                    </div>
                )
            }
            <Footer2 bgColor="rgb(247, 250, 251)" />
            <Footer bgColor="rgb(247, 250, 251)" />
        </div >
    );
}