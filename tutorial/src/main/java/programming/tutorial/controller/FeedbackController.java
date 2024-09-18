package programming.tutorial.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;
import programming.tutorial.dao.LessonFeedbackRepository;
import programming.tutorial.dao.LessonRepository;
import programming.tutorial.dao.UserRepository;
import programming.tutorial.domain.FeedbackRequest;
import programming.tutorial.domain.Lesson;
import programming.tutorial.domain.LessonFeedback;
import programming.tutorial.domain.User;
import programming.tutorial.dto.LessonFeedbackRequestDTO;

import java.util.Optional;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = "*")
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
        System.out.println("Lesson ID: " + feedbackDTO.getLessonId());
        System.out.println("User ID: " + feedbackDTO.getUserId());
        System.out.println("Feedback: " + feedbackDTO.getFeedback());

        // Save the feedback
        LessonFeedback lessonFeedback = new LessonFeedback();
        lessonFeedback.setLesson(lessonRepository.findById(feedbackDTO.getLessonId()).orElse(null));
        lessonFeedback.setUser(userRepository.findById(feedbackDTO.getUserId()).orElse(null));
        lessonFeedback.setFeedback(feedbackDTO.getFeedback());
        lessonFeedbackRepository.save(lessonFeedback);

        return ResponseEntity.ok("Feedback submitted successfully");
    }

    @GetMapping("/status")
    public ResponseEntity<String> checkFeedbackStatus(
            @RequestParam("lessonId") Integer lessonId,
            @RequestParam("userId") Integer userId) {

        System.out.println("Lesson ID: " + lessonId);
        System.out.println("User ID: " + userId);

        boolean hasGivenFeedback = lessonFeedbackRepository.existsByLessonIdAndUserId(lessonId, userId);
        return ResponseEntity.ok(hasGivenFeedback ? "Thank you for your feedback!" : "Feedback not given");
    }
}