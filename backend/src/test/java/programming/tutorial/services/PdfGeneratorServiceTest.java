package programming.tutorial.services;

import com.itextpdf.text.pdf.PdfReader;
import org.junit.jupiter.api.Test;
import programming.tutorial.services.impl.PdfGeneratorServiceJpa;

import java.io.File;
import java.time.LocalDate;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class PdfGeneratorServiceTest {

    private final PdfGeneratorServiceJpa service = new PdfGeneratorServiceJpa();

    @Test
    void generateCertificatePdf_createsValidPdf() throws Exception {
        String filePath = "target/test-certificate.pdf";
        String studentName = "John Doe";
        String courseTitle = "Spring Boot Mastery";
        String instructorName = "Ivan Smiljanic";
        LocalDate date = LocalDate.now();
        UUID certId = UUID.randomUUID();

        service.generateCertificatePdf(filePath, studentName, courseTitle, instructorName, date, certId);

        File pdfFile = new File(filePath);
        assertTrue(pdfFile.exists(), "PDF file should be created");
        assertTrue(pdfFile.length() > 0, "PDF file should not be empty");

        PdfReader reader = new PdfReader(filePath);
        String text = new String(reader.getPageContent(1));
        reader.close();

        assertTrue(text.contains(studentName), "PDF should contain student name");
        assertTrue(text.contains(courseTitle), "PDF should contain course title");
        assertTrue(text.contains(certId.toString()), "PDF should contain certificate ID");
    }
}
