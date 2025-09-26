package com.SyntaxBase.services;

import com.SyntaxBase.domain.Notification;
import com.SyntaxBase.dto.NotificationDTO;
import com.SyntaxBase.dto.ReplyCreatedEventDTO;
import shared.dto.ChatMessageDTO;

import java.util.List;

public interface NotificationService {
    List<NotificationDTO> getNotificationsForUser(String userId, boolean unreadOnly);
    void markNotificationAsRead(Long id);
    void createNotificationFromReply(ReplyCreatedEventDTO event);
    void createNotificationFromChatMessage(ChatMessageDTO event);
}