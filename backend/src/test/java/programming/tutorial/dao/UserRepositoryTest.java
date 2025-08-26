package programming.tutorial.dao;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;
import programming.tutorial.domain.User;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = Replace.ANY)
@ActiveProfiles("test")
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TestEntityManager entityManager;

    private User user;

    @BeforeEach
    void setup() {
        user = new User();
        user.setAuth0UserId("auth0|123");
        user.setName("John");
        user.setSurname("Doe");
        user.setPassword("password");
        user.setUsername("johndoe");
        user.setDateCreated(LocalDateTime.now());
        user.setActive(true);

        entityManager.persist(user);
        entityManager.flush();
    }

    @Test
    void testFindByUsername_returnsUser() {
        User found = userRepository.findByUsername("johndoe");
        assertThat(found).isNotNull();
        assertThat(found.getAuth0UserId()).isEqualTo("auth0|123");
    }

    @Test
    void testFindByAuth0UserId_returnsOptionalUser() {
        Optional<User> optionalUser = userRepository.findByAuth0UserId("auth0|123");
        assertThat(optionalUser).isPresent();
        assertThat(optionalUser.get().getUsername()).isEqualTo("johndoe");
    }

    @Test
    void testFindByAuth0UserId_returnsEmptyForNonExistentUser() {
        Optional<User> optionalUser = userRepository.findByAuth0UserId("auth0|nonexistent");
        assertThat(optionalUser).isEmpty();
    }
}