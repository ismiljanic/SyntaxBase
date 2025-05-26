import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Header } from './Header';
import { Footer } from './Footer';
import { Footer2 } from './Footer2';
import "../styles/Community.css";
import { useNavigate } from 'react-router-dom';

interface Post {
    id: number;
    content: string;
    userId: number;
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
    const navigate = useNavigate();

    const userRole = sessionStorage.getItem('userRole');
    const userId = sessionStorage.getItem('userId');
    const username = sessionStorage.getItem('username');
    const token = sessionStorage.getItem('userToken');
    const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

    const api = axios.create({
        baseURL: baseUrl,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : undefined
        }
    });

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const response = await api.get<Post[]>('/api/posts');
                const structuredPosts: Post[] = response.data.map(post => ({
                    ...post,
                    replies: post.replies || [],
                    isExpanded: false
                }));
                const sortedPosts = structuredPosts.sort((a, b) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                setPosts(sortedPosts);
                setErrorMessage('');
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    if (error.response?.status === 401) {
                        navigate('/login');
                    } else {
                        setErrorMessage(error.response?.data?.message || 'Failed to fetch posts');
                    }
                } else {
                    setErrorMessage('An unexpected error occurred');
                }
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [baseUrl, navigate]);

    const handlePostSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!newPost.trim()) return;
        const userId = sessionStorage.getItem('userId');

        if (!userId) {
            setErrorMessage('You must be logged in to post');
            navigate('/login');
            return;
        }
        try {
            const response = await api.post<Post>('/api/posts', {
                content: newPost,
                userId: userId,
            });

            setPosts([{
                ...response.data,
                username: username || 'Anonymous',
                replies: [],
                isExpanded: false
            }, ...posts]);

            setNewPost('');
            setErrorMessage('');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    setErrorMessage('Session expired. Please login again.');
                    navigate('/login');
                } else {
                    setErrorMessage(error.response?.data?.message ||
                        'Message exceeds 1024 word limit or other error occurred');
                }
            } else {
                setErrorMessage('An unknown error occurred.');
            }
        }
    };

    const handleReplySubmit = async (postId: number, replyContent: string) => {
        if (!replyContent.trim() || !userId) return;

        try {
            const response = await api.post<Post>('/api/posts', {
                content: replyContent,
                userId: userId,
                parentPost: { id: postId },
            });

            setPosts(posts.map(post => {
                if (post.id === postId) {
                    return {
                        ...post,
                        replies: [
                            ...(post.replies || []),
                            {
                                ...response.data,
                                username: username || 'Anonymous'
                            }
                        ]
                    };
                }
                return post;
            }));
        } catch (error) {
            setErrorMessage('Error occurred while replying. ' +
                (axios.isAxiosError(error) ? error.response?.data?.message : ''));
        }
    };

    const handleDeletePost = async (postId: number) => {
        if (!username) return;

        try {
            await api.delete(`/api/posts/${postId}`, {
                params: { username },
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setPosts(posts.filter(post => post.id !== postId));
        } catch (error) {
            console.error('Error deleting post:', error);
            setErrorMessage('Failed to delete post. ' +
                (axios.isAxiosError(error) ? error.response?.data?.message : ''));
        }
    };

    const toggleExpand = (postId: number) => {
        setPosts(posts.map(post =>
            post.id === postId ? { ...post, isExpanded: !post.isExpanded } : post
        ));
    };

    const wordCount = newPost.trim() ? newPost.trim().split(/\s+/).length : 0;
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
                                {(post.userId === Number(sessionStorage.getItem('userId')) || userRole === 'ADMIN') && (
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

                            {post.isExpanded && post.replies && post.replies.length > 0 && (
                                <div className="replies-list">
                                    {post.replies.map(reply => (
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
