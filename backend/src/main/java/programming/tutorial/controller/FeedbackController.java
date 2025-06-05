package programming.tutorial.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import programming.tutorial.domain.FeedbackRequest;
import programming.tutorial.dto.LessonCompletionDTO;
import programming.tutorial.dto.LessonFeedbackRequestDTO;
import programming.tutorial.services.LessonFeedbackService;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = "http://localhost:3000")
public class FeedbackController {

    @Autowired
    private LessonFeedbackService feedbackService;

    @PostMapping("/email")
    public String sendFeedback(@RequestBody FeedbackRequest feedbackRequest) {
        return feedbackService.sendFeedbackEmail(feedbackRequest);
    }

    @PostMapping("/receiveFeedback")
    public String receiveFeedback(@RequestBody LessonFeedbackRequestDTO feedbackRequest, @RequestParam Integer userId) {
        return feedbackService.receiveFeedback(feedbackRequest, userId);
    }

    @PostMapping("/submit")
    public ResponseEntity<String> submitFeedback(@RequestBody LessonFeedbackRequestDTO feedbackDTO) {
        String auth0UserId = SecurityContextHolder.getContext().getAuthentication().getName();
        return feedbackService.submitFeedback(feedbackDTO, auth0UserId);
    }

    @PostMapping("/complete")
    public ResponseEntity<String> markLessonAsCompleted(@RequestBody LessonCompletionDTO completionDTO) {
        String auth0UserId = SecurityContextHolder.getContext().getAuthentication().getName();
        return feedbackService.markLessonAsCompleted(completionDTO, auth0UserId);
    }

    @GetMapping("/status")
    public ResponseEntity<String> checkFeedbackStatus(@RequestParam("lessonId") Integer lessonId) {
        String auth0UserId = SecurityContextHolder.getContext().getAuthentication().getName();
        return feedbackService.checkFeedbackStatus(lessonId, auth0UserId);
    }
}