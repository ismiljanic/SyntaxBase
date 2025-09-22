package microservice_chat.services;

import microservice_chat.dto.ChatMessageDTO;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class KafkaChatConsumer {

    private final SimpMessagingTemplate messagingTemplate;

    public KafkaChatConsumer(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @KafkaListener(topics = "chat.messages", groupId = "chat-service-group")
    public void listen(ConsumerRecord<String, ChatMessageDTO> record) {
        ChatMessageDTO msg = record.value();
        System.out.println("Sending message to user: " + msg.getToUserId());
        messagingTemplate.convertAndSendToUser(msg.getToUserId(), "/queue/messages", msg);
    }
}