package programming.tutorial.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import programming.tutorial.domain.User;

public interface UserRepository extends JpaRepository<User, Integer> {
    User findByUsername(String username);
}
