package com.SyntaxBase.services.impl;

import com.SyntaxBase.dao.NotificationRepository;
import com.SyntaxBase.domain.Notification;
import com.SyntaxBase.dto.ReplyCreatedEventDTO;
import com.SyntaxBase.services.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Override
    public List<Notification> getNotificationsForUser(String userId) {
        return notificationRepository.findByUserId(userId);
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
        Notification n = new Notification();
        n.setUserId(event.getParentUserId());
        n.setPostId(Math.toIntExact(event.getPostId()));
        n.setReplyId(Math.toIntExact(event.getReplyId()));
        n.setMessage(event.getReplyContent());
        n.setCreatedAt(new Date());
        n.setRead(false);
        notificationRepository.save(n);
    }
}
