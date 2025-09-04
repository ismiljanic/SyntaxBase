package programming.tutorial.controller;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import programming.tutorial.dao.CertificateRepository;
import programming.tutorial.domain.Certificate;
import programming.tutorial.domain.User;
import programming.tutorial.domain.Course;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CertificateController.class)
class CertificateControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private CertificateController certificateController;

    @MockBean
    private CertificateRepository certificateRepository;

    private Certificate certificate;
    private User user;
    private Course course;
    private UUID certId;

    @TempDir
    Path tempDir;

    @BeforeEach
    void setUp() throws Exception {
        certId = UUID.randomUUID();
        user = new User();
        user.setAuth0UserId("user-123");
        user.setName("Test");
        user.setUsername("testuser");

        course = new Course();
        course.setCourseName("Test Course");

        certificate = new Certificate();
        certificate.setId(certId);
        certificate.setUser(user);
        certificate.setCourse(course);
        certificate.setIssuedAt(LocalDateTime.now());
        certificate.setFileUrl("certificate-" + certId + ".pdf");

        ReflectionTestUtils.setField(certificateController, "storagePath", tempDir.toString());

        Files.createFile(tempDir.resolve(certificate.getFileUrl()));
    }

    @Test
    void getCertificate_success() throws Exception {
        when(certificateRepository.findAll()).thenReturn(List.of(certificate));

        mockMvc.perform(get("/api/certificates/{filename}", certificate.getFileUrl())
                        .with(jwt().jwt(token -> token.claim("sub", "user-123"))))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_PDF));
    }

    @Test
    void getCertificate_notFound() throws Exception {
        when(certificateRepository.findAll()).thenReturn(List.of());

        mockMvc.perform(get("/api/certificates/{filename}", "nonexistent.pdf")
                        .with(jwt().jwt(token -> token.claim("sub", "user-123"))))
                .andExpect(status().isNotFound());
    }

    @Test
    void getCertificate_forbidden() throws Exception {
        when(certificateRepository.findAll()).thenReturn(List.of(certificate));

        mockMvc.perform(get("/api/certificates/{filename}", certificate.getFileUrl())
                        .with(jwt().jwt(token -> token.claim("sub", "different-user"))))
                .andExpect(status().isForbidden());
    }

    @Test
    void getCertificate_fileNotReadable() throws Exception {
        certificate.setFileUrl("nonexistent-file.pdf");
        when(certificateRepository.findAll()).thenReturn(List.of(certificate));

        mockMvc.perform(get("/api/certificates/{filename}", certificate.getFileUrl())
                        .with(jwt().jwt(token -> token.claim("sub", "user-123"))))
                .andExpect(status().isNotFound());
    }
}