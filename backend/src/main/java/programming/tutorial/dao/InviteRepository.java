package programming.tutorial.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import programming.tutorial.domain.CourseInviteToken;
import java.util.Optional;

@Repository
public interface InviteRepository extends JpaRepository<CourseInviteToken, Long> {
    Optional<CourseInviteToken> findByToken(String token);
}
