package programming.tutorial.services;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import programming.tutorial.dao.LessonFeedbackRepository;
import programming.tutorial.dao.LessonRepository;
import programming.tutorial.dao.UserRepository;
import programming.tutorial.domain.FeedbackRequest;
import programming.tutorial.domain.Lesson;
import programming.tutorial.domain.LessonFeedback;
import programming.tutorial.domain.User;
import programming.tutorial.dto.LessonCompletionDTO;
import programming.tutorial.dto.LessonFeedbackRequestDTO;
import programming.tutorial.services.impl.LessonFeedbackServiceJpa;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class LessonFeedbackServiceTest {
    @Mock
    private JavaMailSender emailSender;
    @InjectMocks
    private LessonFeedbackServiceJpa feedbackService;
    @Mock
    private LessonRepository lessonRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private LessonFeedbackRepository lessonFeedbackRepository;

    @Test
    void sendFeedbackEmail_shouldReturnSuccessMessage() {
        FeedbackRequest request = new FeedbackRequest();
        request.setEmail("user@example.com");
        request.setMessage("This is a test feedback");

        String result = feedbackService.sendFeedbackEmail(request);

        verify(emailSender, times(1)).send(any(SimpleMailMessage.class));
        assertEquals("Feedback submitted successfully!", result);
    }

    @Test
    void sendFeedbackEmail_shouldReturnFailureMessage_whenExceptionOccurs() {
        FeedbackRequest request = new FeedbackRequest();
        request.setEmail("user@example.com");
        request.setMessage("This is a test feedback");

        doThrow(new RuntimeException("SMTP failure")).when(emailSender).send(any(SimpleMailMessage.class));

        String result = feedbackService.sendFeedbackEmail(request);

        assertEquals("Failed to submit feedback. Please try again.", result);
    }

    @Test
    void receiveFeedback_shouldSaveFeedback_whenItDoesNotExists() {
        LessonFeedbackRequestDTO request = new LessonFeedbackRequestDTO();
        request.setLessonId(1);
        request.setFeedback("Feedback");

        Lesson lesson = new Lesson();
        lesson.setId(1);

        User user = new User();
        user.setId(100);

        when(lessonRepository.findById(1)).thenReturn(Optional.of(lesson));
        when(userRepository.findById(100)).thenReturn(Optional.of(user));
        when(lessonFeedbackRepository.findByLessonAndUser(lesson, user)).thenReturn(Optional.empty());

        String result = feedbackService.receiveFeedback(request, 100);

        verify(lessonFeedbackRepository, times(1)).save(any(LessonFeedback.class));
        assertEquals("Feedback received!", result);
    }

    @Test
    void receiveFeedback_shouldReturnAlreadyProvidedMessage_whenFeedbackExists() {
        LessonFeedbackRequestDTO request = new LessonFeedbackRequestDTO();
        request.setLessonId(1);
        request.setFeedback("Feedback");

        Lesson lesson = new Lesson();
        lesson.setId(1);

        User user = new User();
        user.setId(100);

        LessonFeedback existingFeedback = new LessonFeedback(lesson, user, "Old feedback");

        when(lessonRepository.findById(1)).thenReturn(Optional.of(lesson));
        when(userRepository.findById(100)).thenReturn(Optional.of(user));
        when(lessonFeedbackRepository.findByLessonAndUser(lesson, user)).thenReturn(Optional.of(existingFeedback));

        String result = feedbackService.receiveFeedback(request, 100);

        verify(lessonFeedbackRepository, never()).save(any(LessonFeedback.class));
        assertEquals("Feedback already provided for this lesson by the user.", result);
    }

    @Test
    void receiveFeedback_shouldThrowException_whenLessonNotFound() {
        LessonFeedbackRequestDTO request = new LessonFeedbackRequestDTO();
        request.setLessonId(1);

        when(lessonRepository.findById(1)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> feedbackService.receiveFeedback(request, 100));

        assertEquals("Lesson not found", ex.getMessage());
    }

    @Test
    void receiveFeedback_shouldThrowException_whenUserNotFound() {
        LessonFeedbackRequestDTO request = new LessonFeedbackRequestDTO();
        request.setLessonId(1);

        Lesson lesson = new Lesson();
        lesson.setId(1);

        when(lessonRepository.findById(1)).thenReturn(Optional.of(lesson));
        when(userRepository.findById(100)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> feedbackService.receiveFeedback(request, 100));

        assertEquals("User not found", ex.getMessage());
    }

    @Test
    void submitFeedback_shouldReturnSuccess_whenLessonAndUserFound() {
        Lesson lesson = new Lesson();
        lesson.setId(1);
        User user = new User();
        user.setId(100);

        LessonFeedbackRequestDTO dto = new LessonFeedbackRequestDTO();
        dto.setLessonId(1);
        dto.setFeedback("Feedback");

        when(lessonRepository.findById(1)).thenReturn(Optional.of(lesson));
        when(userRepository.findByAuth0UserId("auth0|123")).thenReturn(Optional.of(user));

        ResponseEntity<String> result = feedbackService.submitFeedback(dto, "auth0|123");

        verify(lessonFeedbackRepository, times(1)).save(any(LessonFeedback.class));
        assertEquals("Feedback submitted successfully", result.getBody());
        assertEquals(200, result.getStatusCodeValue());
    }

    @Test
    void submitFeedback_shouldThrow_whenLessonNotFound() {
        LessonFeedbackRequestDTO dto = new LessonFeedbackRequestDTO();
        dto.setLessonId(1);

        when(lessonRepository.findById(1)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> feedbackService.submitFeedback(dto, "auth0|123"));

        assertEquals("Lesson not found with id: 1", ex.getMessage());
    }

    @Test
    void submitFeedback_shouldThrow_whenUserNotFound() {
        Lesson lesson = new Lesson();
        lesson.setId(1);
        LessonFeedbackRequestDTO dto = new LessonFeedbackRequestDTO();
        dto.setLessonId(1);

        when(lessonRepository.findById(1)).thenReturn(Optional.of(lesson));
        when(userRepository.findByAuth0UserId("auth0|123")).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> feedbackService.submitFeedback(dto, "auth0|123"));

        assertEquals("User not found", ex.getMessage());
    }

    @Test
    void markLessonAsCompleted_shouldMarkCompleted_whenLessonAndUserFound() {
        Lesson lesson = new Lesson();
        lesson.setId(1);
        lesson.setCompleted(false);
        User user = new User();
        user.setId(100);

        LessonCompletionDTO dto = new LessonCompletionDTO();
        dto.setLessonId(1);

        when(lessonRepository.findById(1)).thenReturn(Optional.of(lesson));
        when(userRepository.findByAuth0UserId("auth0|123")).thenReturn(Optional.of(user));

        ResponseEntity<String> result = feedbackService.markLessonAsCompleted(dto, "auth0|123");

        assertTrue(lesson.isCompleted());
        verify(lessonRepository, times(1)).save(lesson);
        assertEquals("Lesson marked as completed", result.getBody());
    }

    @Test
    void markLessonAsCompleted_shouldReturnBadRequest_whenLessonNotFound() {
        LessonCompletionDTO dto = new LessonCompletionDTO();
        dto.setLessonId(1);

        when(lessonRepository.findById(1)).thenReturn(Optional.empty());
        when(userRepository.findByAuth0UserId("auth0|123")).thenReturn(Optional.of(new User()));

        ResponseEntity<String> result = feedbackService.markLessonAsCompleted(dto, "auth0|123");

        assertEquals(400, result.getStatusCodeValue());
        assertEquals("Lesson or User not found", result.getBody());
    }

    @Test
    void markLessonAsCompleted_shouldReturnBadRequest_whenUserNotFound() {
        LessonCompletionDTO dto = new LessonCompletionDTO();
        dto.setLessonId(1);

        when(lessonRepository.findById(1)).thenReturn(Optional.of(new Lesson()));
        when(userRepository.findByAuth0UserId("auth0|123")).thenReturn(Optional.empty());

        ResponseEntity<String> result = feedbackService.markLessonAsCompleted(dto, "auth0|123");

        assertEquals(400, result.getStatusCodeValue());
        assertEquals("Lesson or User not found", result.getBody());
    }

    @Test
    void checkFeedbackStatus_shouldReturnThankYou_whenFeedbackExists() {
        when(lessonFeedbackRepository.existsByLessonIdAndUserAuth0UserId(1, "auth0|123")).thenReturn(true);

        ResponseEntity<String> result = feedbackService.checkFeedbackStatus(1, "auth0|123");

        assertEquals("Thank you for your feedback!", result.getBody());
        assertEquals(200, result.getStatusCodeValue());
    }

    @Test
    void checkFeedbackStatus_shouldReturnNotGiven_whenFeedbackDoesNotExist() {
        when(lessonFeedbackRepository.existsByLessonIdAndUserAuth0UserId(1, "auth0|123")).thenReturn(false);

        ResponseEntity<String> result = feedbackService.checkFeedbackStatus(1, "auth0|123");

        assertEquals("Feedback not given", result.getBody());
        assertEquals(200, result.getStatusCodeValue());
    }
}
