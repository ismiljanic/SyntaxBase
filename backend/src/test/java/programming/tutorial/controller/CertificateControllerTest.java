package programming.tutorial.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import programming.tutorial.domain.Certificate;
import programming.tutorial.domain.User;
import programming.tutorial.services.CertificateService;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CertificateController.class)
class CertificateControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CertificateService certificateService;

    private User user;
    private Certificate certificate;

    @TempDir
    static Path tempDir;

    private String storagePath;

    @DynamicPropertySource
    static void overrideProps(org.springframework.test.context.DynamicPropertyRegistry registry) {
        registry.add("certificates.storage.path", () -> tempDir.toString());
    }

    @BeforeEach
    void setUp() throws Exception {
        user = new User();
        user.setAuth0UserId("user-123");

        Path pdfFile = tempDir.resolve("certificate.pdf");
        Files.writeString(pdfFile, "dummy content");

        certificate = new Certificate();
        certificate.setUser(user);
        certificate.setFileUrl(pdfFile.toString());

        when(certificateService.getCertificateForUser("certificate.pdf", "user-123"))
                .thenReturn(Optional.of(certificate));
    }

    @Test
    void getCertificate_success() throws Exception {
        mockMvc.perform(get("/api/certificates/{filename}", "certificate.pdf")
                        .with(jwt().jwt(token -> token.claim("sub", "user-123"))))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_PDF));
    }

    @Test
    void getCertificate_notFoundInDb() throws Exception {
        String filename = "missing.pdf";
        when(certificateService.getCertificateForUser(filename, "user-123"))
                .thenReturn(Optional.empty());

        mockMvc.perform(get("/api/certificates/{filename}", filename)
                        .with(jwt().jwt(jwt -> jwt.claim("sub", "user-123"))))
                .andExpect(status().isNotFound());
    }

    @Test
    void getCertificate_forbiddenWhenDifferentUser() throws Exception {
        String filename = "certificate.pdf";
        certificate.setFileUrl(tempDir.resolve(filename).toString());

        User otherUser = new User();
        otherUser.setAuth0UserId("other-999");
        certificate.setUser(otherUser);

        when(certificateService.getCertificateForUser(filename, "user-123"))
                .thenReturn(Optional.of(certificate));

        mockMvc.perform(get("/api/certificates/{filename}", filename)
                        .with(jwt().jwt(jwt -> jwt.claim("sub", "user-123"))))
                .andExpect(status().isForbidden());
    }

    @Test
    void getCertificate_fileMissingOnDisk() throws Exception {
        String filename = "ghost.pdf";
        Path filePath = tempDir.resolve(filename);
        certificate.setFileUrl(filePath.toString());

        when(certificateService.getCertificateForUser(filename, "user-123"))
                .thenReturn(Optional.of(certificate));
        certificate.setUser(user);

        mockMvc.perform(get("/api/certificates/{filename}", filename)
                        .with(jwt().jwt(jwt -> jwt.claim("sub", "user-123"))))
                .andExpect(status().isNotFound());
    }
}