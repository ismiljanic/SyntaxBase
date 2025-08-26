package com.SyntaxBase.services.impl;

import com.SyntaxBase.dao.NotificationRepository;
import com.SyntaxBase.domain.Notification;
import com.SyntaxBase.dto.NotificationDTO;
import com.SyntaxBase.dto.ReplyCreatedEventDTO;
import com.SyntaxBase.services.EmailService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotificationServiceImplTest {

    @Mock
    private NotificationRepository notificationRepository;

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private NotificationServiceImpl notificationService;

    @Test
    void getNotificationsForUser_returnsAllNotifications() {
        Notification n1 = new Notification();
        n1.setUserId("user1");
        n1.setMessage("Hello");

        Notification n2 = new Notification();
        n2.setUserId("user1");
        n2.setMessage("World");

        when(notificationRepository.findByUserId("user1"))
                .thenReturn(Arrays.asList(n1, n2));

        List<NotificationDTO> dtos = notificationService.getNotificationsForUser("user1", false);

        assertThat(dtos).hasSize(2);
        assertThat(dtos).extracting("message").containsExactlyInAnyOrder("Hello", "World");
    }

    @Test
    void getNotificationsForUser_returnsOnlyUnreadNotifications() {
        Notification n1 = new Notification();
        n1.setUserId("user1");
        n1.setMessage("Unread");
        n1.setRead(false);

        when(notificationRepository.findByUserIdAndIsReadFalse("user1"))
                .thenReturn(List.of(n1));

        List<NotificationDTO> dtos = notificationService.getNotificationsForUser("user1", true);

        assertThat(dtos).hasSize(1);
        assertThat(dtos.get(0).getMessage()).isEqualTo("Unread");
    }

    @Test
    void markNotificationAsRead_setsReadFlag() {
        Notification n = new Notification();
        n.setId(1);
        n.setRead(false);

        when(notificationRepository.findById(1L)).thenReturn(Optional.of(n));
        when(notificationRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        notificationService.markNotificationAsRead(1L);

        assertTrue(n.isRead());
        verify(notificationRepository, times(1)).save(n);
    }

    @Test
    void markNotificationAsRead_throwsExceptionWhenNotFound() {
        when(notificationRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                notificationService.markNotificationAsRead(1L));

        assertThat(ex.getMessage()).isEqualTo("Notification not found");
    }

    @Test
    void createNotificationFromReply_createsNotificationAndSendsEmailAndMessage() {
        ReplyCreatedEventDTO event = new ReplyCreatedEventDTO();
        event.setParentUserId("parent1");
        event.setPostId(100L);
        event.setReplyId(200L);
        event.setReplyContent("This is a reply");
        event.setParentUserEmail("parent@example.com");
        event.setReplierUserEmail("replier@example.com");

        Notification savedNotification = new Notification();
        savedNotification.setId(1);
        savedNotification.setUserId("parent1");
        savedNotification.setMessage("This is a reply");

        when(notificationRepository.save(any())).thenReturn(savedNotification);

        notificationService.createNotificationFromReply(event);

        ArgumentCaptor<Notification> notificationCaptor = ArgumentCaptor.forClass(Notification.class);
        verify(notificationRepository).save(notificationCaptor.capture());
        Notification captured = notificationCaptor.getValue();
        assertThat(captured.getUserId()).isEqualTo("parent1");
        assertThat(captured.getMessage()).isEqualTo("This is a reply");

        verify(messagingTemplate).convertAndSend(eq("/topic/notifications/parent1"), any(NotificationDTO.class));

        verify(emailService).sendReplyNotificationEmail(
                eq("parent@example.com"),
                eq("replier@example.com"),
                eq("This is a reply"),
                eq(100L)
        );
    }

    @Test
    void createNotificationFromReply_skipsEmailIfNull() {
        ReplyCreatedEventDTO event = new ReplyCreatedEventDTO();
        event.setParentUserId("parent1");
        event.setPostId(100L);
        event.setReplyId(200L);
        event.setReplyContent("This is a reply");
        event.setParentUserEmail(null);
        event.setReplierUserEmail("replier@example.com");

        when(notificationRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        notificationService.createNotificationFromReply(event);

        verify(emailService, never()).sendReplyNotificationEmail(anyString(), anyString(), anyString(), anyLong());
        verify(messagingTemplate).convertAndSend(eq("/topic/notifications/parent1"), any(NotificationDTO.class));
    }
}