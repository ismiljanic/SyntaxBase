package programming.tutorial.dao;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.test.context.ActiveProfiles;
import programming.tutorial.domain.Course;
import programming.tutorial.domain.Lesson;
import programming.tutorial.domain.User;
import programming.tutorial.domain.Tier;

import jakarta.persistence.EntityManager;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = Replace.ANY)
@ActiveProfiles("test")
class LessonRepositoryTest {

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private EntityManager entityManager;

    private User user;
    private Course course;

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

        course = new Course();
        course.setCourseName("Java 101");
        course.setCategory("Programming");
        entityManager.persist(course);

        for (int i = 1; i <= 3; i++) {
            Lesson l = new Lesson();
            l.setCourse(course);
            l.setUser(user);
            l.setLessonNumber(i);
            l.setLessonName("Lesson " + i);
            l.setCompleted(i == 1);
            l.setContent("Some content");
            entityManager.persist(l);
        }
        entityManager.flush();
    }

    @Test
    void testFindNextLesson() {
        Optional<Lesson> result = lessonRepository.findNextLesson(course.getId(), 1, user.getId());
        assertThat(result).isPresent();
        assertThat(result.get().getLessonNumber()).isEqualTo(2);
    }

    @Test
    void testFindPreviousLesson() {
        Optional<Lesson> result = lessonRepository.findPreviousLesson(course.getId(), 3, user.getId());
        assertThat(result).isPresent();
        assertThat(result.get().getLessonNumber()).isEqualTo(2);
    }

    @Test
    void testGetCourseLength() {
        Long length = lessonRepository.getCourseLength(course.getId());
        assertThat(length).isEqualTo(3);
    }

    @Test
    void testCountCompletedLessonsForUserAndCourse() {
        Long completed = lessonRepository.countCompletedLessonsForUserAndCourse(course.getId(), user.getId());
        assertThat(completed).isEqualTo(1);
    }

    @Test
    void testFindByCourse_IdOrderByLessonNumberAsc() {
        List<Lesson> lessons = lessonRepository.findByCourse_IdOrderByLessonNumberAsc(course.getId());
        assertThat(lessons).hasSize(3);
        assertThat(lessons.get(0).getLessonNumber()).isEqualTo(1);
    }

    @Test
    void testFindFirstByCourse_IdOrderByIdAsc() {
        Optional<Lesson> lesson = lessonRepository.findFirstByCourse_IdOrderByIdAsc(course.getId());
        assertThat(lesson).isPresent();
    }

    @Test
    void testFindByIdAndCourse_Id() {
        Lesson first = lessonRepository.findByCourse_IdOrderByLessonNumberAsc(course.getId()).get(0);
        Optional<Lesson> found = lessonRepository.findByIdAndCourse_Id(first.getId(), course.getId());
        assertThat(found).isPresent();
    }

    @Test
    void testFindByCourseIdAndLessonNumberAndUserId() {
        Optional<Lesson> lesson = lessonRepository.findByCourseIdAndLessonNumberAndUserId(course.getId(), 1, user.getId());
        assertThat(lesson).isPresent();
        assertThat(lesson.get().getLessonName()).isEqualTo("Lesson 1");
    }

    @Test
    void testFindFirstByCourseIdOrderByLessonNumberAsc() {
        Optional<Lesson> lesson = lessonRepository.findFirstByCourseIdOrderByLessonNumberAsc(course.getId());
        assertThat(lesson).isPresent();
        assertThat(lesson.get().getLessonNumber()).isEqualTo(1);
    }

    @Test
    void testFindByCourseIdAndLessonNumber() {
        Optional<Lesson> lesson = lessonRepository.findByCourseIdAndLessonNumber(course.getId(), 2);
        assertThat(lesson).isPresent();
        assertThat(lesson.get().getLessonName()).isEqualTo("Lesson 2");
    }

    @Test
    void testDeleteByUserIdAndCourseId() {
        lessonRepository.deleteByUserIdAndCourseId(user.getId(), course.getId());
        List<Lesson> lessons = lessonRepository.findByCourse_IdOrderByLessonNumberAsc(course.getId());
        assertThat(lessons).isEmpty();
    }
}