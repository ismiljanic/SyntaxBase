package programming.tutorial.services;

import org.springframework.stereotype.Service;
import programming.tutorial.domain.Course;
import programming.tutorial.domain.User;

@Service
public interface CertificateService {
    void generateAndSendCertificate(User user, Course course);
}
