package programming.tutorial.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import programming.tutorial.dao.CertificateRepository;
import programming.tutorial.domain.Certificate;
import programming.tutorial.domain.Course;
import programming.tutorial.domain.User;
import programming.tutorial.services.CertificateService;
import programming.tutorial.services.EmailService;
import programming.tutorial.services.PdfGeneratorService;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class CertificateServiceJpa implements CertificateService {

    @Autowired
    private CertificateRepository certificateRepository;
    @Autowired
    private EmailService emailService;
    @Autowired
    private PdfGeneratorService pdfGenerator;

    @Value("${certificates.storage.path}")
    private String storagePath;

    @Override
    public void generateAndSendCertificate(User user, Course course) {
        UUID certId = UUID.randomUUID();
        String fileName = "certificate-" + certId + ".pdf";
        String filePath = storagePath + "/" + fileName;

        String instructor = course.getCreator().getName();

        pdfGenerator.generateCertificatePdf(filePath, user.getName(), course.getCourseName(), instructor, LocalDate.now(), certId);

        Certificate cert = new Certificate();
        cert.setId(certId);
        cert.setUser(user);
        cert.setCourse(course);
        cert.setInstructorName(instructor);
        cert.setIssuedAt(LocalDateTime.now());
        cert.setFileUrl(filePath);

        certificateRepository.save(cert);

        emailService.sendCertificate(user.getUsername(), filePath);
    }
}
