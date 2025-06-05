package programming.tutorial.services;

import org.springframework.stereotype.Service;
import programming.tutorial.dto.LessonCompletionDTO;
import programming.tutorial.dto.LessonFeedbackRequestDTO;
import programming.tutorial.domain.FeedbackRequest;
import org.springframework.http.ResponseEntity;

@Service
public interface LessonFeedbackService {
    String sendFeedbackEmail(FeedbackRequest feedbackRequest);
    String receiveFeedback(LessonFeedbackRequestDTO feedbackRequest, Integer userId);
    ResponseEntity<String> submitFeedback(LessonFeedbackRequestDTO feedbackDTO, String auth0UserId);
    ResponseEntity<String> markLessonAsCompleted(LessonCompletionDTO completionDTO, String auth0UserId);
    ResponseEntity<String> checkFeedbackStatus(Integer lessonId, String auth0UserId);
}
