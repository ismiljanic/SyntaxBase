package microservice_chat.services;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import shared.dto.ChatMessageDTO;

@Service
public class KafkaChatConsumer {

    private static final Logger logger = LoggerFactory.getLogger(KafkaChatConsumer.class);
    private final SimpMessagingTemplate messagingTemplate;

    public KafkaChatConsumer(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @KafkaListener(topics = "chat.messages", groupId = "chat-service-group")
    public void listen(ConsumerRecord<String, ChatMessageDTO> record) {
        ChatMessageDTO msg = record.value();
        logger.info("Kafka received message: {} -> {} : {}", msg.getFromUserId(), msg.getToUserId(), msg.getContent());

        String topic = "/topic/chat." +
                (msg.getFromUserId().compareTo(msg.getToUserId()) < 0
                        ? msg.getFromUserId() + "." + msg.getToUserId()
                        : msg.getToUserId() + "." + msg.getFromUserId());

        logger.info("Publishing to topic: {}", topic);
        messagingTemplate.convertAndSend(topic, msg);
    }


    private String getChatTopicId(String user1, String user2) {
        return user1.compareTo(user2) < 0 ? user1 + "." + user2 : user2 + "." + user1;
    }
}