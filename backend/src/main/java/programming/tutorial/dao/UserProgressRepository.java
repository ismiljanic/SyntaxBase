package programming.tutorial.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import programming.tutorial.domain.UserProgress;

import java.util.Optional;

@Repository
public interface UserProgressRepository extends JpaRepository<UserProgress, Long> {
    Optional<UserProgress> findByUser_Auth0UserIdAndCourse_Id(String auth0UserId, Integer courseId);
}
