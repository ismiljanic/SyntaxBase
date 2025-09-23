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
    fromUserId: string;
    fromUserUsername: string;
    toUserId: string;
    toUserUsername: string;
    content: string;
    sentAt: string;
}

interface SelectedContact {
    id: string;
    username: string;
}

export function ChatPage() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const stompClient = useRef<Client | null>(null);
    const { username } = useParams<{ username: string }>();
    const { user, getAccessTokenSilently, isAuthenticated } = useAuth0();
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [chatWithUserId, setChatWithUserId] = useState<string | null>(null);
    const [currentUserUsername, setCurrentUserUsername] = useState<string | null>(null);
    const [chatWithUserUsername, setChatWithUserUsername] = useState<string | null>(null);

    const [autoScroll, setAutoScroll] = useState(true);
    const messagesContainerRef = useRef<HTMLDivElement>(null);

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
        if (!currentUserId || !chatWithUserId) return;

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
                        setMessages(prev => [...prev, received]);
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

        const msg: ChatMessage = {
            fromUserId: currentUserId!,
            fromUserUsername: currentUserUsername!,
            toUserId: chatWithUserId,
            toUserUsername: chatWithUserUsername!,
            content: newMessage,
            sentAt: new Date().toISOString(),
        };

        stompClient.current?.publish({
            destination: "/app/chat.send",
            body: JSON.stringify(msg),
            headers: { Authorization: `Bearer ${await getAccessTokenSilently()}` }
        });
        setNewMessage("");
    };

    const handleContactSelect = (contact: SelectedContact) => {
        setChatWithUserId(contact.id);
        setChatWithUserUsername(contact.username);
    };


    return (
        <div>
            <Header bgColor="#f9f9f9" />
            <div className="chat-page">
                <ChatSidebar onSelectContact={handleContactSelect} />

                <div className="chat-container">
                    <header className="chat-header">Chat with {chatWithUserUsername}</header>

                    <div className="chat-messages" id="chat-messages" ref={messagesContainerRef}>
                        {messages.map((m, idx) => (
                            <div
                                key={idx}
                                className={`message ${m.fromUserId === currentUserId ? "sent" : "received"}`}
                            >
                                <div className="message-content">{m.content}</div>
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
                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            className="chat-input"
                        />
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