package com.SyntaxBase.services;

import com.SyntaxBase.domain.Notification;
import com.SyntaxBase.dto.NotificationDTO;
import com.SyntaxBase.dto.ReplyCreatedEventDTO;

import java.util.List;

public interface NotificationService {
    List<NotificationDTO> getNotificationsForUser(String userId, boolean unreadOnly);
    void markNotificationAsRead(Long id);
    void createNotificationFromReply(ReplyCreatedEventDTO event);
}