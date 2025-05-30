package programming.tutorial.dao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import programming.tutorial.domain.Rating;

import java.util.List;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    Rating findByCourseId(Long courseId);
    List<Rating> findByAuth0UserId(String auth0UserId);
}
