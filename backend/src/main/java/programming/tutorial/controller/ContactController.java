package programming.tutorial.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import programming.tutorial.domain.ContactForm;
import programming.tutorial.services.EmailService;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ContactController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/email")
    public String handleContactForm(@RequestBody ContactForm contactForm) {
        try {
            emailService.sendContactEmail(contactForm);
            return "Feedback submitted successfully!";
        } catch (Exception e) {
            e.printStackTrace();
            return "Failed to submit feedback. Please try again.";
        }
    }
}
