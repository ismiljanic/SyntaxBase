package microservice_chat.services;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import shared.dto.ChatMessageDTO;

import static org.mockito.Mockito.*;

class KafkaChatConsumerTest {

    @Test
    void testListenPublishesToCorrectTopic() {
        SimpMessagingTemplate messagingTemplate = mock(SimpMessagingTemplate.class);
        KafkaChatConsumer consumer = new KafkaChatConsumer(messagingTemplate);

        ChatMessageDTO msg = new ChatMessageDTO();
        msg.setFromUserId("userA");
        msg.setToUserId("userB");
        msg.setContent("Hello");

        ConsumerRecord<String, ChatMessageDTO> record = new ConsumerRecord<>("chat.messages", 0, 0L, "key", msg);

        consumer.listen(record);

        String expectedTopic = "/topic/chat.userA.userB";
        verify(messagingTemplate, times(1)).convertAndSend(expectedTopic, msg);
    }
}