package programming.tutorial.services;

import org.springframework.stereotype.Service;
import programming.tutorial.domain.Notification;
import programming.tutorial.domain.Post;
import programming.tutorial.domain.User;
import programming.tutorial.dto.NotificationDTO;

import java.util.List;

public interface NotificationService {
    Notification markAsRead(Long id);

    void createReplyNotification(Post parentPost, Post reply, User user);

    List<NotificationDTO> getNotificationsForUser(String userId);
}