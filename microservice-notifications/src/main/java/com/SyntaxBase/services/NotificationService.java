package com.SyntaxBase.services;

import com.SyntaxBase.domain.Notification;
import com.SyntaxBase.dto.ReplyCreatedEventDTO;

import java.util.List;

public interface NotificationService {
    List<Notification> getNotificationsForUser(String userId);
    void markNotificationAsRead(Long id);
    void createNotificationFromReply(ReplyCreatedEventDTO event);
}
