package programming.tutorial.dao;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;
import programming.tutorial.domain.Badge;
import programming.tutorial.domain.User;
import programming.tutorial.domain.UserBadge;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
@ActiveProfiles("test")
class UserBadgeRepositoryTest {

    @Autowired
    private UserBadgeRepository userBadgeRepository;

    @Autowired
    private BadgeRepository badgeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TestEntityManager entityManager;

    private User user1;
    private Badge badge1;
    private Badge badge2;

    @BeforeEach
    void setup() {
        user1 = new User();
        user1.setAuth0UserId("auth0|user1");
        user1.setName("John");
        user1.setSurname("Doe");
        user1.setPassword("pass");
        user1.setUsername("john");
        user1.setDateCreated(LocalDateTime.now());
        user1.setActive(true);
        entityManager.persist(user1);

        badge1 = new Badge();
        badge1.setName("First Badge");
        badge1.setType("COURSE_COMPLETION");
        badge1.setDescription("First badge description");
        badge1.setCriteria("1");
        badge1.setPermanent(true);

        badge2 = new Badge();
        badge2.setName("Second Badge");
        badge2.setType("FORUM_ACTIVITY");
        badge2.setDescription("Second badge description");
        badge2.setCriteria("5");
        badge2.setPermanent(true);

        badgeRepository.saveAll(List.of(badge1, badge2));
    }

    @Test
    void testExistsByUserAndBadge() {
        UserBadge userBadge = new UserBadge(user1, badge1);
        userBadgeRepository.save(userBadge);

        boolean exists = userBadgeRepository.existsByUserAndBadge(user1, badge1);
        boolean notExists = userBadgeRepository.existsByUserAndBadge(user1, badge2);

        assertThat(exists).isTrue();
        assertThat(notExists).isFalse();
    }

    @Test
    void testFindByUser() {
        UserBadge ub1 = new UserBadge(user1, badge1);
        UserBadge ub2 = new UserBadge(user1, badge2);
        userBadgeRepository.saveAll(List.of(ub1, ub2));

        List<UserBadge> badges = userBadgeRepository.findByUser(user1);

        assertThat(badges).hasSize(2).containsExactlyInAnyOrder(ub1, ub2);
    }
}