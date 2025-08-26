package programming.tutorial.dao;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import programming.tutorial.domain.*;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = Replace.ANY)
@ActiveProfiles("test")
class LessonFeedbackRepositoryTest {

    @Autowired
    private LessonFeedbackRepository lessonFeedbackRepository;

    @Autowired
    private TestEntityManager entityManager;

    private User user;
    private Course course;
    private Lesson lesson;
    private LessonFeedback feedback;

    @BeforeEach
    void setup() {
        user = new User();
        user.setAuth0UserId("auth0|abc");
        user.setName("John");
        user.setSurname("Doe");
        user.setPassword("secret");
        user.setUsername("johndoe");
        user.setDateCreated(LocalDateTime.now());
        user.setActive(true);
        user.setTier(Tier.FREE);
        entityManager.persist(user);

        course = new Course();
        course.setCourseName("Spring Boot 101");
        course.setCategory("Programming");
        entityManager.persist(course);

        lesson = new Lesson();
        lesson.setLessonName("Intro");
        lesson.setCourse(course);
        lesson.setUser(user);
        lesson.setContent("Some Content");
        entityManager.persist(lesson);

        feedback = new LessonFeedback();
        feedback.setLesson(lesson);
        feedback.setUser(user);
        feedback.setFeedback("Great intro!");
        entityManager.persist(feedback);

        entityManager.flush();
    }

    @Test
    void testFindByLessonAndUser_found() {
        Optional<LessonFeedback> result = lessonFeedbackRepository.findByLessonAndUser(lesson, user);
        assertThat(result).isPresent();
        assertThat(result.get().getFeedback()).isEqualTo("Great intro!");
    }

    @Test
    void testFindByLessonAndUser_notFound() {
        User otherUser = new User();
        otherUser.setAuth0UserId("auth0|other");
        otherUser.setName("Jane");
        otherUser.setSurname("Smith");
        otherUser.setPassword("pwd");
        otherUser.setUsername("janesmith");
        otherUser.setDateCreated(LocalDateTime.now());
        otherUser.setActive(true);
        otherUser.setTier(Tier.FREE);
        entityManager.persist(otherUser);

        Optional<LessonFeedback> result = lessonFeedbackRepository.findByLessonAndUser(lesson, otherUser);
        assertThat(result).isNotPresent();
    }

    @Test
    void testExistsByLessonIdAndUserAuth0UserId_true() {
        boolean exists = lessonFeedbackRepository.existsByLessonIdAndUserAuth0UserId(
                lesson.getId(),
                "auth0|abc"
        );
        assertThat(exists).isTrue();
    }

    @Test
    void testExistsByLessonIdAndUserAuth0UserId_false() {
        boolean exists = lessonFeedbackRepository.existsByLessonIdAndUserAuth0UserId(
                lesson.getId(),
                "auth0|nonexistent"
        );
        assertThat(exists).isFalse();
    }

    @Test
    @Transactional
    @Rollback
    void testDeleteByUserIdAndCourseId() {
        lessonFeedbackRepository.deleteByUserIdAndCourseId(user.getId(), course.getId());
        entityManager.flush();

        Optional<LessonFeedback> result = lessonFeedbackRepository.findByLessonAndUser(lesson, user);
        assertThat(result).isNotPresent();
    }

    @Test
    @Transactional
    @Rollback
    void testDeleteByUserIdAndCourseId_whenNothingExists_doesNotThrow() {
        lessonFeedbackRepository.deleteByUserIdAndCourseId(9999, 8888);
        entityManager.flush();

        Optional<LessonFeedback> result = lessonFeedbackRepository.findByLessonAndUser(lesson, user);
        assertThat(result).isPresent();
    }
}