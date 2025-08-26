package programming.tutorial.services.impl;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfContentByte;
import com.itextpdf.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;
import programming.tutorial.services.PdfGeneratorService;
import java.io.FileOutputStream;
import java.time.LocalDate;
import java.util.UUID;

@Service
public class PdfGeneratorServiceJpa implements PdfGeneratorService {

    @Override
    public void generateCertificatePdf(String filePath, String studentName, String courseTitle,
                                       String instructorName, LocalDate date, UUID certId) {
        Document doc = new Document(PageSize.A4);

        try {
            PdfWriter writer = PdfWriter.getInstance(doc, new FileOutputStream(filePath));
            doc.open();

            PdfContentByte canvas = writer.getDirectContent();

            canvas.setLineWidth(2f);
            canvas.rectangle(36, 36, doc.getPageSize().getWidth() - 72, doc.getPageSize().getHeight() - 72);
            canvas.stroke();

            Font titleFont = new Font(Font.FontFamily.TIMES_ROMAN, 30, Font.BOLD, BaseColor.DARK_GRAY);
            Paragraph title = new Paragraph("Certificate of Completion", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingBefore(100);
            doc.add(title);

            Font bodyFont = new Font(Font.FontFamily.TIMES_ROMAN, 14, Font.NORMAL);
            Paragraph body = new Paragraph(
                    "This certifies that\n\n" + studentName + "\n\n" +
                            "has successfully completed the course\n\n" + "\"" + courseTitle + "\"", bodyFont);
            body.setAlignment(Element.ALIGN_CENTER);
            body.setSpacingBefore(50);
            doc.add(body);

            Font smallFont = new Font(Font.FontFamily.TIMES_ROMAN, 12, Font.ITALIC);
            Paragraph instructorPara = new Paragraph(" Instructor: " + "Ivan Smiljanic", smallFont);
            instructorPara.setAlignment(Element.ALIGN_LEFT);
            instructorPara.setSpacingBefore(80);
            doc.add(instructorPara);

            Paragraph datePara = new Paragraph(" Date: " + date.toString(), smallFont);
            datePara.setAlignment(Element.ALIGN_LEFT);
            doc.add(datePara);

            Paragraph certPara = new Paragraph("Certificate ID: " + certId.toString(), new Font(Font.FontFamily.COURIER, 10));
            certPara.setAlignment(Element.ALIGN_CENTER);
            doc.add(certPara);

        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF certificate", e);
        } finally {
            doc.close();
        }
    }
}