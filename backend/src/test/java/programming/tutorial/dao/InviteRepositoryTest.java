package programming.tutorial.dao;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;
import programming.tutorial.domain.CourseInviteToken;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = Replace.ANY)
@ActiveProfiles("test")
class InviteRepositoryTest {

    @Autowired
    private InviteRepository inviteRepository;

    @Autowired
    private TestEntityManager entityManager;

    private CourseInviteToken inviteToken;

    @BeforeEach
    void setup() {
        inviteToken = new CourseInviteToken();
        inviteToken.setToken("abc123");
        inviteToken.setExpiresAt(LocalDateTime.now().plusDays(1));
        entityManager.persist(inviteToken);
        entityManager.flush();
    }

    @Test
    void testFindByToken_existingToken() {
        Optional<CourseInviteToken> result = inviteRepository.findByToken("abc123");
        assertThat(result).isPresent();
        assertThat(result.get().getToken()).isEqualTo("abc123");
    }

    @Test
    void testFindByToken_nonExistingToken() {
        Optional<CourseInviteToken> result = inviteRepository.findByToken("does-not-exist");
        assertThat(result).isNotPresent();
    }
}