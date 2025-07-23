package programming.tutorial.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import programming.tutorial.domain.Rating;
import programming.tutorial.dto.CourseRatingDTO;
import programming.tutorial.dto.RatingDTO;

import java.util.List;
import java.util.Optional;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    Rating findByCourseId(Long courseId);

    List<Rating> findByAuth0UserId(String auth0UserId);

    Optional<Rating> findByAuth0UserIdAndCourseId(String auth0UserId, Long courseId);

    @Query("""
                SELECT new programming.tutorial.dto.CourseRatingDTO(
                    c.id, c.courseName, AVG(r.rating)
                )
                FROM Rating r
                JOIN Course c ON r.courseId = c.id
                GROUP BY c.id, c.courseName
                ORDER BY AVG(r.rating) DESC
            """)
    List<CourseRatingDTO> findAverageRatingsByCourse();
}
