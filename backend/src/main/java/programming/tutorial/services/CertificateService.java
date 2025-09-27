package programming.tutorial.services;

import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import programming.tutorial.domain.Certificate;
import programming.tutorial.domain.Course;
import programming.tutorial.domain.User;

import java.net.MalformedURLException;
import java.util.Optional;

public interface CertificateService {
    void generateAndSendCertificate(User user, Course course);

    Optional<Certificate> getCertificateForUser(String filename, String userId) throws MalformedURLException;
}
