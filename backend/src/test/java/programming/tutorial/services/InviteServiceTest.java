package programming.tutorial.services;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.expression.ExpressionException;
import programming.tutorial.dao.*;
import programming.tutorial.domain.*;
import programming.tutorial.services.impl.InviteServiceJpa;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class InviteServiceTest {

    @Mock
    private InviteRepository inviteRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private CourseRepository courseRepository;
    @Mock
    private LessonRepository lessonRepository;
    @Mock
    private UserCourseRepository userCourseRepository;
    @Mock
    private EmailService emailService;
    @InjectMocks
    private InviteServiceJpa inviteServiceJpa;

    @Test
    void acceptInvite_shouldThrow_whenTokenInvalid() {
        when(inviteRepository.findByToken("Some invalid token")).thenReturn(Optional.empty());

        ExpressionException exception = assertThrows(ExpressionException.class, () ->
                inviteServiceJpa.acceptInvite("Some invalid token", "username"));

        assertEquals("Invalid or expired token", exception.getMessage());
    }

    @Test
    void acceptInvite_shouldThrow_whenTokenUsed() {
        CourseInviteToken invite = new CourseInviteToken();
        invite.setUsed(true);
        invite.setToken("token");
        invite.setExpiresAt(LocalDateTime.now().plusDays(1));

        when(inviteRepository.findByToken(invite.getToken())).thenReturn(Optional.of(invite));

        ExpressionException ex = assertThrows(ExpressionException.class,
                () -> inviteServiceJpa.acceptInvite("token", "user1"));

        assertEquals("Token is no longer valid", ex.getMessage());
    }

    @Test
    void acceptInvite_shouldThrow_whenTokenExpired() {
        CourseInviteToken invite = new CourseInviteToken();
        invite.setUsed(false);
        invite.setToken("token");
        invite.setExpiresAt(LocalDateTime.now().minusDays(99));

        when(inviteRepository.findByToken(invite.getToken())).thenReturn(Optional.of(invite));

        ExpressionException ex = assertThrows(ExpressionException.class,
                () -> inviteServiceJpa.acceptInvite("token", "user1"));

        assertEquals("Token is no longer valid", ex.getMessage());
    }

    @Test
    void acceptInvite_shouldThrow_whenUserNotFound() {
        CourseInviteToken invite = new CourseInviteToken();
        invite.setUsed(false);
        invite.setExpiresAt(LocalDateTime.now().plusDays(1));

        when(inviteRepository.findByToken("token123")).thenReturn(Optional.of(invite));
        when(userRepository.findByAuth0UserId("user1")).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> inviteServiceJpa.acceptInvite("token123", "user1"));

        assertEquals("User not found", ex.getMessage());
    }

    @Test
    void acceptInvite_shouldThrow_whenUsernameMismatch() {
        CourseInviteToken invite = new CourseInviteToken();
        invite.setUsed(false);
        invite.setExpiresAt(LocalDateTime.now().plusDays(1));
        invite.setInvitedEmail("someone@example.com");

        User user = new User();
        user.setUsername("other@example.com");

        when(inviteRepository.findByToken("token123")).thenReturn(Optional.of(invite));
        when(userRepository.findByAuth0UserId("user1")).thenReturn(Optional.of(user));

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> inviteServiceJpa.acceptInvite("token123", "user1"));

        assertEquals("Invite is not for this user", ex.getMessage());
    }

    @Test
    void acceptInvite_shouldNotCreateUserCourse_ifAlreadyEnrolled() {
        Course course = new Course();
        course.setId(10);

        CourseInviteToken invite = new CourseInviteToken();
        invite.setUsed(false);
        invite.setExpiresAt(LocalDateTime.now().plusDays(1));
        invite.setInvitedEmail("user@example.com");
        invite.setCourse(course);

        User user = new User();
        user.setId(100);
        user.setUsername("user@example.com");

        Lesson lesson = new Lesson();
        lesson.setLessonNumber(1);

        when(inviteRepository.findByToken("token123")).thenReturn(Optional.of(invite));
        when(userRepository.findByAuth0UserId("user1")).thenReturn(Optional.of(user));
        when(userCourseRepository.existsByUserIdAndCourseId(user.getId(), course.getId())).thenReturn(true);
        when(lessonRepository.findFirstByCourseIdOrderByLessonNumberAsc(course.getId())).thenReturn(Optional.of(lesson));

        InviteResponse response = inviteServiceJpa.acceptInvite("token123", "user1");

        verify(userCourseRepository, never()).save(any(UserCourse.class));
        assertTrue(invite.isUsed());
        verify(inviteRepository, times(1)).save(invite);
        assertEquals(10, response.getCourseId());
        assertEquals(1, response.getLessonNumber());
    }

    @Test
    void acceptInvite_shouldCreateUserCourse_andReturnResponse() {
        Course course = new Course();
        course.setId(10);

        CourseInviteToken invite = new CourseInviteToken();
        invite.setUsed(false);
        invite.setExpiresAt(LocalDateTime.now().plusDays(1));
        invite.setInvitedEmail("user@example.com");
        invite.setCourse(course);

        User user = new User();
        user.setId(100);
        user.setUsername("user@example.com");

        Lesson lesson = new Lesson();
        lesson.setLessonNumber(1);

        when(inviteRepository.findByToken("token123")).thenReturn(Optional.of(invite));
        when(userRepository.findByAuth0UserId("user1")).thenReturn(Optional.of(user));
        when(userCourseRepository.existsByUserIdAndCourseId(user.getId(), course.getId())).thenReturn(false);
        when(lessonRepository.findFirstByCourseIdOrderByLessonNumberAsc(course.getId())).thenReturn(Optional.of(lesson));

        InviteResponse response = inviteServiceJpa.acceptInvite("token123", "user1");

        verify(userCourseRepository, times(1)).save(any(UserCourse.class));
        assertTrue(invite.isUsed());
        verify(inviteRepository, times(1)).save(invite);
        assertEquals(10, response.getCourseId());
        assertEquals(1, response.getLessonNumber());
    }

    @Test
    void acceptInvite_shouldThrow_whenNoLessons() {
        Course course = new Course();
        course.setId(10);

        CourseInviteToken invite = new CourseInviteToken();
        invite.setUsed(false);
        invite.setExpiresAt(LocalDateTime.now().plusDays(1));
        invite.setInvitedEmail("user@example.com");
        invite.setCourse(course);

        User user = new User();
        user.setId(100);
        user.setUsername("user@example.com");

        when(inviteRepository.findByToken("token123")).thenReturn(Optional.of(invite));
        when(userRepository.findByAuth0UserId("user1")).thenReturn(Optional.of(user));
        when(userCourseRepository.existsByUserIdAndCourseId(user.getId(), course.getId())).thenReturn(false);
        when(lessonRepository.findFirstByCourseIdOrderByLessonNumberAsc(course.getId())).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> inviteServiceJpa.acceptInvite("token123", "user1"));

        assertEquals("No lessons in course", ex.getMessage());
    }

    @Test
    void generateInviteToken_shouldThrowException_whenCourseNotFound() {
        Integer courseId = 1;
        when(courseRepository.findById(courseId)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () ->
                inviteServiceJpa.generateInviteToken(Long.valueOf(courseId), 2L, "userID", "email@email.com"));

        assertEquals("Course not found with id: " + courseId, exception.getMessage());
    }

    @Test
    void generateInviteToken_shouldThrow_whenLessonNotFound() {
        Course course = new Course();
        course.setId(1);

        when(courseRepository.findById(course.getId())).thenReturn(Optional.of(course));
        when(lessonRepository.findFirstByCourse_IdOrderByIdAsc(1)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> inviteServiceJpa.generateInviteToken(Long.valueOf(course.getId()), 10L, "user123", "email@example.com"));

        assertEquals("Lesson not found with id: 10", exception.getMessage());
    }

    @Test
    void generateInviteToken_shouldSaveToken_andReturnToken() {
        Course course = new Course();
        course.setId(1);

        Lesson lesson = new Lesson();
        lesson.setId(10);

        when(courseRepository.findById(1)).thenReturn(Optional.of(course));
        when(lessonRepository.findFirstByCourse_IdOrderByIdAsc(1)).thenReturn(Optional.of(lesson));

        String result = inviteServiceJpa.generateInviteToken(1L, 10L, "user123", "email@example.com");

        assertNotNull(result);

        ArgumentCaptor<CourseInviteToken> captor = ArgumentCaptor.forClass(CourseInviteToken.class);
        verify(inviteRepository, times(1)).save(captor.capture());

        CourseInviteToken savedToken = captor.getValue();

        assertEquals(course, savedToken.getCourse());
        assertEquals(lesson, savedToken.getLesson());
        assertEquals("user123", savedToken.getInvitedByUserId());
        assertEquals("email@example.com", savedToken.getInvitedEmail());
        assertNotNull(savedToken.getToken());
        assertTrue(savedToken.getExpiresAt().isAfter(savedToken.getExpiresAt().minusDays(1)));
    }

    @Test
    void createAndSendInvite_shouldThrow_whenCourseNotFound() {
        when(courseRepository.findById(1)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> inviteServiceJpa.createAndSendInvite("test@example.com", 1L, "inviter123"));

        assertEquals("Course not found", ex.getMessage());
    }

    @Test
    void createAndSendInvite_shouldThrow_whenUserAlreadyEnrolled() {
        Course course = new Course();
        course.setId(1);

        when(courseRepository.findById(1)).thenReturn(Optional.of(course));

        User existingUser = new User();
        existingUser.setId(100);

        when(userRepository.findByUsername("test@example.com")).thenReturn(existingUser);
        when(userCourseRepository.existsByUserIdAndCourseId(100, 1)).thenReturn(true);

        IllegalStateException ex = assertThrows(IllegalStateException.class,
                () -> inviteServiceJpa.createAndSendInvite("test@example.com", 1L, "inviter123"));

        assertEquals("User is already enrolled in this course. Can't send invite again.", ex.getMessage());
    }

    @Test
    void createAndSendInvite_shouldSendEmail_whenUserNotEnrolled() {
        Course course = new Course();
        course.setId(1);
        course.setCourseName("Java Basics");

        when(courseRepository.findById(1)).thenReturn(Optional.of(course));
        when(userRepository.findByUsername("test@example.com")).thenReturn(null);

        User inviter = new User();
        inviter.setName("John Doe");

        when(userRepository.findByAuth0UserId("inviter123")).thenReturn(Optional.of(inviter));

        InviteServiceJpa spyService = spy(inviteServiceJpa);
        doReturn("mocked-token").when(spyService).generateInviteToken(1L, null, "inviter123", "test@example.com");

        spyService.createAndSendInvite("test@example.com", 1L, "inviter123");

        ArgumentCaptor<String> emailCaptor = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<String> nameCaptor = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<String> courseCaptor = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<String> linkCaptor = ArgumentCaptor.forClass(String.class);

        verify(emailService, times(1)).sendCourseInviteEmail(
                emailCaptor.capture(),
                nameCaptor.capture(),
                courseCaptor.capture(),
                linkCaptor.capture()
        );

        assertEquals("test@example.com", emailCaptor.getValue());
        assertEquals("John Doe", nameCaptor.getValue());
        assertEquals("Java Basics", courseCaptor.getValue());
        assertEquals("http://localhost:3000/accept-invite?token=mocked-token", linkCaptor.getValue());
    }
}
