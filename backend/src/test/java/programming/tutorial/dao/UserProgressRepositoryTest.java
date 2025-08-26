package programming.tutorial.dao;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;
import programming.tutorial.domain.Course;
import programming.tutorial.domain.Lesson;
import programming.tutorial.domain.User;
import programming.tutorial.domain.UserProgress;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = Replace.ANY)
@ActiveProfiles("test")
class UserProgressRepositoryTest {

    @Autowired
    private UserProgressRepository userProgressRepository;

    @Autowired
    private TestEntityManager entityManager;

    private User user;
    private Course course;
    private UserProgress progress;

    @BeforeEach
    void setup() {
        user = new User();
        user.setAuth0UserId("auth0|123");
        user.setName("John");
        user.setSurname("Doe");
        user.setPassword("password");
        user.setUsername("johndoe");
        user.setDateCreated(LocalDateTime.now());
        user.setActive(true);
        entityManager.persist(user);

        course = new Course();
        course.setCourseName("Java Basics");
        entityManager.persist(course);

        Lesson l = new Lesson();
        l.setCourse(course);
        l.setUser(user);
        l.setLessonNumber(1);
        l.setLessonName("Lesson " + 1);
        l.setCompleted(true);
        l.setContent("Some content");
        entityManager.persist(l);

        progress = new UserProgress();
        progress.setUser(user);
        progress.setCourse(course);
        progress.setCurrentLesson(l);
        entityManager.persist(progress);

        entityManager.flush();
    }

    @Test
    void testFindByUser_Auth0UserIdAndCourse_Id_returnsProgress() {
        Optional<UserProgress> optionalProgress =
                userProgressRepository.findByUser_Auth0UserIdAndCourse_Id("auth0|123", course.getId());
        assertThat(optionalProgress).isPresent();
        assertThat(optionalProgress.get().getCurrentLesson().getLessonNumber()).isEqualTo(1);
    }

    @Test
    void testFindByUser_Auth0UserIdAndCourse_Id_returnsEmptyForNonexistent() {
        Optional<UserProgress> optionalProgress =
                userProgressRepository.findByUser_Auth0UserIdAndCourse_Id("auth0|nonexistent", 999);
        assertThat(optionalProgress).isEmpty();
    }

    @Test
    void testDeleteByUserIdAndCourseId_removesProgress() {
        userProgressRepository.deleteByUserIdAndCourseId(user.getId(), course.getId());
        Optional<UserProgress> optionalProgress =
                userProgressRepository.findByUser_Auth0UserIdAndCourse_Id("auth0|123", course.getId());
        assertThat(optionalProgress).isEmpty();
    }
}