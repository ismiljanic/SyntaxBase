import React, { useEffect, useRef, useState } from "react";
import { Client, IMessage, Frame } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import LoadingScreen from "../components/LoadingScreen";

interface ChatMessage {
    fromUserId: string;
    toUserId: string;
    content: string;
    sentAt: string;
}

export function ChatPage() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const stompClient = useRef<Client | null>(null);
    const { username } = useParams<{ username: string }>();
    const { user, getAccessTokenSilently, isAuthenticated } = useAuth0();
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    useEffect(() => {
        if (isAuthenticated && user) {
            setCurrentUserId(user.sub ?? null);
        }
    }, [user, isAuthenticated]);

    useEffect(() => {
    }, [isAuthenticated, user]);

    const [chatWithUserId, setChatWithUserId] = useState<string | null>(null);

    useEffect(() => {
        if (!username || !isAuthenticated) return;

        const fetchAuth0Id = async () => {
            try {
                const token = await getAccessTokenSilently();
                const res = await fetch(`http://localhost:8080/api/users/${username}/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!res.ok) throw new Error("Failed to fetch user profile");
                const data = await res.json();
                setChatWithUserId(data.user.auth0UserId);
            } catch (err) {
                console.error("Error fetching Auth0 user ID:", err);
            }
        };

        fetchAuth0Id();
        console.log("Fetching Auth0 ID for username:", username);
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
        console.log("currentuserid: " + currentUserId);
    }, [currentUserId, chatWithUserId, getAccessTokenSilently]);

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
                    console.log("Connected to WebSocket");

                    const chatTopic =
                        `/topic/chat.${currentUserId < chatWithUserId ? currentUserId : chatWithUserId}.${currentUserId < chatWithUserId ? chatWithUserId : currentUserId}`;

                    console.log("Subscribing to topic:", chatTopic);

                    stompClient.current?.subscribe(chatTopic, (msg: IMessage) => {
                        const received: ChatMessage = JSON.parse(msg.body);
                        console.log("Received WebSocket message:", received);
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
            toUserId: chatWithUserId,
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

    return (
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "1rem" }}>
            <h2>Chat with {username}</h2>
            <div
                style={{
                    border: "1px solid #ccc",
                    padding: "1rem",
                    height: "400px",
                    overflowY: "scroll",
                    marginBottom: "1rem",
                }}
            >
                {messages.map((m, idx) => (
                    <div
                        key={idx}
                        style={{
                            marginBottom: "0.5rem",
                            textAlign: m.fromUserId === currentUserId ? "right" : "left",
                            backgroundColor: m.fromUserId === currentUserId ? "#dcf8c6" : "#f1f0f0",
                            padding: "0.5rem",
                            borderRadius: "8px",
                        }}
                    >
                        <strong>{m.fromUserId === currentUserId ? "You" : username}:</strong> {m.content}
                        <div style={{ fontSize: "0.75rem", color: "#666" }}>
                            {new Date(m.sentAt).toLocaleTimeString()}
                        </div>
                    </div>
                ))}
            </div>
            <div style={{ display: "flex" }}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    style={{ flex: 1, padding: "0.5rem" }}
                    placeholder="Type a message..."
                />
                <button onClick={sendMessage} style={{ padding: "0.5rem 1rem" }}>
                    Send
                </button>
            </div>
        </div>
    );
};
