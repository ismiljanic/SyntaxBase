package com.SyntaxBase.services;

import org.springframework.stereotype.Service;

@Service
public interface EmailService {
    void sendReplyNotificationEmail(String recipientEmail, String replierUsername, String replyContent, Long postId);
}
