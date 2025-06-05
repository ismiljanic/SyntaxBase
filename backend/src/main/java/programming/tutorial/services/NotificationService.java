package programming.tutorial.services;

import programming.tutorial.domain.Notification;
import programming.tutorial.domain.Post;
import programming.tutorial.dto.NotificationDTO;

import java.util.List;


public interface NotificationService {
    Notification markAsRead(Long id);

    void createReplyNotification(Post parentPost, Post reply);

    List<NotificationDTO> getNotificationsForUser(String userId);
}