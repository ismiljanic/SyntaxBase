import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Header } from './Header';
import { Footer } from './Footer';
import { Footer2 } from './Footer2';
import "../styles/Community.css";

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

    useEffect(() => {
        const fetchPosts = async () => {
            const response = await axios.get<Post[]>('http://localhost:8080/api/posts');

            const structuredPosts: Post[] = response.data.reduce((acc: Post[], post) => {
                if (post.parentPostId) {
                    const parentPost = acc.find(p => p.id === post.parentPostId);
                    if (parentPost) {
                        parentPost.replies = parentPost.replies || [];
                        parentPost.replies.push(post);
                    }
                } else {
                    acc.push({ ...post, replies: [] });
                }
                return acc;
            }, []);

            const sortedPosts = structuredPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setPosts(sortedPosts);
        };
        fetchPosts();
    }, []);

    const handlePostSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (newPost.trim()) {
            const userId = sessionStorage.getItem('userId');
            try {
                const response = await axios.post<Post>('http://localhost:8080/api/posts', {
                    content: newPost,
                    userId: userId,
                });
                setPosts([{ ...response.data, replies: [], isExpanded: false }, ...posts]);
                setNewPost('');
                setErrorMessage('');
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    setErrorMessage(error.response.data.message || 'Message exceeds 1024 word limit.');
                } else {
                    setErrorMessage('An unknown error occurred.');
                }
            }
        }
    };

    const handleReplySubmit = async (postId: number, replyContent: string) => {
        if (replyContent.trim()) {
            const userId = sessionStorage.getItem('userId');
            try {
                const response = await axios.post<Post>(`http://localhost:8080/api/posts`, {
                    content: replyContent,
                    userId: userId,
                    parentPostId: postId,
                });
                setPosts(posts.map(post => {
                    if (post.id === postId) {
                        return { ...post, replies: [...(post.replies || []), response.data] };
                    }
                    return post;
                }));
            } catch (error) {
                setErrorMessage('Error occurred while replying.');
            }
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
                    <div className="word-count">Word Count: {wordCount}</div>
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
                            </div>
                            <p className={`post-content ${post.isExpanded ? 'expanded' : ''}`}>
                                {post.content}
                            </p>
                            {post.isExpanded && (
                                <>
                                    {post.replies && post.replies.length > 0 && post.replies.map(reply => (
                                        <div key={reply.id} className="reply">
                                            <span className="reply-user">{reply.username} (Reply)</span>
                                            <p className="reply-content">{reply.content}</p>
                                        </div>
                                    ))}
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
                                </>
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
