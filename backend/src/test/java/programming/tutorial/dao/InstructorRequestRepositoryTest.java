package programming.tutorial.dao;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;
import programming.tutorial.domain.InstructorRequest;
import programming.tutorial.domain.InstructorRequestStatus;
import programming.tutorial.domain.User;
import programming.tutorial.domain.Tier;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = Replace.ANY)
@ActiveProfiles("test")
class InstructorRequestRepositoryTest {

    @Autowired
    private InstructorRequestRepository instructorRequestRepository;

    @Autowired
    private TestEntityManager entityManager;

    private User user;
    private InstructorRequest request1;
    private InstructorRequest request2;

    @BeforeEach
    void setup() {
        user = new User();
        user.setAuth0UserId("auth0|reqtest");
        user.setUsername("reqUser");
        user.setPassword("password");
        user.setName("Request");
        user.setSurname("Tester");
        user.setActive(true);
        user.setTier(Tier.FREE);
        user.setDateCreated(LocalDateTime.now());
        entityManager.persist(user);

        request1 = new InstructorRequest();
        request1.setUser(user);
        request1.setStatus(InstructorRequestStatus.PENDING);
        request1.setRequestDate(LocalDateTime.now().minusDays(2));
        entityManager.persist(request1);

        request2 = new InstructorRequest();
        request2.setUser(user);
        request2.setStatus(InstructorRequestStatus.APPROVED);
        request2.setRequestDate(LocalDateTime.now());
        entityManager.persist(request2);

        entityManager.flush();
    }

    @Test
    void testExistsByUserAndStatus() {
        boolean exists = instructorRequestRepository.existsByUserAndStatus(user, InstructorRequestStatus.PENDING);
        assertThat(exists).isTrue();

        boolean notExists = instructorRequestRepository.existsByUserAndStatus(user, InstructorRequestStatus.REJECTED);
        assertThat(notExists).isFalse();
    }

    @Test
    void testFindByStatus() {
        List<InstructorRequest> approved = instructorRequestRepository.findByStatus(InstructorRequestStatus.APPROVED);
        assertThat(approved).hasSize(1);
        assertThat(approved.get(0).getUser().getUsername()).isEqualTo("reqUser");
    }

    @Test
    void testFindFirstByUserOrderByRequestDateDesc() {
        Optional<InstructorRequest> latest = instructorRequestRepository.findFirstByUserOrderByRequestDateDesc(user);
        assertThat(latest).isPresent();
        assertThat(latest.get().getStatus()).isEqualTo(InstructorRequestStatus.APPROVED);
    }
}