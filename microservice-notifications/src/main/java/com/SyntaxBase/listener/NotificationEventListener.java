package com.SyntaxBase.listener;

import com.SyntaxBase.dto.ReplyCreatedEventDTO;
import com.SyntaxBase.services.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class NotificationEventListener {

    @Autowired
    private NotificationService notificationService;

    @KafkaListener(
            topics = "forum.reply.created",
            groupId = "notifications-group",
            containerFactory = "kafkaListenerContainerFactory"
    )
    public void handleReplyCreated(ReplyCreatedEventDTO event) {
        System.out.println(">>> Received event from Kafka: " + event);

        if (!event.getReplyUserId().equals(event.getParentUserId())) {
            System.out.println(">>> Creating notification for user: " + event.getParentUserId());
            notificationService.createNotificationFromReply(event);
        } else {
            System.out.println(">>> Ignoring self-reply");
        }
    }
}
