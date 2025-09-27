package programming.tutorial.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class CertificateDTO {
    private UUID id;
    private String courseName;
    private String instructorName;
    private LocalDateTime issuedAt;
    private String fileUrl;

    public CertificateDTO() {
    }

    public CertificateDTO(UUID id, String courseName, String instructorName, LocalDateTime issuedAt, String fileUrl) {
        this.id = id;
        this.courseName = courseName;
        this.instructorName = instructorName;
        this.issuedAt = issuedAt;
        this.fileUrl = fileUrl;
    }

    public CertificateDTO(UUID id, String courseName, LocalDateTime issuedAt, String fileUrl) {
        this.id = id;
        this.courseName = courseName;
        this.issuedAt = issuedAt;
        this.fileUrl = fileUrl;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public String getInstructorName() {
        return instructorName;
    }

    public void setInstructorName(String instructorName) {
        this.instructorName = instructorName;
    }

    public LocalDateTime getIssuedAt() {
        return issuedAt;
    }

    public void setIssuedAt(LocalDateTime issuedAt) {
        this.issuedAt = issuedAt;
    }

    public String getFileUrl() {
        return fileUrl;
    }

    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
    }
}