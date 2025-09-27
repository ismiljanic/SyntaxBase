package com.SyntaxBase.services.impl;

import com.SyntaxBase.dao.NotificationRepository;
import com.SyntaxBase.domain.Notification;
import com.SyntaxBase.dto.NotificationDTO;
import com.SyntaxBase.dto.ReplyCreatedEventDTO;
import com.SyntaxBase.services.EmailService;
import com.SyntaxBase.services.NotificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import shared.dto.ChatMessageDTO;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationServiceImpl implements NotificationService {
    private static final Logger logger = LoggerFactory.getLogger(NotificationServiceImpl.class);

    @Autowired
    private NotificationRepository notificationRepository;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    @Autowired
    private EmailService emailService;

    @Override
    public List<NotificationDTO> getNotificationsForUser(String userId, boolean unreadOnly) {
        List<Notification> notifications = unreadOnly
                ? notificationRepository.findByUserIdAndIsReadFalse(userId)
                : notificationRepository.findByUserId(userId);

        return notifications.stream()
                .map(NotificationDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public void markNotificationAsRead(Long id) {
        Notification n = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        n.setRead(true);
        notificationRepository.save(n);
    }

    @Override
    public void createNotificationFromReply(ReplyCreatedEventDTO event) {
        logger.info("createNotificationFromReply called with event: {}", event);

        Notification n = new Notification();
        n.setUserId(event.getParentUserId());
        n.setPostId(Math.toIntExact(event.getPostId()));
        n.setReplyId(Math.toIntExact(event.getReplyId()));
        n.setMessage(event.getReplyContent());
        n.setCreatedAt(new Date());
        n.setRead(false);
        Notification saved = notificationRepository.save(n);

        NotificationDTO dto = NotificationDTO.fromEntity(saved);
        messagingTemplate.convertAndSend("/topic/notifications/" + dto.getUserId(), dto);

        logger.info("Parent user email: " + event.getParentUserEmail());
        logger.info("Replier username: " + event.getReplierUserEmail());
        if (event.getParentUserEmail() != null && event.getReplierUserEmail() != null) {
            logger.info("Sending email to: {}, from user: {}", event.getParentUserEmail(), event.getReplierUserEmail());
            emailService.sendReplyNotificationEmail(
                    event.getParentUserEmail(),
                    event.getReplierUserEmail(),
                    event.getReplyContent(),
                    event.getPostId()
            );
        } else {
            logger.warn("Email or replier username is null, skipping email send.");
        }
    }

    @Override
    public void createNotificationFromChatMessage(ChatMessageDTO event) {
        if (event.getToUserId() == null) {
            logger.warn("Skipping chat message notification: missing recipient user ID");
            return;
        }

        Notification n = new Notification();
        n.setUserId(event.getToUserId());
        n.setChatMessageId(event.getId());
        n.setMessage(event.getContent());
        n.setCreatedAt(Date.from(event.getSentAt()));
        n.setRead(false);

        Notification saved = notificationRepository.save(n);

        NotificationDTO dto = NotificationDTO.fromEntity(saved);
        messagingTemplate.convertAndSend("/topic/notifications/" + dto.getUserId(), dto);

        logger.info("Created chat notification for user {} from message {}", event.getToUserId(), event.getId());
    }
}