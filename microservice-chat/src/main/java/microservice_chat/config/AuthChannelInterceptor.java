package microservice_chat.config;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.stereotype.Component;

@Component
public class AuthChannelInterceptor implements ChannelInterceptor {

    private static final Logger logger = LoggerFactory.getLogger(AuthChannelInterceptor.class);

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            String authHeader = accessor.getFirstNativeHeader("Authorization");

            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                try {
                    String token = authHeader.substring(7);
                    DecodedJWT decodedJWT = JWT.decode(token);
                    String auth0UserId = decodedJWT.getSubject();
                    accessor.setUser(new StompPrincipal(auth0UserId));
                    logger.info("WebSocket CONNECT with Principal: {}", auth0UserId);
                } catch (Exception e) {
                    logger.error("Invalid JWT token on WebSocket CONNECT", e);
                }
            } else {
                logger.warn("Missing Authorization header on WebSocket CONNECT");
            }
        }

        if (StompCommand.SUBSCRIBE.equals(accessor.getCommand())) {
            String destination = accessor.getDestination();
            logger.info("WebSocket SUBSCRIBE to destination: {}", destination);
        }

        return message;
    }
}