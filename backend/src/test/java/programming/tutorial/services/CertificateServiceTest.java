package programming.tutorial.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import programming.tutorial.dao.CertificateRepository;
import programming.tutorial.domain.Certificate;
import programming.tutorial.domain.Course;
import programming.tutorial.domain.User;
import programming.tutorial.services.impl.CertificateServiceJpa;

import java.time.LocalDate;
import java.util.UUID;

import static org.mockito.Mockito.*;

class CertificateServiceTest {

    @Mock
    private CertificateRepository certificateRepository;

    @Mock
    private EmailService emailService;

    @Mock
    private PdfGeneratorService pdfGenerator;

    @InjectMocks
    private CertificateServiceJpa certificateServiceJpa;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void generateAndSendCertificate_shouldGeneratePdfSaveCertificateAndSendEmail() {
        User user = new User();
        user.setId(1);
        user.setName("John Doe");
        user.setUsername("john@example.com");

        User instructor = new User();
        instructor.setName("Jane Instructor");

        Course course = new Course();
        course.setId(1);
        course.setCourseName("Java 101");
        course.setCreator(instructor);

        certificateServiceJpa.generateAndSendCertificate(user, course);

        verify(pdfGenerator, times(1)).generateCertificatePdf(
                anyString(), eq(user.getName()), eq(course.getCourseName()), eq(instructor.getName()), eq(LocalDate.now()), any(UUID.class)
        );

        ArgumentCaptor<Certificate> certCaptor = ArgumentCaptor.forClass(Certificate.class);
        verify(certificateRepository, times(1)).save(certCaptor.capture());
        Certificate savedCert = certCaptor.getValue();
        assert savedCert.getUser() == user;
        assert savedCert.getCourse() == course;
        assert savedCert.getInstructorName().equals(instructor.getName());

        verify(emailService, times(1)).sendCertificate(eq(user.getUsername()), anyString());
    }
}