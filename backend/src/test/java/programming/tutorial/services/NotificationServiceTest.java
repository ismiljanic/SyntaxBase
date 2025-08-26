package programming.tutorial.services;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import programming.tutorial.dao.NotificationRepository;
import programming.tutorial.dao.UserRepository;
import programming.tutorial.domain.Notification;
import programming.tutorial.domain.Post;
import programming.tutorial.domain.User;
import programming.tutorial.dto.NotificationDTO;
import programming.tutorial.services.impl.NotificationServiceJpa;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class NotificationServiceTest {
    @Mock
    private NotificationRepository notificationRepository;
    @Mock
    private UserRepository userRepository;
    @InjectMocks
    private NotificationServiceJpa notificationServiceJpa;

    @Test
    void markAsRead_shouldThrowIfNotFound() {
        when(notificationRepository.findById(99L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> notificationServiceJpa.markAsRead(99L));

        assertEquals("Notification not found", ex.getMessage());
        verify(notificationRepository, never()).save(any());
    }

    @Test
    void markAsRead_shouldMarkNotificationAsRead() {
        Notification notification = new Notification();
        notification.setId(1);
        notification.setRead(false);

        when(notificationRepository.findById(1L)).thenReturn(Optional.of(notification));
        when(notificationRepository.save(any(Notification.class))).thenAnswer(i -> i.getArgument(0));

        Notification result = notificationServiceJpa.markAsRead(1L);

        assertTrue(result.isRead(), "Notification should be marked as read");
        verify(notificationRepository).save(notification);
    }

    @Test
    void createReplyNotification_shouldNotSaveWhenUserRepliesToOwnPost() {
        Post parentPost = new Post();
        parentPost.setId(1);
        parentPost.setUserId("sameUser");

        Post reply = new Post();
        reply.setId(2);
        reply.setUserId("sameUser");

        User replyingUser = new User();
        replyingUser.setAuth0UserId("sameUser");
        replyingUser.setUsername("selfUser");

        notificationServiceJpa.createReplyNotification(parentPost, reply, replyingUser);

        verify(notificationRepository, never()).save(any());
    }

    @Test
    void createReplyNotification_shouldSaveNotificationForDifferentUsers() {
        Post parentPost = new Post();
        parentPost.setId(1);
        parentPost.setUserId("parent-123");

        Post reply = new Post();
        reply.setId(2);
        reply.setUserId("replier-456");
        reply.setContent("This is a reply");

        User parentUser = new User();
        parentUser.setAuth0UserId("parent-123");
        parentUser.setUsername("parentUser");

        User replyingUser = new User();
        replyingUser.setAuth0UserId("replier-456");
        replyingUser.setUsername("replyingUser");

        when(userRepository.findByAuth0UserId("parent-123"))
                .thenReturn(Optional.of(parentUser));

        notificationServiceJpa.createReplyNotification(parentPost, reply, replyingUser);

        verify(notificationRepository).save(argThat(notification ->
                notification.getUserId().equals("parent-123")
                        && notification.getPostId().equals(parentPost.getId())
                        && notification.getReplyId().equals(reply.getId())
                        && notification.getMessage().equals("This is a reply")
                        && !notification.isRead()
                        && notification.getReplierUserEmail().equals("replyingUser")
                        && notification.getParentUserEmail().equals("parentUser")
        ));
    }

    @Test
    void getNotificationsForUser_shouldFallbackToUnknownUserIfNotFound() {
        Notification notification = new Notification();
        notification.setId(20);
        notification.setUserId("ghost-user");
        notification.setPostId(1);
        notification.setReplyId(2);
        notification.setMessage("Some reply");
        notification.setRead(false);
        notification.setCreatedAt(new Date());


        when(notificationRepository.findByUserId("ghost-user"))
                .thenReturn(List.of(notification));

        when(userRepository.findByAuth0UserId("ghost-user"))
                .thenReturn(Optional.empty());

        List<NotificationDTO> result = notificationServiceJpa.getNotificationsForUser("ghost-user");

        assertEquals(1, result.size());
        assertEquals("Unknown User", result.get(0).getUsername());
    }

    @Test
    void getNotificationsForUser_shouldReturnMappedDTOs() {
        Notification notification = new Notification();
        notification.setId(10);
        notification.setUserId("user-123");
        notification.setPostId(1);
        notification.setReplyId(2);
        notification.setMessage("Test reply");
        notification.setRead(false);
        notification.setCreatedAt(new Date());
        notification.setReplierUserEmail("replyingUser");
        notification.setParentUserEmail("parentUser");

        when(notificationRepository.findByUserId("user-123"))
                .thenReturn(List.of(notification));

        User user = new User();
        user.setAuth0UserId("user-123");
        user.setUsername("testUser");
        when(userRepository.findByAuth0UserId("user-123"))
                .thenReturn(Optional.of(user));

        List<NotificationDTO> result = notificationServiceJpa.getNotificationsForUser("user-123");

        assertEquals(1, result.size());
        NotificationDTO dto = result.get(0);

        assertEquals(Long.valueOf(notification.getId()), dto.getId());
        assertEquals("testUser", dto.getUsername());
        assertEquals("replyingUser", dto.getReplierUsername());
        assertEquals("parentUser", dto.getParentUserEmail());
    }
}
