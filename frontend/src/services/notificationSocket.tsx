import { useAuth0 } from '@auth0/auth0-react';
import { Client, IMessage, Frame } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useEffect, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';


type DecodedToken = {
    sub: string;
};

export const useNotificationSocket = (onMessage: (msg: any) => void) => {
    const { getAccessTokenSilently, isAuthenticated } = useAuth0();
    const stompClient = useRef<Client | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            console.log("User not authenticated, skipping WebSocket connection.");
            return;
        }

        const connect = async () => {
            try {
                const token = await getAccessTokenSilently();
                if (!token) return;

                const decoded = jwtDecode<DecodedToken>(token);
                const userId = decoded.sub;

                const socket = new SockJS('http://localhost:8090/ws-notifications');

                stompClient.current = new Client({
                    webSocketFactory: () => socket,
                    reconnectDelay: 5000,
                    connectHeaders: {
                        Authorization: `Bearer ${token}`
                    },
                    onConnect: () => {
                        stompClient.current?.subscribe(
                            `/topic/notifications/${userId}`,
                            (message: IMessage) => {
                                const payload = JSON.parse(message.body);
                                onMessage(payload);
                            }
                        );
                    },
                    onStompError: (frame: Frame) => {
                        console.error("STOMP Error:", frame.headers['message']);
                    },
                    onWebSocketError: (ev: Event) => {
                        console.error("WebSocket Error:", ev);
                    },
                    onDisconnect: () => {
                        console.log("Disconnected from WebSocket");
                    },
                });

                stompClient.current.activate();
            } catch (e) {
                console.error("WebSocket connection failed:", e);
            }
        };

        connect();

        return () => {
            stompClient.current?.deactivate();
        };
    }, [getAccessTokenSilently, isAuthenticated, onMessage]);
};
