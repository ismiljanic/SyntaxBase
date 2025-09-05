package programming.tutorial.services;

import org.springframework.stereotype.Service;
import programming.tutorial.domain.ContactForm;
public interface EmailService {
    void sendContactEmail(ContactForm contactForm);
    void sendApprovalEmail(String toEmail, String name);
    void sendRoleChangeNotification(String toEmail, String newRole, String name);
    void sendCourseInviteEmail(String toEmail, String inviterName, String courseName, String inviteLink);
    void sendCertificate(String username, String filePath);
}
