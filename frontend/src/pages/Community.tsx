import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Header } from './Header';
import { Footer } from './Footer';
import { Footer2 } from './Footer2';
import "../styles/Community.css";
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

interface Post {
    id: number;
    content: string;
    userId: string;
    username: string;
    createdAt: string;
    replies?: Post[];
    parentPostId?: number | null;
    isExpanded?: boolean;
}

export function Community() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [newPost, setNewPost] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState<string | null>(null);

    const navigate = useNavigate();
    const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

    const {
        user,
        isAuthenticated,
        getAccessTokenSilently,
        isLoading
    } = useAuth0();

    const userId = user?.sub;
    const username = user?.nickname || user?.name || 'Anonymous';

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
                    isExpanded: false
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


    const toggleExpand = (postId: number) => {
        setPosts(posts.map(post =>
            post.id === postId ? { ...post, isExpanded: !post.isExpanded } : post
        ));
    };

    const wordCount = newPost.trim() ? newPost.trim().split(/\s+/).length : 0;

    if (isLoading || loading) return <p>Loading...</p>;

    return (
        <div className="community-container">
            <Header bgColor='rgb(247, 250, 251)' />
            <div className="community-content">
                <h2 className="community-title">Community Forum</h2>
                <form className="post-form" onSubmit={handlePostSubmit}>
                    <textarea
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        placeholder="Share your thoughts..."
                        required
                        className="post-input"
                    />
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                    <div className="word-count">Limit 1024 words, Word Count: {wordCount}</div>
                    <div className='centerThisButton'>
                        <button type="submit" className="post-button">Post</button>
                    </div>
                </form>

                <div className="post-list">
                    {posts.map((post) => (
                        <div key={post.id} className={`post ${post.isExpanded ? 'expanded' : ''}`} onClick={() => toggleExpand(post.id)}>
                            <div className="post-header">
                                <span className="post-user">{post.username}</span>
                                <span className="post-time">{new Date(post.createdAt).toLocaleString()}</span>
                                {(post.userId === userId) && (
                                    <button className="delete-button" onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeletePost(post.id);
                                    }}>
                                        Delete
                                    </button>
                                )}
                            </div>

                            <p className={`post-content ${post.isExpanded ? 'expanded' : ''}`}>
                                {post.content}
                            </p>

                            {post.isExpanded && (post.replies ?? []).length > 0 && (
                                <div className="replies-list">
                                    {(post.replies ?? []).map(reply => (
                                        <div key={reply.id} className="reply">
                                            <span className="reply-user">{reply.username} (Reply)</span>
                                            <p className="reply-content">{reply.content}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {post.isExpanded && (
                                <div>
                                    <div className="reply-hint">Reply to this message:</div>
                                    <textarea
                                        placeholder="Type your reply..."
                                        className="reply-input"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleReplySubmit(post.id, e.currentTarget.value);
                                                e.currentTarget.value = '';
                                            }
                                        }}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <Footer2 bgColor='rgb(247, 250, 251)' />
            <Footer bgColor='rgb(247, 250, 251)' />
        </div>
    );
}