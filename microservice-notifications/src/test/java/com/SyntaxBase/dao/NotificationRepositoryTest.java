package com.SyntaxBase.dao;

import com.SyntaxBase.domain.Notification;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

import java.util.Date;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
@ActiveProfiles("test")
class NotificationRepositoryTest {

    @Autowired
    private NotificationRepository notificationRepository;

    private Notification readNotification;
    private Notification unreadNotification;

    @Autowired
    private TestEntityManager entityManager;

    @BeforeEach
    void setUp() {
        notificationRepository.deleteAll();

        readNotification = new Notification();
        readNotification.setUserId("user123");
        readNotification.setMessage("Read message");
        readNotification.setRead(true);
        readNotification.setCreatedAt(new Date(1970, 1, 1));
        entityManager.persist(readNotification);
        entityManager.flush();

        unreadNotification = new Notification();
        unreadNotification.setUserId("user123");
        unreadNotification.setMessage("Unread message");
        unreadNotification.setRead(false);
        unreadNotification.setCreatedAt(new Date(1970, 1, 1));
        entityManager.persist(unreadNotification);
        entityManager.flush();
    }

    @Test
    void findByUserId_shouldReturnAllNotificationsForUser() {
        List<Notification> notifications = notificationRepository.findByUserId("user123");

        assertThat(notifications).hasSize(2);
        assertThat(notifications).extracting("message")
                .containsExactlyInAnyOrder("Read message", "Unread message");
    }

    @Test
    void findByUserIdAndIsReadFalse_shouldReturnOnlyUnreadNotifications() {
        List<Notification> notifications = notificationRepository.findByUserIdAndIsReadFalse("user123");

        assertThat(notifications).hasSize(1);
        assertThat(notifications.get(0).getMessage()).isEqualTo("Unread message");
    }

    @Test
    void findByUserId_shouldReturnEmptyListForNonExistingUser() {
        List<Notification> notifications = notificationRepository.findByUserId("nonexistent");
        assertThat(notifications).isEmpty();
    }
}