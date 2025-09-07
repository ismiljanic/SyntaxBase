// src/stompjs.d.ts
declare module '@stomp/stompjs' {
    export type StompHeaders = Record<string, string>;

    export interface IMessage {
        body: string;
        headers: StompHeaders;
    }

    export interface Frame {
        command: string;
        headers: StompHeaders;
        body: string;
    }

    export interface ClientConfig {
        webSocketFactory?: () => WebSocket;
        reconnectDelay?: number;
        connectHeaders?: StompHeaders;
        onConnect?: () => void;
        onStompError?: (frame: Frame) => void;
        onWebSocketError?: (ev: Event) => void;
        onDisconnect?: () => void;
    }

    export class Client {
        constructor(config?: ClientConfig);
        activate(): void;
        deactivate(): void;
        subscribe(destination: string, callback: (message: IMessage) => void): void;
    }
}