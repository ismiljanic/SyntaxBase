package programming.tutorial.services;

import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.util.ReflectionTestUtils;
import programming.tutorial.dao.UserRepository;
import programming.tutorial.domain.ContactForm;
import programming.tutorial.domain.User;
import programming.tutorial.services.impl.EmailServiceJpa;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmailServiceTest {
    @Mock
    private JavaMailSender emailSender;
    @Mock
    private UserRepository userRepository;
    @InjectMocks
    private EmailServiceJpa emailServiceJpa;

    @BeforeEach
    void setup() {
        emailServiceJpa = new EmailServiceJpa(emailSender);
        ReflectionTestUtils.setField(emailServiceJpa, "userRepository", userRepository);
    }


    @Test
    void sendContactEmail_shouldSendEmail() {
        ContactForm form = new ContactForm();
        form.setName("John");
        form.setSurname("Doe");
        form.setPhone("1234567890");
        form.setEmail("john@example.com");
        form.setUsername("johndoe");
        form.setMessage("Hello!");

        doNothing().when(emailSender).send(any(SimpleMailMessage.class));

        emailServiceJpa.sendContactEmail(form);

        verify(emailSender, times(1)).send(any(SimpleMailMessage.class));
    }

    @Test
    void sendApprovalEmail_shouldSendEmail() {
        doNothing().when(emailSender).send(any(SimpleMailMessage.class));

        emailServiceJpa.sendApprovalEmail("user@example.com", "John Doe");

        verify(emailSender, times(1)).send(any(SimpleMailMessage.class));
    }

    @Test
    void sendRoleChangeNotification_shouldSendEmail() {
        doNothing().when(emailSender).send(any(SimpleMailMessage.class));

        emailServiceJpa.sendRoleChangeNotification("user@example.com", "INSTRUCTOR", "John Doe");

        verify(emailSender, times(1)).send(any(SimpleMailMessage.class));
    }

    @Test
    void sendCourseInviteEmail_shouldSendEmail() {
        doNothing().when(emailSender).send(any(SimpleMailMessage.class));

        emailServiceJpa.sendCourseInviteEmail("user@example.com", "Jane", "Java 101", "http://invite.link");

        verify(emailSender, times(1)).send(any(SimpleMailMessage.class));
    }

    @Test
    void sendCertificate_shouldSendMimeMessage() throws Exception {
        User user = new User();
        user.setUsername("user@example.com");
        user.setName("John Doe");

        when(userRepository.findByUsername("user@example.com")).thenReturn(user);

        MimeMessage mimeMessage = mock(MimeMessage.class);
        when(emailSender.createMimeMessage()).thenReturn(mimeMessage);

        doNothing().when(emailSender).send(mimeMessage);

        emailServiceJpa.sendCertificate("user@example.com", "src/test/resources/certificate.pdf");

        verify(emailSender, times(1)).send(mimeMessage);
    }
}