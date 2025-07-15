package programming.tutorial.services.impl;

import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;
import programming.tutorial.services.PdfGeneratorService;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.time.LocalDate;
import java.util.UUID;

@Service
public class PdfGeneratorServiceJpa implements PdfGeneratorService {

    @Override
    public void generateCertificatePdf(String filePath, String studentName, String courseTitle, String instructorName, LocalDate date, UUID certId) {
        Document doc = new Document();

        try {
            PdfWriter.getInstance(doc, new FileOutputStream(filePath));
            doc.open();
            doc.add(new Paragraph("Certificate of Completion"));
            doc.add(new Paragraph(" "));
            doc.add(new Paragraph("This certifies that " + studentName));
            doc.add(new Paragraph("has successfully completed the course: " + courseTitle));
            doc.add(new Paragraph(" "));
            doc.add(new Paragraph("Instructor: " + instructorName));
            doc.add(new Paragraph("Date: " + date.toString()));
            doc.add(new Paragraph("Certificate ID: " + certId));
        } catch (DocumentException | FileNotFoundException e) {
            throw new RuntimeException("Failed to generate PDF certificate", e);
        } finally {
            doc.close();
        }
    }
}
