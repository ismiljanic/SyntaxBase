package programming.tutorial.dao;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;
import programming.tutorial.domain.Notification;
import programming.tutorial.domain.Tier;
import programming.tutorial.domain.User;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
@ActiveProfiles("test")
class NotificationRepositoryTest {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private TestEntityManager entityManager;

    private User user;

    @BeforeEach
    void setup() {
        user = new User();
        user.setAuth0UserId("auth0|user1");
        user.setName("John");
        user.setSurname("Doe");
        user.setPassword("pwd");
        user.setUsername("jdoe");
        user.setDateCreated(LocalDateTime.now());
        user.setActive(true);
        user.setTier(Tier.FREE);
        entityManager.persist(user);

        Notification n1 = new Notification();
        n1.setUserId(user.getAuth0UserId());
        n1.setMessage("Welcome!");
        n1.setCreatedAt(new Date(1970, 1, 1));
        entityManager.persist(n1);

        Notification n2 = new Notification();
        n2.setUserId(user.getAuth0UserId());
        n2.setMessage("Your course starts soon.");
        n1.setCreatedAt(new Date(1970, 1, 1));
        entityManager.persist(n2);

        entityManager.flush();
    }

    @Test
    void testFindByUserId_returnsAllNotificationsForUser() {
        List<Notification> notifications =
                notificationRepository.findByUserId(user.getAuth0UserId());

        assertThat(notifications).hasSize(2);
        assertThat(notifications)
                .extracting(Notification::getMessage)
                .containsExactlyInAnyOrder("Welcome!", "Your course starts soon.");
    }

    @Test
    void testFindByUserId_whenNoNotifications_returnsEmptyList() {
        List<Notification> notifications =
                notificationRepository.findByUserId("non-existing");

        assertThat(notifications).isEmpty();
    }
}