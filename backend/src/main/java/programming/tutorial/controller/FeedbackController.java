package programming.tutorial.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
    public ResponseEntity<String> sendFeedback(@RequestBody FeedbackRequest feedbackRequest) {
        try {
            String result = feedbackService.sendFeedbackEmail(feedbackRequest);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("/receiveFeedback")
    public ResponseEntity<String> receiveFeedback(@RequestBody LessonFeedbackRequestDTO feedbackRequest,
                                                  @RequestParam Integer userId) {
        try {
            String result = feedbackService.receiveFeedback(feedbackRequest, userId);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/submit")
    public ResponseEntity<String> submitFeedback(@RequestBody LessonFeedbackRequestDTO feedbackDTO) {
        String auth0UserId = SecurityContextHolder.getContext().getAuthentication().getName();
        return feedbackService.submitFeedback(feedbackDTO, auth0UserId);
    }

    @PostMapping("/complete")
    public ResponseEntity<String> markLessonAsCompleted(@RequestBody LessonCompletionDTO completionDTO) {
        System.out.println("Received lessonId: " + completionDTO.getLessonId());
        String auth0UserId = SecurityContextHolder.getContext().getAuthentication().getName();
        return feedbackService.markLessonAsCompleted(completionDTO, auth0UserId);
    }

    @GetMapping("/status")
    public ResponseEntity<String> checkFeedbackStatus(@RequestParam("lessonId") Integer lessonId) {
        String auth0UserId = SecurityContextHolder.getContext().getAuthentication().getName();
        return feedbackService.checkFeedbackStatus(lessonId, auth0UserId);
    }
}