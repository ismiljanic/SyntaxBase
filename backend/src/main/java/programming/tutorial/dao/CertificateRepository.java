package programming.tutorial.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import programming.tutorial.domain.Certificate;
import programming.tutorial.domain.User;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, UUID> {
    Optional<Certificate> findById(UUID id);
    List<Certificate> findByUser_Auth0UserId(String auth0UserId);
    boolean existsByUser_Auth0UserIdAndCourse_Id(String auth0UserId, Integer courseId);
}
