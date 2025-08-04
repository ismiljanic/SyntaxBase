package com.SyntaxBase.services.impl;

import com.SyntaxBase.services.EmailService;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceJpa implements EmailService {

    private final JavaMailSender emailSender;

    @Value("http://localhost:3000/login")
    private String frontendUrl;

    public EmailServiceJpa(JavaMailSender emailSender) {
        this.emailSender = emailSender;
    }

    @Override
    public void sendReplyNotificationEmail(String recipientEmail, String replierUsername, String replyContent, Long postId) {
        if (recipientEmail == null || recipientEmail.isBlank() ||
                replierUsername == null || replyContent == null || postId == null) {
            throw new IllegalArgumentException("Invalid email notification parameters.");
        }
        try {
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            String frontendUrl = "http://localhost:3000/login";
            String discussionLink = frontendUrl + "/post/" + postId;

            String subject = "You've received a reply on SyntaxBase";
            String htmlContent = String.format("""
                        <html>
                          <body style="font-family:Arial, sans-serif; color:#333;">
                            <h2 style="color:#4CAF50;">You've got a new reply!</h2>
                            <p><strong>%s</strong> replied to your post:</p>
                            <blockquote style="margin:10px 0; padding:10px; background-color:#f9f9f9; border-left:4px solid #4CAF50;">
                              %s
                            </blockquote>
                            <p>
                              <a href="%s" style="display:inline-block; padding:10px 20px; color:white; background-color:#4CAF50; text-decoration:none; border-radius:5px;">
                                View the Discussion
                              </a>
                            </p>
                            <hr>
                            <p style="font-size:12px; color:#888;">This is an automated notification from SyntaxBase.</p>
                          </body>
                        </html>
                    """, escapeHtml(replierUsername), escapeHtml(shorten(replyContent, 500)), discussionLink);

            helper.setTo(recipientEmail);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            emailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send notification email", e);
        }
    }

    private String shorten(String content, int maxLength) {
        return content.length() > maxLength ? content.substring(0, maxLength) + "..." : content;
    }

    private String escapeHtml(String input) {
        return input.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;");
    }
}
