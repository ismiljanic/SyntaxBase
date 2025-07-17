package programming.tutorial.services;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.UUID;

@Service
public interface PdfGeneratorService {
    void generateCertificatePdf(String filePath, String studentName, String courseTitle, String instructorName, LocalDate date, UUID certId);

}
