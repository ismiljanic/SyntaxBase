package programming.tutorial.services;

import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import programming.tutorial.dao.CourseRepository;
import programming.tutorial.dao.LessonRepository;
import programming.tutorial.dao.UserProgressRepository;
import programming.tutorial.dao.UserRepository;
import programming.tutorial.domain.Course;
import programming.tutorial.domain.Lesson;
import programming.tutorial.domain.User;
import programming.tutorial.dto.LessonDTO;
import programming.tutorial.services.impl.LessonServiceJpa;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class LessonServiceTest {

    @Mock
    private LessonRepository lessonRepository;
    @Mock
    private UserProgressRepository userProgressRepository;
    @Mock
    private CourseRepository courseRepository;
    @Mock
    private UserRepository userRepository;
    @InjectMocks
    private LessonServiceJpa lessonServiceJpa;

    @Test
    void getFirstLesson_shouldReturnEmptyOptionalIfNoLesson() {
        when(lessonRepository.findFirstByCourseIdOrderByLessonNumberAsc(10))
                .thenReturn(Optional.empty());

        Optional<LessonDTO> result = lessonServiceJpa.getFirstLesson(10, 123);

        assertTrue(result.isEmpty());
    }

    @Test
    void getFirstLesson_shouldReturnLessonDTOIfExists() {
        Course course = new Course();
        course.setId(10);

        User user = new User();
        user.setId(1);

        Lesson lesson = new Lesson();
        lesson.setId(1);
        lesson.setLessonNumber(1);
        lesson.setCourse(course);
        lesson.setUser(user);
        lesson.setLessonName("Lesson name");

        when(lessonRepository.findFirstByCourseIdOrderByLessonNumberAsc(10))
                .thenReturn(Optional.of(lesson));

        Optional<LessonDTO> result = lessonServiceJpa.getFirstLesson(course.getId(), 123);

        assertTrue(result.isPresent());
        assertEquals(lesson.getId(), result.get().getId());
        assertEquals(lesson.getLessonName(), result.get().getLessonName());
    }

    @Test
    void getLessonByCourseIdAndLessonNumber_shouldReturnFirstLesson() {
        Lesson lesson1 = new Lesson();
        lesson1.setLessonNumber(1);
        lesson1.setId(101);

        Lesson lesson2 = new Lesson();
        lesson2.setLessonNumber(2);
        lesson2.setId(102);

        List<Lesson> lessons = List.of(lesson1, lesson2);

        when(lessonRepository.findByCourse_IdOrderByLessonNumberAsc(10)).thenReturn(lessons);

        Optional<LessonDTO> result = lessonServiceJpa.getLessonByCourseIdAndLessonNumber(10, 1);

        assertTrue(result.isPresent());
        assertEquals(1, result.get().getLessonNumber());
        assertTrue(result.get().isFirst());
        assertFalse(result.get().isLast());
    }

    @Test
    void getLessonByCourseIdAndLessonNumber_shouldReturnLastLesson() {
        Lesson lesson1 = new Lesson();
        lesson1.setLessonNumber(1);
        lesson1.setId(101);

        Lesson lesson2 = new Lesson();
        lesson2.setLessonNumber(2);
        lesson2.setId(102);

        List<Lesson> lessons = List.of(lesson1, lesson2);

        when(lessonRepository.findByCourse_IdOrderByLessonNumberAsc(10)).thenReturn(lessons);

        Optional<LessonDTO> result = lessonServiceJpa.getLessonByCourseIdAndLessonNumber(10, 2);

        assertTrue(result.isPresent());
        assertEquals(2, result.get().getLessonNumber());
        assertFalse(result.get().isFirst());
        assertTrue(result.get().isLast());
    }

    @Test
    void getLessonByCourseIdAndLessonNumber_shouldReturnMiddleLesson() {
        Lesson lesson1 = new Lesson();
        lesson1.setLessonNumber(1);
        Lesson lesson2 = new Lesson();
        lesson2.setLessonNumber(2);
        Lesson lesson3 = new Lesson();
        lesson3.setLessonNumber(3);

        List<Lesson> lessons = List.of(lesson1, lesson2, lesson3);

        when(lessonRepository.findByCourse_IdOrderByLessonNumberAsc(10)).thenReturn(lessons);

        Optional<LessonDTO> result = lessonServiceJpa.getLessonByCourseIdAndLessonNumber(10, 2);

        assertTrue(result.isPresent());
        assertFalse(result.get().isFirst());
        assertFalse(result.get().isLast());
    }

    @Test
    void getLessonByCourseIdAndLessonNumber_shouldReturnEmptyIfNotFound() {
        Lesson lesson1 = new Lesson();
        lesson1.setLessonNumber(1);

        when(lessonRepository.findByCourse_IdOrderByLessonNumberAsc(10)).thenReturn(List.of(lesson1));

        Optional<LessonDTO> result = lessonServiceJpa.getLessonByCourseIdAndLessonNumber(10, 5);

        assertTrue(result.isEmpty());
    }

    @Test
    void findLessonIdByCourseAndNumberAndUser_shouldThrowIfUserNotFound() {
        when(userRepository.findByAuth0UserId("ghost-user")).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () ->
                lessonServiceJpa.findLessonIdByCourseAndNumberAndUser("10", 1, "ghost-user")
        );
    }

    @Test
    void findLessonIdByCourseAndNumberAndUser_shouldReturnLessonIdIfFound() {
        User user = new User();
        user.setId(42);

        Lesson lesson = new Lesson();
        lesson.setId(101);

        when(userRepository.findByAuth0UserId("user1")).thenReturn(Optional.of(user));
        when(lessonRepository.findByCourseIdAndLessonNumberAndUserId(10, 1, 42))
                .thenReturn(Optional.of(lesson));

        Integer lessonId = lessonServiceJpa.findLessonIdByCourseAndNumberAndUser("10", 1, "user1");
        assertEquals(101, lessonId);
    }

    @Test
    void findLessonIdByCourseAndNumberAndUser_shouldReturnNullIfLessonNotFound() {
        User user = new User();
        user.setId(42);

        when(userRepository.findByAuth0UserId("user1")).thenReturn(Optional.of(user));
        when(lessonRepository.findByCourseIdAndLessonNumberAndUserId(10, 1, 42))
                .thenReturn(Optional.empty());

        Integer lessonId = lessonServiceJpa.findLessonIdByCourseAndNumberAndUser("10", 1, "user1");
        assertNull(lessonId);
    }

    @Test
    void getLessonByCourseIdAndLessonId_shouldReturnEmptyIfLessonNotFound() {
        when(lessonRepository.findById(101)).thenReturn(Optional.empty());

        Optional<LessonDTO> result = lessonServiceJpa.getLessonByCourseIdAndLessonId(10, 101);
        assertTrue(result.isEmpty());
    }

    @Test
    void getLessonByCourseIdAndLessonId_shouldReturnEmptyIfLessonCourseMismatch() {
        Lesson lesson = new Lesson();
        Course course = new Course();
        course.setId(99);
        lesson.setCourse(course);

        when(lessonRepository.findById(101)).thenReturn(Optional.of(lesson));

        Optional<LessonDTO> result = lessonServiceJpa.getLessonByCourseIdAndLessonId(10, 101);
        assertTrue(result.isEmpty());
    }

    @Test
    void getLessonByCourseIdAndLessonId_shouldReturnLessonDTOIfCourseMatches() {
        Lesson lesson = new Lesson();
        lesson.setLessonNumber(1);
        Course course = new Course();
        course.setId(10);
        lesson.setCourse(course);

        when(lessonRepository.findById(101)).thenReturn(Optional.of(lesson));
        when(lessonRepository.findByCourse_IdOrderByLessonNumberAsc(10))
                .thenReturn(List.of(lesson));

        Optional<LessonDTO> result = lessonServiceJpa.getLessonByCourseIdAndLessonId(10, 101);
        assertTrue(result.isPresent());
    }

    @Test
    void getNextLesson_shouldReturnEmptyIfNoneFound() {
        when(lessonRepository.findNextLesson(10, 1, 42)).thenReturn(Optional.empty());

        Optional<LessonDTO> result = lessonServiceJpa.getNextLesson(10, 1, 42);
        assertTrue(result.isEmpty());
    }

    @Test
    void getNextLesson_shouldReturnLessonDTOIfFound() {
        Lesson lesson = new Lesson();
        lesson.setId(101);
        lesson.setLessonNumber(2);
        Course course = new Course();
        course.setId(10);
        lesson.setCourse(course);

        when(lessonRepository.findNextLesson(10, 1, 42)).thenReturn(Optional.of(lesson));

        Optional<LessonDTO> result = lessonServiceJpa.getNextLesson(10, 1, 42);
        assertTrue(result.isPresent());
        assertEquals(101, result.get().getId());
        assertEquals(2, result.get().getLessonNumber());
    }

    @Test
    void getPreviousLesson_shouldReturnEmptyIfNoneFound() {
        when(lessonRepository.findPreviousLesson(10, 2, 42)).thenReturn(Optional.empty());

        Optional<LessonDTO> result = lessonServiceJpa.getPreviousLesson(10, 2, 42);
        assertTrue(result.isEmpty());
    }

    @Test
    void getPreviousLesson_shouldReturnLessonDTOIfFound() {
        Lesson lesson = new Lesson();
        lesson.setId(99);
        lesson.setLessonNumber(1);
        Course course = new Course();
        course.setId(10);
        lesson.setCourse(course);

        when(lessonRepository.findPreviousLesson(10, 2, 42)).thenReturn(Optional.of(lesson));

        Optional<LessonDTO> result = lessonServiceJpa.getPreviousLesson(10, 2, 42);
        assertTrue(result.isPresent());
        assertEquals(99, result.get().getId());
    }
}
