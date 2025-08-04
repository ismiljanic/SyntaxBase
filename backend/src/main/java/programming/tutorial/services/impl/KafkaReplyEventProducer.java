package programming.tutorial.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import programming.tutorial.dto.ReplyCreatedEventDTO;
import programming.tutorial.services.ReplyEventProducer;

@Service
public class KafkaReplyEventProducer implements ReplyEventProducer {

    private static final String TOPIC = "forum.reply.created";

    @Autowired
    private KafkaTemplate<String, ReplyCreatedEventDTO> kafkaTemplate;

    @Override
    public void publishReplyCreatedEvent(ReplyCreatedEventDTO event) {
        kafkaTemplate.send(TOPIC, event);
    }
}
