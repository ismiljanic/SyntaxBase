package programming.tutorial.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import programming.tutorial.dao.LessonFeedbackRepository;
import programming.tutorial.dao.LessonRepository;
import programming.tutorial.dao.UserRepository;
import programming.tutorial.domain.FeedbackRequest;
import programming.tutorial.domain.Lesson;
import programming.tutorial.domain.LessonFeedback;
import programming.tutorial.domain.User;
import programming.tutorial.dto.LessonCompletionDTO;
import programming.tutorial.dto.LessonFeedbackRequestDTO;

import java.util.Optional;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = "http://localhost:3000")
public class FeedbackController {

    @Autowired
    private JavaMailSender emailSender;
    @Autowired
    private LessonRepository lessonRepository;
    @Autowired
    private LessonFeedbackRepository lessonFeedbackRepository;
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/email")
    public String sendFeedback(@RequestBody FeedbackRequest feedbackRequest) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(feedbackRequest.getEmail());
            message.setTo("SyntaxBaseDev@gmail.com");
            message.setSubject("New Feedback Received");
            message.setText("Feedback from " + feedbackRequest.getEmail() + ":\n\n" + feedbackRequest.getMessage());
            emailSender.send(message);
            return "Feedback submitted successfully!";
        } catch (Exception e) {
            e.printStackTrace();
            return "Failed to submit feedback. Please try again.";
        }
    }

    @PostMapping("/receiveFeedback")
    public String receiveFeedback(@RequestBody LessonFeedbackRequestDTO feedbackRequest, @RequestParam Integer userId) {
        Lesson lesson = lessonRepository.findById(feedbackRequest.getLessonId())
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<LessonFeedback> existingFeedback = lessonFeedbackRepository.findByLessonAndUser(lesson, user);
        if (existingFeedback.isPresent()) {
            return "Feedback already provided for this lesson by the user.";
        }

        LessonFeedback feedback = new LessonFeedback(lesson, user, feedbackRequest.getFeedback());
        lessonFeedbackRepository.save(feedback);

        return "Feedback received!";
    }

    @PostMapping("/submit")
    public ResponseEntity<String> submitFeedback(@RequestBody LessonFeedbackRequestDTO feedbackDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String auth0UserId = authentication.getName();

        System.out.println("Lesson ID: " + feedbackDTO.getLessonId());
        System.out.println("Auth0 User ID: " + auth0UserId);
        System.out.println("Feedback: " + feedbackDTO.getFeedback());

        LessonFeedback lessonFeedback = new LessonFeedback();
        lessonFeedback.setLesson(lessonRepository.findById(feedbackDTO.getLessonId()).orElse(null));

        User user = userRepository.findByAuth0UserId(auth0UserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        lessonFeedback.setUser(user);
        lessonFeedback.setFeedback(feedbackDTO.getFeedback());
        lessonFeedbackRepository.save(lessonFeedback);

        return ResponseEntity.ok("Feedback submitted successfully");
    }

    @PostMapping("/complete")
    public ResponseEntity<String> markLessonAsCompleted(@RequestBody LessonCompletionDTO completionDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String auth0UserId = authentication.getName();

        Lesson lesson = lessonRepository.findById(completionDTO.getLessonId()).orElse(null);
        User user = userRepository.findByAuth0UserId(auth0UserId)
                .orElse(null);

        if (lesson == null || user == null) {
            return ResponseEntity.badRequest().body("Lesson or User not found");
        }

        lesson.setCompleted(true);
        lessonRepository.save(lesson);

        return ResponseEntity.ok("Lesson marked as completed");
    }


    @GetMapping("/status")
    public ResponseEntity<String> checkFeedbackStatus(
            @RequestParam("lessonId") Integer lessonId) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String auth0UserId = authentication.getName();

        boolean hasGivenFeedback = lessonFeedbackRepository.existsByLessonIdAndUserAuth0UserId(lessonId, auth0UserId);
        return ResponseEntity.ok(hasGivenFeedback ? "Thank you for your feedback!" : "Feedback not given");
    }
}