package microservice_chat.controller;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import microservice_chat.config.AuthChannelInterceptor;
import microservice_chat.dto.ChatMessageDTO;
import microservice_chat.dto.ChatSummaryDTO;
import microservice_chat.services.ChatMessageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.security.Principal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class ChatController {

    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);
    private final KafkaTemplate<String, ChatMessageDTO> kafkaTemplate;
    private final ChatMessageService chatService;

    public ChatController(KafkaTemplate<String, ChatMessageDTO> kafkaTemplate,
                          ChatMessageService chatService) {
        this.kafkaTemplate = kafkaTemplate;
        this.chatService = chatService;
    }

    @MessageMapping("/chat.send")
    public void sendMessage(
            @Payload ChatMessageDTO chatMessage,
            @Header("Authorization") String authHeader) throws AccessDeniedException {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new AccessDeniedException("Missing Authorization header");
        }

        String token = authHeader.substring(7);
        DecodedJWT decodedJWT = JWT.decode(token);
        String auth0UserId = decodedJWT.getSubject();

        chatMessage.setFromUserId(auth0UserId);
        chatMessage.setId(UUID.randomUUID());
        chatMessage.setSentAt(Instant.now());

        chatService.processMessage(chatMessage);
    }

    @GetMapping("/api/chat/messages")
    public List<ChatMessageDTO> getMessages(@RequestParam String user1,
                                            @RequestParam String user2,
                                            Principal principal) {
        logger.info("Decoded user1: {}", user1);
        logger.info("Decoded user2: {}", user2);
        return chatService.getMessagesBetween(user1, user2);
    }

    @GetMapping("api/chat/summaries")
    public List<ChatSummaryDTO> getChatSummaries(@AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getSubject();
        return chatService.getChatSummariesForUser(userId);
    }

}