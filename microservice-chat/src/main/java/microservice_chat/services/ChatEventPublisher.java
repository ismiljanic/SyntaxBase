package microservice_chat.services;

import common.EventEnvelope;
import common.EventType;
import microservice_chat.dto.ChatMessagePayload;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
public class ChatEventPublisher {

    private final KafkaTemplate<String, EventEnvelope<?>> kafkaTemplate;

    public ChatEventPublisher(KafkaTemplate<String, EventEnvelope<?>> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void publishMessageEvent(String fromUserId, String toUserId, String messageId) {
        ChatMessagePayload payload = new ChatMessagePayload(
                messageId,
                fromUserId,
                toUserId,
                Instant.now()
        );

        EventEnvelope<ChatMessagePayload> envelope = new EventEnvelope<>(
                UUID.randomUUID().toString(),
                EventType.CHAT_MESSAGE_SENT.name(),
                "chat-service",
                Instant.now(),
                payload
        );

        kafkaTemplate.send("chat-events", envelope);
    }
}
