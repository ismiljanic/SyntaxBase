package programming.tutorial.services.impl;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import programming.tutorial.dao.UserRepository;
import programming.tutorial.domain.ContactForm;
import programming.tutorial.domain.User;
import programming.tutorial.services.EmailService;

import java.io.File;

@Service
public class EmailServiceJpa implements EmailService {

    private final JavaMailSender emailSender;

    @Autowired
    private UserRepository userRepository;

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

    public void sendApprovalEmail(String toEmail, String name) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Instructor Request Approved");
        message.setText("Dear " + name + ",\n\n" +
                "Congratulations! Your request to become an instructor has been approved.\n" +
                "You can now start creating content on our platform.\n\n" +
                "Best regards,\nSyntaxBase Team");

        emailSender.send(message);
    }

    public void sendRoleChangeNotification(String toEmail, String newRole, String name) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Your User Role Has Been Updated");
        message.setText("Dear " + name + ",\n\n" +
                "Your role has been changed to: " + newRole + ".\n" +
                "If you have any questions, please contact support.\n\n" +
                "Best regards,\n" +
                "SyntaxBase Team");

        emailSender.send(message);
    }

    @Override
    public void sendCourseInviteEmail(String toEmail, String inviterName, String courseName, String inviteLink) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("You're invited to join the course: " + courseName);
        message.setText("Hello,\n\n" +
                inviterName + " has invited you to join the course \"" + courseName + "\".\n" +
                "Click the link below to accept the invitation and enroll:\n" +
                inviteLink + "\n\n" +
                "This link expires in 7 days.\n\n" +
                "Best regards,\nSyntaxBase Team");
        emailSender.send(message);
    }

    @Override
    public void sendCertificate(String username, String filePath) {
        User user = userRepository.findByUsername(username);

        try {
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(user.getUsername());
            helper.setSubject("Your Course Completion Certificate");
            helper.setText("Dear " + user.getName() + ",\n\nCongratulations on completing the course! Your certificate is attached.\n\nBest regards,\n SyntaxBase Team");

            FileSystemResource file = new FileSystemResource(new File(filePath));
            helper.addAttachment("certificate.pdf", file);

            emailSender.send(message);

            System.out.println("Certificate sent to " + user.getUsername());
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send certificate email", e);
        }
    }
}
