package programming.tutorial.dao;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.cglib.core.Local;
import org.springframework.test.context.ActiveProfiles;
import programming.tutorial.domain.Certificate;
import programming.tutorial.domain.Course;
import programming.tutorial.domain.Tier;
import programming.tutorial.domain.User;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = Replace.ANY)
@ActiveProfiles("test")
class CertificateRepositoryTest {

    @Autowired
    private CertificateRepository certificateRepository;

    @Autowired
    private TestEntityManager entityManager;

    private UUID certificateId;
    private Course course;

    @BeforeEach
    void setup() {
        User user = new User();
        user.setAuth0UserId("auth0|12345");
        user.setName("Name");
        user.setSurname("Surname");
        user.setPassword("password");
        user.setUsername("Username");
        user.setDateCreated(LocalDateTime.now());
        user.setActive(true);
        user.setTier(Tier.FREE);
        entityManager.persist(user);

        course = new Course();
        entityManager.persist(course);
        entityManager.flush();

        Certificate cert = new Certificate();
        cert.setId(UUID.randomUUID());
        cert.setUser(user);
        cert.setCourse(course);
        cert.setIssuedAt(LocalDateTime.now());
        entityManager.persist(cert);
        entityManager.flush();

        certificateId = cert.getId();
        entityManager.flush();
    }

    @Test
    void testFindById() {
        Optional<Certificate> result = certificateRepository.findById(certificateId);
        assertThat(result).isPresent();
    }

    @Test
    void testFindByUserAuth0UserId() {
        List<Certificate> result = certificateRepository.findByUser_Auth0UserId("auth0|12345");
        assertThat(result).hasSize(1);
    }

    @Test
    void testExistsByUserAuth0UserIdAndCourseId() {
        boolean exists = certificateRepository.existsByUser_Auth0UserIdAndCourse_Id("auth0|12345", course.getId());
        assertThat(exists).isTrue();
    }
}