package com.SyntaxBase.config;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.stereotype.Component;

@Component
public class AuthChannelInterceptor implements ChannelInterceptor {

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            String authHeader = accessor.getFirstNativeHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                try {
                    DecodedJWT decodedJWT = JWT.decode(token);
                    String auth0UserId = decodedJWT.getSubject();
                    accessor.setUser(new StompPrincipal(auth0UserId));
                    System.out.println("Authenticated user via WebSocket: " + auth0UserId);
                } catch (Exception e) {
                    System.err.println("Invalid JWT token: " + e.getMessage());
                    throw new IllegalArgumentException("Invalid JWT token");
                }
            } else {
                System.err.println("Missing Authorization header in WebSocket CONNECT");
                throw new IllegalArgumentException("Missing Authorization header");
            }
        }
        return message;
    }
}