package programming.tutorial.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import programming.tutorial.dao.NotificationRepository;
import programming.tutorial.dao.UserRepository;
import programming.tutorial.domain.Notification;
import programming.tutorial.domain.Post;
import programming.tutorial.domain.User;
import programming.tutorial.dto.NotificationDTO;
import programming.tutorial.services.NotificationService;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class NotificationServiceJpa implements NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;
    @Autowired
    private UserRepository userRepository;

    @Override
    public Notification markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        notification.setRead(true);
        return notificationRepository.save(notification);
    }

    @Override
    public void createReplyNotification(Post parentPost, Post reply, User replyingUser) {
        if (!parentPost.getUserId().equals(reply.getUserId())) {
            User parentUser = userRepository.findByAuth0UserId(parentPost.getUserId())
                    .orElseThrow(() -> new RuntimeException("Parent user not found"));

            Notification notification = new Notification();
            notification.setUserId(parentPost.getUserId());
            notification.setPostId(parentPost.getId());
            notification.setReplyId(reply.getId());
            notification.setMessage(reply.getContent());
            notification.setRead(false);
            notification.setCreatedAt(new Date());

            notification.setReplierUserEmail(replyingUser.getUsername());
            notification.setParentUserEmail(parentUser.getUsername());

            notificationRepository.save(notification);
        }
    }

    @Override
    public List<NotificationDTO> getNotificationsForUser(String userId) {
        return notificationRepository.findByUserId(userId).stream().map(notification -> {
            String username = userRepository.findByAuth0UserId(notification.getUserId())
                    .map(u -> u.getUsername()).orElse("Unknown User");
            return new NotificationDTO(notification.getId(), notification.getUserId(), notification.getPostId(),
                    notification.getReplyId(), notification.getMessage(),
                    notification.isRead(), notification.getCreatedAt(), username, notification.getReplierUserEmail(), notification.getParentUserEmail());
        }).collect(Collectors.toList());
    }
}
