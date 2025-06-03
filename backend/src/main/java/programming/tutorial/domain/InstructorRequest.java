package programming.tutorial.domain;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class InstructorRequest {
    @Id
    @GeneratedValue
    private Long id;
    @OneToOne
    private User user;
    private String institution;
    private String phone;
    private String address;
    private String credentials;
    private String email;

    @Enumerated(EnumType.STRING)
    private InstructorRequestStatus status; // PENDING, APPROVED, REJECTED

    private LocalDateTime requestDate;
    private LocalDateTime decisionDate;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getInstitution() {
        return institution;
    }

    public void setInstitution(String institution) {
        this.institution = institution;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCredentials() {
        return credentials;
    }

    public void setCredentials(String credentials) {
        this.credentials = credentials;
    }

    public InstructorRequestStatus getStatus() {
        return status;
    }

    public void setStatus(InstructorRequestStatus status) {
        this.status = status;
    }

    public LocalDateTime getRequestDate() {
        return requestDate;
    }

    public void setRequestDate(LocalDateTime requestDate) {
        this.requestDate = requestDate;
    }

    public LocalDateTime getDecisionDate() {
        return decisionDate;
    }

    public void setDecisionDate(LocalDateTime decisionDate) {
        this.decisionDate = decisionDate;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}