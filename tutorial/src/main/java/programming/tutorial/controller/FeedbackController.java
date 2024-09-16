package programming.tutorial.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;
import programming.tutorial.domain.FeedbackRequest;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = "*")
public class FeedbackController {

    @Autowired
    private JavaMailSender emailSender;

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
}
