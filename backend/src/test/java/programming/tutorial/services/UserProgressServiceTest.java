package programming.tutorial.services;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;
import programming.tutorial.dao.*;
import programming.tutorial.domain.*;
import programming.tutorial.dto.*;
import programming.tutorial.services.impl.UserProgressServiceJpa;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserProgressServiceTest {
    @Mock
    private UserProgressRepository userProgressRepository;
    @Mock
    private LessonRepository lessonRepository;
    @Mock
    private UserRepository userRepository;

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private UserCourseRepository userCourseRepository;

    @InjectMocks
    private UserProgressServiceJpa userProgressService;


    @Test
    void getCurrentLesson_shouldReturnLessoNDTO_ifProgressExists() {
        String auth0Id = "auth0Id";
        Integer courseId = 1;

        Lesson lesson = new Lesson();
        lesson.setId(1);
        lesson.setLessonName("Lesson 1");
        lesson.setLessonNumber(1);

        UserProgress userProgress = new UserProgress();
        userProgress.setCurrentLesson(lesson);

        when(userProgressRepository.findByUser_Auth0UserIdAndCourse_Id(auth0Id, courseId)).thenReturn(Optional.of(userProgress));

        Optional<LessonDTO> result = userProgressService.getCurrentLesson(auth0Id, courseId);

        assertTrue(result.isPresent());
        LessonDTO dto = result.get();
        assertEquals(1, dto.getId());
        assertEquals("Lesson 1", dto.getLessonName());
        assertEquals(1, dto.getLessonNumber());

        verify(userProgressRepository, times(1))
                .findByUser_Auth0UserIdAndCourse_Id(auth0Id, courseId);
    }

    @Test
    void getCurrentLesson_shouldReturnEmpty_ifProgressDoesNotExists() {
        String auth0Id = "auth0Id";
        Integer courseId = 1;

        when(userProgressRepository.findByUser_Auth0UserIdAndCourse_Id(auth0Id, courseId)).thenReturn(Optional.empty());

        Optional<LessonDTO> result = userProgressService.getCurrentLesson(auth0Id, courseId);

        assertTrue(result.isEmpty());
        verify(userProgressRepository, times(1))
                .findByUser_Auth0UserIdAndCourse_Id(auth0Id, courseId);
    }

    @Test
    void updateProgress_throwsNotFoundWhenUserNotFound() {
        String auth0Id = "auth0Id";
        Integer courseId = 1;
        Integer lessonNumber = 1;

        when(userRepository.findByAuth0UserId(auth0Id)).thenReturn(Optional.empty());

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () ->
                userProgressService.updateProgress(auth0Id, courseId, lessonNumber));

        assertEquals("404 NOT_FOUND \"User not found\"", exception.getMessage());
        verify(userRepository, times(1)).findByAuth0UserId(auth0Id);
        verifyNoInteractions(userProgressRepository, lessonRepository);
    }

    @Test
    void updateProgress_throwsWhenProgressNotFound() {
        String auth0Id = "auth0Id";
        Integer courseId = 1;
        Integer lessonNumber = 1;

        User user = new User();
        user.setId(1);

        when(userRepository.findByAuth0UserId(auth0Id)).thenReturn(Optional.of(user));
        when(userProgressRepository.findByUser_Auth0UserIdAndCourse_Id(auth0Id, courseId))
                .thenReturn(Optional.empty());

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () ->
                userProgressService.updateProgress(auth0Id, courseId, lessonNumber));

        assertEquals("404 NOT_FOUND \"User progress not found\"", exception.getMessage());
        verify(userRepository).findByAuth0UserId(auth0Id);
        verify(userProgressRepository).findByUser_Auth0UserIdAndCourse_Id(auth0Id, courseId);
        verifyNoInteractions(lessonRepository);
    }

    @Test
    void updateProgress_updatesWhenNextLessonExist() {
        String auth0Id = "auth0Id";
        Integer courseId = 1;
        Integer lessonNumber = 1;

        User user = new User();
        user.setId(1);

        UserProgress userProgress = new UserProgress();
        Lesson nextLesson = new Lesson();
        nextLesson.setId(1);
        nextLesson.setLessonName("Next Lesson");

        when(userRepository.findByAuth0UserId(auth0Id)).thenReturn(Optional.of(user));
        when(userProgressRepository.findByUser_Auth0UserIdAndCourse_Id(auth0Id, courseId)).thenReturn(Optional.of(userProgress));
        when(lessonRepository.findNextLesson(courseId, lessonNumber, user.getId())).thenReturn(Optional.of(nextLesson));

        String result = userProgressService.updateProgress(auth0Id, courseId, lessonNumber);

        assertEquals(result, "Progress updated successfully.");
        assertEquals(nextLesson, userProgress.getCurrentLesson());
        verify(userProgressRepository).save(userProgress);
    }

    @Test
    void updateProgress_returnsCompleteWhenNoNextLesson() {
        String auth0Id = "auth0Id";
        Integer courseId = 1;
        Integer lessonNumber = 1;

        User user = new User();
        user.setId(1);

        UserProgress userProgress = new UserProgress();
        Lesson nextLesson = new Lesson();
        nextLesson.setId(1);
        nextLesson.setLessonName("Next Lesson");

        when(userRepository.findByAuth0UserId(auth0Id)).thenReturn(Optional.of(user));
        when(userProgressRepository.findByUser_Auth0UserIdAndCourse_Id(auth0Id, courseId)).thenReturn(Optional.of(userProgress));
        when(lessonRepository.findNextLesson(courseId, lessonNumber, user.getId())).thenReturn(Optional.empty());

        String result = userProgressService.updateProgress(auth0Id, courseId, lessonNumber);

        assertEquals(result, "No more lessons. Course might be complete.");
        verify(userProgressRepository, never()).save(any());
    }

    @Test
    void getProgressBar_returns404WhenUserNotFound() {
        when(userRepository.findByAuth0UserId("auth0|missing"))
                .thenReturn(Optional.empty());

        ResponseEntity<?> response = userProgressService.getProgressBar("auth0|missing", 1);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("User not found", response.getBody());
    }

    @Test
    void getProgressBar_return404WhenCourseNotFound() {
        String auth0Id = "auth0Id";
        Integer courseId = 1;

        User user = new User();
        user.setId(1);

        when(userRepository.findByAuth0UserId(auth0Id)).thenReturn(Optional.of(user));
        when(courseRepository.findById(courseId)).thenReturn(Optional.empty());

        ResponseEntity<?> response = userProgressService.getProgressBar(auth0Id, courseId);

        assertEquals(response.getStatusCode(), HttpStatus.NOT_FOUND);
        assertEquals("Course not found", response.getBody());
    }

    @Test
    void getProgressBar_returnsProgressData() {
        String auth0Id = "auth0Id";
        Integer courseId = 1;
        User user = new User();
        user.setId(10);
        Course course = new Course();
        course.setLength(5);

        when(userRepository.findByAuth0UserId(auth0Id))
                .thenReturn(Optional.of(user));
        when(courseRepository.findById(courseId))
                .thenReturn(Optional.of(course));
        when(lessonRepository.countCompletedLessonsForUserAndCourse(courseId, 10))
                .thenReturn(3L);

        ResponseEntity<?> response = userProgressService.getProgressBar(auth0Id, courseId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody() instanceof Map);

        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertEquals(5, body.get("totalLessons"));
        assertEquals(3L, body.get("completedLessons"));
        assertEquals(60.0, (double) body.get("progress"));
    }

    @Test
    void getProgressBar_returnsZeroProgressWhenCourseLengthIsZero() {
        String auth0Id = "auth0Id";
        Integer courseId = 1;
        User user = new User();
        user.setId(20);
        Course course = new Course();
        course.setLength(0);

        when(userRepository.findByAuth0UserId(auth0Id))
                .thenReturn(Optional.of(user));
        when(courseRepository.findById(courseId))
                .thenReturn(Optional.of(course));
        when(lessonRepository.countCompletedLessonsForUserAndCourse(courseId, 20))
                .thenReturn(0L);

        ResponseEntity<?> response = userProgressService.getProgressBar(auth0Id, courseId);

        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertEquals(0, body.get("totalLessons"));
        assertEquals(0L, body.get("completedLessons"));
        assertEquals(0.0, (double) body.get("progress"));
    }

    @Test
    void isUserEnrolled_returnsFalseWhenUserNotFound() {
        String auth0Id = "auth0Id";
        Integer courseId = 1;

        when(userRepository.findByAuth0UserId(auth0Id)).thenReturn(Optional.empty());

        boolean enrolled = userProgressService.isUserEnrolled(auth0Id, courseId);

        assertFalse(enrolled);
        verifyNoInteractions(userCourseRepository);
    }

    @Test
    void isUserEnrolled_returnsFalseWhenNotEnrolled() {
        String auth0Id = "auth0Id";
        Integer courseId = 1;

        User user = new User();
        user.setId(1);

        when(userRepository.findByAuth0UserId(auth0Id)).thenReturn(Optional.of(user));
        when(userCourseRepository.existsByUserIdAndCourseId(user.getId(), courseId)).thenReturn(false);

        boolean enrolled = userProgressService.isUserEnrolled(auth0Id, courseId);

        assertFalse(enrolled);
    }

    @Test
    void isUserEnrolled_returnsTrueWhenEnrolled() {
        String auth0Id = "auth0Id";
        Integer courseId = 1;

        User user = new User();
        user.setId(1);

        when(userRepository.findByAuth0UserId(auth0Id)).thenReturn(Optional.of(user));
        when(userCourseRepository.existsByUserIdAndCourseId(user.getId(), courseId)).thenReturn(true);

        boolean enrolled = userProgressService.isUserEnrolled(auth0Id, courseId);

        assertTrue(enrolled);
    }

}
