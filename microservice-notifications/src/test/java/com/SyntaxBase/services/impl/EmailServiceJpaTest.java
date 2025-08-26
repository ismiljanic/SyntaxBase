package com.SyntaxBase.services.impl;

import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mail.javamail.JavaMailSender;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

class EmailServiceJpaTest {

    private JavaMailSender mailSender;
    private EmailServiceJpa emailService;

    @BeforeEach
    void setUp() {
        mailSender = mock(JavaMailSender.class);
        emailService = new EmailServiceJpa(mailSender);
    }

    @Test
    void sendReplyNotificationEmail_shouldSendEmailSuccessfully() throws Exception {
        MimeMessage mimeMessage = mock(MimeMessage.class);
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);

        emailService.sendReplyNotificationEmail(
                "recipient@example.com",
                "john_doe",
                "This is a reply content",
                123L
        );

        verify(mailSender, times(1)).send(mimeMessage);
    }

    @Test
    void sendReplyNotificationEmail_shouldThrowExceptionForNullRecipient() {
        assertThrows(IllegalArgumentException.class, () ->
                emailService.sendReplyNotificationEmail(
                        null,
                        "john_doe",
                        "Reply",
                        1L
                )
        );
    }

    @Test
    void sendReplyNotificationEmail_shouldThrowExceptionForBlankRecipient() {
        assertThrows(IllegalArgumentException.class, () ->
                emailService.sendReplyNotificationEmail(
                        "  ",
                        "john_doe",
                        "Reply",
                        1L
                )
        );
    }

    @Test
    void sendReplyNotificationEmail_shouldThrowExceptionForNullReplier() {
        assertThrows(IllegalArgumentException.class, () ->
                emailService.sendReplyNotificationEmail(
                        "recipient@example.com",
                        null,
                        "Reply",
                        1L
                )
        );
    }

    @Test
    void sendReplyNotificationEmail_shouldThrowExceptionForNullReplyContent() {
        assertThrows(IllegalArgumentException.class, () ->
                emailService.sendReplyNotificationEmail(
                        "recipient@example.com",
                        "john_doe",
                        null,
                        1L
                )
        );
    }

    @Test
    void sendReplyNotificationEmail_shouldThrowExceptionForNullPostId() {
        assertThrows(IllegalArgumentException.class, () ->
                emailService.sendReplyNotificationEmail(
                        "recipient@example.com",
                        "john_doe",
                        "Reply",
                        null
                )
        );
    }

    @Test
    void sendReplyNotificationEmail_shouldWrapExceptionFromMailSender() throws Exception {
        MimeMessage mimeMessage = mock(MimeMessage.class);
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
        doThrow(new RuntimeException("SMTP failure")).when(mailSender).send(mimeMessage);

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                emailService.sendReplyNotificationEmail(
                        "recipient@example.com",
                        "john_doe",
                        "Reply content",
                        1L
                )
        );
        assertThat(ex.getMessage()).contains("Failed to send notification email");
        assertThat(ex.getCause().getMessage()).isEqualTo("SMTP failure");
    }
}