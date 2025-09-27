package programming.tutorial.dao;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import programming.tutorial.domain.Badge;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class BadgeRepositoryTest {

    @Autowired
    private BadgeRepository badgeRepository;

    private Badge badge1;
    private Badge badge2;

    @BeforeEach
    void setup() {
        badge1 = new Badge();
        badge1.setName("Course Completer");
        badge1.setType("COURSE_COMPLETION");
        badge1.setDescription("Awarded for completing a course");
        badge1.setCriteria("1");
        badge1.setPermanent(true);

        badge2 = new Badge();
        badge2.setName("Forum Contributor");
        badge2.setType("FORUM_ACTIVITY");
        badge2.setDescription("Awarded for posting in forums");
        badge2.setCriteria("5");
        badge2.setPermanent(true);

        badgeRepository.save(badge1);
        badgeRepository.save(badge2);
    }

    @Test
    void testFindByTypeAndName() {
        Optional<Badge> found = badgeRepository.findByTypeAndName("COURSE_COMPLETION", "Course Completer");
        assertThat(found).isPresent();
        assertThat(found.get().getName()).isEqualTo("Course Completer");

        Optional<Badge> notFound = badgeRepository.findByTypeAndName("COURSE_COMPLETION", "Nonexistent");
        assertThat(notFound).isNotPresent();
    }

    @Test
    void testFindAllByType() {
        List<Badge> courseBadges = badgeRepository.findAllByType("COURSE_COMPLETION");
        assertThat(courseBadges).hasSize(1).contains(badge1);

        List<Badge> forumBadges = badgeRepository.findAllByType("FORUM_ACTIVITY");
        assertThat(forumBadges).hasSize(1).contains(badge2);
    }
}