import React, { useEffect, useRef, useState } from "react";
import { Client, IMessage, Frame } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import LoadingScreen from "../../components/LoadingScreen";
import '../../styles/chat/ChatPage.css';
import { Header } from "../Header";
import { Footer } from "../Footer";
import { Footer2 } from "../Footer2";
import { ChatSidebar } from "../../components/chat/ChatContactSidebar";

interface ChatMessage {
    id?: string;
    fromUserId: string;
    fromUserUsername: string;
    toUserId: string;
    toUserUsername: string;
    content: string;
    sentAt: string;
    deleted?: boolean;
    replyToMessageId?: string | null;
    edited?: boolean;
    editedAt?: string | null;
}

interface SelectedContact {
    id: string;
    username: string;
}

interface ChatSummary {
    otherUserId: string;
    otherUsername: string;
}


export function ChatPage() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const stompClient = useRef<Client | null>(null);
    const { username } = useParams<{ username: string }>();
    const { user, getAccessTokenSilently, isAuthenticated } = useAuth0();
    const [messageIdToDelete, setMessageIdToDelete] = useState<string | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [chatWithUserId, setChatWithUserId] = useState<string | null>(null);
    const [currentUserUsername, setCurrentUserUsername] = useState<string | null>(null);
    const [chatWithUserUsername, setChatWithUserUsername] = useState<string | null>(null);
    const [actionMessageId, setActionMessageId] = useState<string | null>(null);
    const [autoScroll, setAutoScroll] = useState(true);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
    const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
    const MAX_MESSAGE_LENGTH = 500;

    const scrollToBottom = () => {
        if (autoScroll && messagesContainerRef.current) {
            const container = messagesContainerRef.current;
            container.scrollTop = container.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, autoScroll]);


    useEffect(() => {
        if (isAuthenticated && user) {
            setCurrentUserId(user.sub ?? null);
            setCurrentUserUsername(user.email || user.nickname || "You");
        }
    }, [user, isAuthenticated]);


    useEffect(() => {
    }, [isAuthenticated, user]);

    useEffect(() => {
        if (!username || !isAuthenticated) return;

        const fetchAuth0Id = async () => {
            try {
                const token = await getAccessTokenSilently();
                const res = await fetch(`http://localhost:8080/api/users/${username}/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                setChatWithUserId(data.user.auth0UserId);
                setChatWithUserUsername(data.user.email || data.user.username);
            } catch (err) {
                console.error(err);
            }
        };

        fetchAuth0Id();
    }, [username, isAuthenticated, getAccessTokenSilently]);


    useEffect(() => {
        if (!currentUserId || !chatWithUserId) {
            setMessages([]);
            return;
        }

        const fetchMessages = async () => {
            try {
                const token = await getAccessTokenSilently();
                //Has to be encodeed due to special characters i.e. "|" in auth0UserId
                const res = await fetch(
                    `http://localhost:8100/api/chat/messages?user1=${encodeURIComponent(currentUserId)}&user2=${encodeURIComponent(chatWithUserId)}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                if (!res.ok) throw new Error("Failed to fetch messages");
                const data: ChatMessage[] = await res.json();
                setMessages(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchMessages();
    }, [currentUserId, chatWithUserId, currentUserUsername, chatWithUserUsername, getAccessTokenSilently]);

    useEffect(() => {
        if (!isAuthenticated || !currentUserId || !chatWithUserId) return;

        const connectWebSocket = async () => {
            const token = await getAccessTokenSilently();
            const socket = new SockJS("http://localhost:8100/ws");

            stompClient.current = new Client({
                webSocketFactory: () => socket as any,
                reconnectDelay: 5000,
                connectHeaders: { Authorization: `Bearer ${token}` },
                onConnect: () => {

                    const chatTopic =
                        `/topic/chat.${currentUserId < chatWithUserId ? currentUserId : chatWithUserId}.${currentUserId < chatWithUserId ? chatWithUserId : currentUserId}`;

                    stompClient.current?.subscribe(chatTopic, (msg: IMessage) => {
                        const received: ChatMessage = JSON.parse(msg.body);

                        setMessages(prev => {
                            const exists = prev.find(m => m.id === received.id);
                            if (exists) {
                                return prev.map(m => m.id === received.id ? received : m);
                            }
                            return [...prev, received];
                        });
                    });


                },
                onStompError: (frame: Frame) => {
                    console.error("STOMP Error:", frame.headers["message"]);
                },
                onWebSocketError: (ev: Event) => {
                    console.error("WebSocket Error:", ev);
                },
                onDisconnect: () => {
                    console.log("Disconnected from WebSocket");
                },
            });

            stompClient.current.activate();
        };

        connectWebSocket();

        return () => stompClient.current?.deactivate();
    }, [isAuthenticated, currentUserId, chatWithUserId, getAccessTokenSilently]);

    if (!currentUserId) return <LoadingScreen />;

    const sendMessage = async () => {
        if (!newMessage.trim() || !chatWithUserId) return;

        const maxLength = 500;
        const content = newMessage.slice(0, maxLength);

        if (editingMessageId) {
            await saveEdit(editingMessageId);
            setActionMessageId(null);
            return;
        }

        const msg: ChatMessage = {
            fromUserId: currentUserId!,
            fromUserUsername: currentUserUsername!,
            toUserId: chatWithUserId!,
            toUserUsername: chatWithUserUsername!,
            content,
            sentAt: new Date().toISOString(),
            replyToMessageId: replyingTo?.id || null,
        };

        stompClient.current?.publish({
            destination: "/app/chat.send",
            body: JSON.stringify(msg),
            headers: { Authorization: `Bearer ${await getAccessTokenSilently()}` }
        });

        setNewMessage("");
        setReplyingTo(null);
    };


    const handleContactSelect = (contact: SelectedContact) => {
        setChatWithUserId(contact.id);
        setChatWithUserUsername(contact.username);
    };

    const handleContactRemoved = (removedId: string, remainingContacts: ChatSummary[]) => {
        if (chatWithUserId === removedId) {
            if (remainingContacts.length > 0) {
                const next = remainingContacts[0];
                setChatWithUserId(next.otherUserId);
                setChatWithUserUsername(next.otherUsername);
                setMessages([]);
            } else {
                setChatWithUserId(null);
                setChatWithUserUsername(null);
                setMessages([]);
            }
        }
    };

    const handleMessageClick = (messageId: string) => {
        setActionMessageId(prev => (prev === messageId ? null : messageId));
    };

    const deleteMessage = async (messageId: string) => {
        try {
            console.log("Attempting to delete message with ID:", messageId);

            if (!messageId) {
                console.error("Message ID is undefined!");
                return;
            }

            const token = await getAccessTokenSilently();
            console.log("Using token:", token);

            const res = await fetch(
                `http://localhost:8100/api/chat/messages/${messageId}/delete`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                }
            );

            console.log("Response status:", res.status, res.statusText);

            if (!res.ok) {
                const text = await res.text();
                console.error("Failed to delete message:", text);
                return;
            }

            setMessages(prev =>
                prev.map(m => m.id === messageId ? { ...m, deleted: true } : m)
            );

            setActionMessageId(null);
        } catch (err) {
            console.error("Delete message error:", err);
        }
    };

    const handleReply = (message: ChatMessage) => {
        setEditingMessageId(null);
        setNewMessage("");
        setReplyingTo(message);
        setActionMessageId(null);
    };

    const handleEdit = (message: ChatMessage) => {
        setReplyingTo(null);
        setEditingMessageId(message.id!);
        setNewMessage(message.content);
    };

    const saveEdit = async (messageId: string) => {
        if (!messageId || !newMessage.trim()) return;

        const token = await getAccessTokenSilently();
        const res = await fetch(`http://localhost:8100/api/chat/messages/${messageId}/edit`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ content: newMessage })
        });

        if (res.ok) {
            const updated: ChatMessage = await res.json();
            setMessages(prev => prev.map(m => m.id === updated.id ? updated : m));
            setNewMessage("");
            setEditingMessageId(null);
        }
    };

    return (
        <div>
            <Header bgColor="#f9f9f9" />
            <div className="chat-page">
                <ChatSidebar
                    onSelectContact={handleContactSelect}
                    onRemoveContact={handleContactRemoved}
                />

                <div className="chat-container">
                    <header className="chat-header">Chat with {chatWithUserUsername}</header>

                    <div className="chat-messages" id="chat-messages" ref={messagesContainerRef}>
                        {messages.map((m, idx) => (
                            <div
                                key={idx}
                                className={`message ${m.fromUserId === currentUserId ? "sent" : "received"}`}
                                onClick={() => handleMessageClick(m.id!)}
                            >
                                {actionMessageId === m.id && !m.deleted && (
                                    <div className="message-popup" style={{ top: m.fromUserId === currentUserId ? '-110px' : '-80px' }}>
                                        {m.fromUserId === currentUserId && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteMessage(m.id!);
                                                }}
                                            >
                                                Delete
                                            </button>
                                        )}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleReply(m);
                                            }}
                                        >
                                            Reply
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEdit(m);
                                            }}
                                        >
                                            Edit
                                        </button>
                                    </div>
                                )}
                                {m.replyToMessageId && (
                                    <div className="reply-snippet">
                                        <span className="reply-author">
                                            {
                                                messages.find(x => x.id === m.replyToMessageId)?.fromUserUsername
                                                || "Unknown"
                                            }
                                        </span>
                                        <div className="reply-snippet-text">
                                            {
                                                messages.find(x => x.id === m.replyToMessageId)?.content
                                                || "Message unavailable"
                                            }
                                        </div>
                                    </div>
                                )}
                                <div className="message-content">
                                    {m.deleted ? <i>Message deleted</i> : m.content}
                                    {m.edited && <span className="edited-tag"> (edited)</span>}
                                </div>
                                <div className="message-meta">
                                    <span
                                        className="sender-name"
                                        style={{
                                            marginRight: '6px',
                                            color: m.fromUserId === currentUserId ? '#ffffff' : '#333'
                                        }}
                                    >
                                        {m.fromUserId === currentUserId ? "You" : username}
                                    </span>
                                    <span
                                        className="timestamp"
                                        style={{
                                            color: m.fromUserId === currentUserId ? 'rgba(255, 255, 255, 0.78)' : 'rgba(0, 0, 0, 0.79)'
                                        }}
                                    >
                                        {new Date(m.sentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="chat-input-container">
                        {replyingTo && (
                            <div className="reply-preview">
                                <div className="reply-info">
                                    Replying to <strong>{replyingTo.fromUserUsername}</strong>:
                                </div>
                                <div className="reply-text">{replyingTo.content}</div>
                                <button
                                    className="cancel-reply-btn"
                                    onClick={() => setReplyingTo(null)}
                                >
                                    x
                                </button>
                            </div>
                        )}
                        {editingMessageId && (
                            <div className="edit-preview">
                                <div className="edit-info">
                                    Editing <strong>{messages.find(m => m.id === editingMessageId)?.fromUserUsername}</strong>’s message:
                                </div>
                                <div className="edit-text">
                                    {messages.find(m => m.id === editingMessageId)?.content}
                                </div>
                                <button
                                    className="cancel-edit-btn"
                                    onClick={() => {
                                        setEditingMessageId(null);
                                        setNewMessage("");
                                    }}
                                >
                                    x
                                </button>
                            </div>
                        )}
                        <div className="chat-input-wrapper">
                            <input
                                type="text"
                                placeholder="Type a message..."
                                value={newMessage}
                                onChange={(e) => {
                                    setNewMessage(e.target.value.slice(0, MAX_MESSAGE_LENGTH));
                                }}
                                className="chat-input"
                            />
                        </div>
                        <div className="char-counter">
                            {newMessage.length} / {MAX_MESSAGE_LENGTH}
                        </div>
                        <button onClick={sendMessage} className="chat-send-btn">
                            Send
                        </button>
                    </div>
                </div>
            </div>
            <Footer2 bgColor="#f9f9f9" />
            <Footer bgColor="#f9f9f9" />
        </div>
    );
};