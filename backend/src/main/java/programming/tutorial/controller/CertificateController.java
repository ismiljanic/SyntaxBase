package programming.tutorial.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import programming.tutorial.domain.Certificate;
import programming.tutorial.services.CertificateService;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;

@RestController
@RequestMapping("/api/certificates")
public class CertificateController {

    @Autowired
    private CertificateService certificateService;

    @Value("${certificates.storage.path}")
    private String storagePath;


    @GetMapping("/{filename}")
    public ResponseEntity<Resource> getCertificate(@PathVariable String filename,
                                                   @AuthenticationPrincipal Jwt principal) throws Exception {
        String userId = principal.getSubject();

        Optional<Certificate> certificateOpt = certificateService.getCertificateForUser(filename, userId);

        if (certificateOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Certificate certificate = certificateOpt.get();

        if (!certificate.getUser().getAuth0UserId().equals(userId)) {
            return ResponseEntity.status(403).build();
        }

        Path filePath = Paths.get(storagePath).resolve(filename).normalize();
        Resource resource = new UrlResource(filePath.toUri());

        if (!resource.exists() || !resource.isReadable()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .body(resource);
    }
}