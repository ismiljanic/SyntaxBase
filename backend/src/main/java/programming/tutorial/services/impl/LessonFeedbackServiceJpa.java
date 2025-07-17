package programming.tutorial.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import programming.tutorial.dao.LessonFeedbackRepository;
import programming.tutorial.dao.LessonRepository;
import programming.tutorial.dao.UserRepository;
import programming.tutorial.domain.FeedbackRequest;
import programming.tutorial.domain.Lesson;
import programming.tutorial.domain.LessonFeedback;
import programming.tutorial.domain.User;
import programming.tutorial.dto.LessonCompletionDTO;
import programming.tutorial.dto.LessonFeedbackRequestDTO;
import programming.tutorial.services.LessonFeedbackService;

import java.util.Optional;

@Service
public class LessonFeedbackServiceJpa implements LessonFeedbackService {

    @Autowired
    private JavaMailSender emailSender;
    @Autowired
    private LessonRepository lessonRepository;
    @Autowired
    private LessonFeedbackRepository lessonFeedbackRepository;
    @Autowired
    private UserRepository userRepository;

    @Override
    public String sendFeedbackEmail(FeedbackRequest feedbackRequest) {
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

    @Override
    public String receiveFeedback(LessonFeedbackRequestDTO feedbackRequest, Integer userId) {
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

    @Override
    public ResponseEntity<String> submitFeedback(LessonFeedbackRequestDTO feedbackDTO, String auth0UserId) {
        Lesson lesson = lessonRepository.findById(feedbackDTO.getLessonId())
                .orElseThrow(() -> new RuntimeException("Lesson not found with id: " + feedbackDTO.getLessonId()));

        User user = userRepository.findByAuth0UserId(auth0UserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LessonFeedback feedback = new LessonFeedback();
        feedback.setLesson(lesson);
        feedback.setUser(user);
        feedback.setFeedback(feedbackDTO.getFeedback());

        lessonFeedbackRepository.save(feedback);
        return ResponseEntity.ok("Feedback submitted successfully");
    }

    @Override
    public ResponseEntity<String> markLessonAsCompleted(LessonCompletionDTO completionDTO, String auth0UserId) {
        Lesson lesson = lessonRepository.findById(completionDTO.getLessonId()).orElse(null);
        User user = userRepository.findByAuth0UserId(auth0UserId).orElse(null);

        if (lesson == null || user == null) {
            return ResponseEntity.badRequest().body("Lesson or User not found");
        }

        lesson.setCompleted(true);
        lessonRepository.save(lesson);
        return ResponseEntity.ok("Lesson marked as completed");
    }

    @Override
    public ResponseEntity<String> checkFeedbackStatus(Integer lessonId, String auth0UserId) {
        boolean hasGivenFeedback = lessonFeedbackRepository.existsByLessonIdAndUserAuth0UserId(lessonId, auth0UserId);
        return ResponseEntity.ok(hasGivenFeedback ? "Thank you for your feedback!" : "Feedback not given");
    }
}
