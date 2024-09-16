package programming.tutorial.services.impl;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import programming.tutorial.domain.ContactForm;
import programming.tutorial.services.EmailService;

@Service
public class EmailServiceJpa implements EmailService {

    private JavaMailSender emailSender;

    public void EmailService(JavaMailSender emailSender) {
        this.emailSender = emailSender;
    }

    public EmailServiceJpa(JavaMailSender emailSender) {
        this.emailSender = emailSender;
    }

    public void sendContactEmail(ContactForm contactForm) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo("SyntaxBaseDev@gmail.com");
        message.setSubject("Contact Form Submission");
        message.setText(
                "Name: " + contactForm.getName() + "\n" +
                        "Surname: " + contactForm.getSurname() + "\n" +
                        "Phone: " + contactForm.getPhone() + "\n" +
                        "Email: " + contactForm.getEmail() + "\n" +
                        "Username: " + contactForm.getUsername() + "\n" +
                        "Feedback: " + contactForm.getMessage()
        );
        emailSender.send(message);
    }
}
