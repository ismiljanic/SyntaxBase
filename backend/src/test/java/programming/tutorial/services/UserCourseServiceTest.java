package programming.tutorial.services;

import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import programming.tutorial.dao.*;
import programming.tutorial.domain.*;
import programming.tutorial.dto.*;
import programming.tutorial.services.impl.UserCourseServiceJpa;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserCourseServiceTest {

    @Mock
    private UserCourseRepository userCourseRepository;

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private LessonRepository lessonRepository;
    @Mock
    private UserProgressRepository userProgressRepository;
    @Mock
    private CertificateRepository certificateRepository;

    @Mock
    private CertificateService certificateService;

    @Mock
    private BadgeService badgeService;
    @InjectMocks
    private UserCourseServiceJpa userCourseServiceJpa;

    @Test
    void enrollUserInCourse_throwException_ifUserOrCourseIdIsNull() {
        UserCourseDTO dto = new UserCourseDTO();
        dto.setAuth0UserId(null);
        dto.setCourseId(null);

        assertThrows(IllegalArgumentException.class, () ->
                userCourseServiceJpa.enrollUserInCourse(dto));
    }

    @Test
    void enrollUserInCourse_throwException_ifUserIsEnrolled() {
        UserCourseDTO dto = new UserCourseDTO();
        dto.setAuth0UserId("auth0Id");
        dto.setCourseId(1);

        UserCourseServiceJpa spyService = spy(userCourseServiceJpa);

        doReturn(true).when(spyService).isUserEnrolledInCourse("auth0Id", 1);
        assertThrows(IllegalStateException.class, () -> spyService.enrollUserInCourse(dto));
    }

    @Test
    void enrollUserInCourse_throwsException_whenUserNotFound() {
        UserCourseDTO dto = new UserCourseDTO();
        dto.setAuth0UserId("auth0Id");
        dto.setCourseId(1);

        UserCourseServiceJpa spyService = spy(userCourseServiceJpa);
        doReturn(false).when(spyService).isUserEnrolledInCourse("auth0Id", 1);

        when(userRepository.findByAuth0UserId("auth0Id")).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> spyService.enrollUserInCourse(dto));
    }


    @Test
    void enrollUserInCourse_throwsException_whenCourseNotFound() {
        UserCourseDTO dto = new UserCourseDTO();
        dto.setAuth0UserId("auth0Id");
        dto.setCourseId(1);

        User user = new User();
        user.setAuth0UserId("auth0Id");

        UserCourseServiceJpa spyService = spy(userCourseServiceJpa);
        doReturn(false).when(spyService).isUserEnrolledInCourse("auth0Id", 1);

        when(userRepository.findByAuth0UserId("auth0Id")).thenReturn(Optional.of(user));
        when(courseRepository.findById(1)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> spyService.enrollUserInCourse(dto));
    }

    @Test
    void enrollUserInCourse_createsLessonsWhenNonExist() {
        UserCourseDTO dto = new UserCourseDTO();
        dto.setAuth0UserId("auth0Id");
        dto.setCourseId(1);

        UserCourseServiceJpa spyService = spy(userCourseServiceJpa);
        doReturn(false).when(spyService).isUserEnrolledInCourse("auth0Id", 1);

        User user = new User();
        user.setId(1);
        user.setAuth0UserId("auth0Id");
        user.setUsername("username");

        Course course = new Course();
        course.setId(1);
        course.setLength(10);

        when(userRepository.findByAuth0UserId("auth0Id")).thenReturn(Optional.of(user));
        when(courseRepository.findById(1)).thenReturn(Optional.of(course));
        when(lessonRepository.findByCourse_IdAndUser_Auth0UserId(1, "auth0Id")).thenReturn(Collections.emptyList());

        spyService.enrollUserInCourse(dto);

        verify(userCourseRepository, times(1)).save(any(UserCourse.class));
        verify(lessonRepository, times(10)).save(any(Lesson.class));
    }

    @Test
    void enrollUserInCourse_doesNotCreateLessonsIfExist() {
        UserCourseDTO dto = new UserCourseDTO();
        dto.setAuth0UserId("auth0|123");
        dto.setCourseId(1);

        UserCourseServiceJpa spyService = spy(userCourseServiceJpa);
        doReturn(false).when(spyService).isUserEnrolledInCourse("auth0|123", 1);

        User user = new User();
        user.setId(10);
        user.setAuth0UserId("auth0|123");
        user.setUsername("john");

        Course course = new Course();
        course.setId(1);
        course.setLength(5);

        Lesson existingLesson = new Lesson();
        existingLesson.setLessonNumber(1);

        when(userRepository.findByAuth0UserId("auth0|123"))
                .thenReturn(Optional.of(user));
        when(courseRepository.findById(1)).thenReturn(Optional.of(course));
        when(lessonRepository.findByCourse_IdAndUser_Auth0UserId(1, "auth0|123"))
                .thenReturn(List.of(existingLesson));

        spyService.enrollUserInCourse(dto);

        verify(userCourseRepository, times(1)).save(any(UserCourse.class));
        verify(lessonRepository, never()).save(argThat(l -> l.getLessonName().startsWith("Lesson")));
    }

    @Test
    void getCoursesByUserId_returnsEmptyListWhenNoCourses() {
        when(userCourseRepository.findByUser_Auth0UserId("someAuth0Id")).thenReturn(List.of());

        List<CourseDTO> result = userCourseServiceJpa.getCoursesByUserId("someAuth0Id");
        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(userCourseRepository, times(1))
                .findByUser_Auth0UserId("someAuth0Id");
    }

    @Test
    void getCoursesByUserId_mapsSingleCourseCorrectly() {
        User user = new User();
        user.setId(42);

        Course course = new Course();
        course.setId(1);
        course.setCourseName("Course name");
        course.setLength(10);
        course.setDescription("Course Description");
        course.setCategory("Category");
        course.setCreator(user);
        course.setSystemCourse(false);

        UserCourse userCourse = new UserCourse();
        userCourse.setCourse(course);

        when(userCourseRepository.findByUser_Auth0UserId("auth0Id"))
                .thenReturn(List.of(userCourse));

        List<CourseDTO> result = userCourseServiceJpa.getCoursesByUserId("auth0Id");

        assertEquals(1, result.size());
        CourseDTO dto = result.get(0);
        assertEquals(1, dto.getCourseId());
        assertEquals("Course name", dto.getCourseName());
        assertEquals(10, dto.getCourseLength());
        assertEquals("Course Description", dto.getDescription());
        assertEquals("Category", dto.getCategory());
        assertEquals("42", dto.getCreatorId());
        assertFalse(dto.isSystemCourse());
    }

    @Test
    void getCoursesByUserId_mapsMultipleCoursesCorrectly() {
        User creator = new User();
        creator.setId(100);

        Course course1 = new Course();
        course1.setId(1);
        course1.setCourseName("Course 1");
        course1.setLength(8);
        course1.setDescription("Description 1");
        course1.setCategory("Category 1");
        course1.setCreator(creator);
        course1.setSystemCourse(false);

        Course course2 = new Course();
        course2.setId(2);
        course2.setCourseName("Course 2");
        course2.setLength(5);
        course2.setDescription("Description 2");
        course2.setCategory("Category 2");
        course2.setCreator(creator);
        course2.setSystemCourse(true);

        UserCourse uc1 = new UserCourse();
        uc1.setCourse(course1);
        UserCourse uc2 = new UserCourse();
        uc2.setCourse(course2);

        when(userCourseRepository.findByUser_Auth0UserId("auth0Id"))
                .thenReturn(List.of(uc1, uc2));

        List<CourseDTO> result = userCourseServiceJpa.getCoursesByUserId("auth0Id");

        assertEquals(2, result.size());

        assertEquals("Course 1", result.get(0).getCourseName());
        assertEquals("Course 2", result.get(1).getCourseName());
    }

    @Test
    void isUserEnrolledInCourse_returnsTrueWhenRepositorySaysEnrolled() {
        String auth0Id = "auth0Id";
        Integer courseId = 1;

        when(userCourseRepository.existsByUser_Auth0UserIdAndCourseId(auth0Id, courseId)).thenReturn(true);

        boolean result = userCourseServiceJpa.isUserEnrolledInCourse(auth0Id, courseId);

        assertTrue(result);
        verify(userCourseRepository, times(1)).existsByUser_Auth0UserIdAndCourseId(auth0Id, courseId);
    }

    @Test
    void isUserEnrolledInCourse_returnsFalseWhenRepositorySaysNotEnrolled() {
        String auth0Id = "auth0Id";
        Integer courseId = 1;

        when(userCourseRepository.existsByUser_Auth0UserIdAndCourseId(auth0Id, courseId)).thenReturn(false);

        boolean result = userCourseServiceJpa.isUserEnrolledInCourse(auth0Id, courseId);

        assertFalse(result);
        verify(userCourseRepository, times(1)).existsByUser_Auth0UserIdAndCourseId(auth0Id, courseId);
    }

    @Test
    void startCourseForUser_createsNewUserWhenNotFound() {
        StartCourseRequest request = new StartCourseRequest();
        request.setAuth0UserId("auth0|newuser");
        request.setCourseId(1);

        when(userRepository.findByAuth0UserId("auth0|newuser"))
                .thenReturn(Optional.empty())
                .thenReturn(Optional.of(new User()));

        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User saved = invocation.getArgument(0);
            saved.setId(42);
            return saved;
        });

        when(courseRepository.existsById(1)).thenReturn(true);
        when(courseRepository.findById(1)).thenReturn(Optional.of(new Course()));
        when(lessonRepository.findFirstByCourse_IdAndUser_IdOrderByIdAsc(eq(1), anyInt()))
                .thenReturn(Optional.of(new Lesson()));

        userCourseServiceJpa.startCourseForUser(request);

        verify(userRepository).save(argThat(user ->
                user.getAuth0UserId().equals("auth0|newuser")
                        && user.getName().equals("Unknown")
                        && user.getSurname().equals("User")
                        && user.getPassword().isEmpty()
                        && user.getUsername().startsWith("user_")
                        && user.getRole() == Role.USER
                        && user.getDateCreated() != null
        ));
    }

    @Test
    void startCourseForUser_throwsWhenCourseDoesNotExist() {
        StartCourseRequest request = new StartCourseRequest();
        request.setAuth0UserId("auth0|123");
        request.setCourseId(1);

        when(userRepository.findByAuth0UserId("auth0|123"))
                .thenReturn(Optional.of(new User()));
        when(courseRepository.existsById(anyInt())).thenReturn(false);

        assertThrows(IllegalArgumentException.class,
                () -> userCourseServiceJpa.startCourseForUser(request));
    }

    @Test
    void startCourseForUser_doesNotCreateProgressIfAlreadyExists() {
        StartCourseRequest request = new StartCourseRequest();
        request.setAuth0UserId("auth0|123");
        request.setCourseId(1);

        User user = new User();
        user.setId(42);

        when(userRepository.findByAuth0UserId("auth0|123"))
                .thenReturn(Optional.of(user));
        when(courseRepository.findById(1)).thenReturn(Optional.of(new Course()));
        when(courseRepository.existsById(1)).thenReturn(true);
        when(userProgressRepository.findByUser_Auth0UserIdAndCourse_Id("auth0|123", 1))
                .thenReturn(Optional.of(new UserProgress()));

        userCourseServiceJpa.startCourseForUser(request);

        verify(userProgressRepository, never()).save(any(UserProgress.class));
    }

    @Test
    void startCourseForUser_createsProgressIfNoneExists() {
        StartCourseRequest request = new StartCourseRequest();
        request.setAuth0UserId("auth0|123");
        request.setCourseId(1);

        User user = new User();
        user.setId(42);

        Course course = new Course();
        course.setId(1);

        Lesson firstLesson = new Lesson();
        firstLesson.setId(100);

        when(userRepository.findByAuth0UserId("auth0|123"))
                .thenReturn(Optional.of(user));
        when(courseRepository.existsById(1)).thenReturn(true);
        when(courseRepository.findById(1)).thenReturn(Optional.of(course));
        when(userProgressRepository.findByUser_Auth0UserIdAndCourse_Id("auth0|123", 1))
                .thenReturn(Optional.empty());
        when(lessonRepository.findFirstByCourse_IdAndUser_IdOrderByIdAsc(1, 42))
                .thenReturn(Optional.of(firstLesson));

        userCourseServiceJpa.startCourseForUser(request);

        verify(userProgressRepository).save(argThat(progress ->
                progress.getUser().equals(user)
                        && progress.getCourse().equals(course)
                        && progress.getCurrentLesson().equals(firstLesson)
        ));
    }

    @Test
    void startCourseForUser_throwsWhenNoLessonsFound() {
        StartCourseRequest request = new StartCourseRequest();
        request.setAuth0UserId("auth0|123");
        request.setCourseId(1);

        User user = new User();
        user.setId(42);

        Course course = new Course();
        course.setId(1);

        when(userRepository.findByAuth0UserId("auth0|123"))
                .thenReturn(Optional.of(user));
        when(courseRepository.existsById(1)).thenReturn(true);
        when(userProgressRepository.findByUser_Auth0UserIdAndCourse_Id("auth0|123", 1))
                .thenReturn(Optional.empty());
        when(lessonRepository.findFirstByCourse_IdAndUser_IdOrderByIdAsc(1, 42))
                .thenReturn(Optional.empty());
        when(courseRepository.findById(1)).thenReturn(Optional.of(course));

        assertThrows(IllegalStateException.class,
                () -> userCourseServiceJpa.startCourseForUser(request));
    }

    @Test
    void markCourseAsCompleted_returnsFalseWhenNotEnrolled() {
        when(userCourseRepository.findByUser_Auth0UserIdAndCourseId("auth0|123", 1))
                .thenReturn(Collections.emptyList());

        boolean result = userCourseServiceJpa.markCourseAsCompleted("auth0|123", 1);

        assertFalse(result);
        verify(userCourseRepository, never()).save(any(UserCourse.class));
        verify(certificateService, never()).generateAndSendCertificate(any(), any());
    }

    @Test
    void markCourseAsCompleted_marksCompletedAndGeneratesCertificateIfNotExists() {
        User user = new User();
        Course course = new Course();
        UserCourse userCourse = new UserCourse();
        userCourse.setUser(user);
        userCourse.setCourse(course);
        userCourse.setCompleted(false);

        when(userCourseRepository.findByUser_Auth0UserIdAndCourseId("auth0|123", 1))
                .thenReturn(List.of(userCourse));
        when(certificateRepository.existsByUser_Auth0UserIdAndCourse_Id("auth0|123", 1))
                .thenReturn(false);
        when(userCourseRepository.countByUserAndCompletedTrue(user)).thenReturn(1);

        boolean result = userCourseServiceJpa.markCourseAsCompleted("auth0|123", 1);

        assertTrue(result);
        assertTrue(userCourse.getCompleted());

        verify(userCourseRepository).save(userCourse);
        verify(certificateService).generateAndSendCertificate(user, course);
        verify(badgeService).awardCourseCompletionBadge(user, 1);
    }

    @Test
    void markCourseAsCompleted_marksCompletedButDoesNotGenerateCertificateIfAlreadyExists() {
        User user = new User();
        Course course = new Course();
        UserCourse userCourse = new UserCourse();
        userCourse.setUser(user);
        userCourse.setCourse(course);
        userCourse.setCompleted(false);

        when(userCourseRepository.findByUser_Auth0UserIdAndCourseId("auth0|123", 1))
                .thenReturn(List.of(userCourse));
        when(certificateRepository.existsByUser_Auth0UserIdAndCourse_Id("auth0|123", 1))
                .thenReturn(true);
        when(userCourseRepository.countByUserAndCompletedTrue(user)).thenReturn(2);

        boolean result = userCourseServiceJpa.markCourseAsCompleted("auth0|123", 1);

        assertTrue(result);
        assertTrue(userCourse.getCompleted());

        verify(userCourseRepository).save(userCourse);
        verify(certificateService, never()).generateAndSendCertificate(any(), any());
        verify(badgeService).awardCourseCompletionBadge(user, 2);
    }
}
