package com.SyntaxBase.listener;

import com.SyntaxBase.dto.ReplyCreatedEventDTO;
import com.SyntaxBase.services.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import shared.dto.ChatMessageDTO;

@Component
public class NotificationEventListener {

    @Autowired
    private NotificationService notificationService;

    @KafkaListener(
            topics = "forum.reply.created",
            groupId = "forum-notifications-group",
            containerFactory = "forumKafkaListenerContainerFactory"
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

    @KafkaListener(
            topics = "chat.messages",
            groupId = "chat-notifications-group",
            containerFactory = "chatKafkaListenerContainerFactory"
    )
    public void handleChatMessageCreated(ChatMessageDTO event) {
        if (event.getFromUserId() == null || event.getToUserId() == null) {
            System.err.println("Skipping invalid chat message: missing user IDs. Event=" + event);
            return;
        }

        if (!event.getFromUserId().equals(event.getToUserId())) {
            notificationService.createNotificationFromChatMessage(event);
        }
    }

}