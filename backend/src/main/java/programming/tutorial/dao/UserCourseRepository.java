package programming.tutorial.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import programming.tutorial.domain.User;
import programming.tutorial.domain.UserCourse;
import programming.tutorial.dto.CourseCompletionDTO;
import programming.tutorial.dto.UserCourseDTO;

import java.util.List;

@Repository
public interface UserCourseRepository extends JpaRepository<UserCourse, Integer> {
    List<UserCourse> findByUser_Auth0UserId(String auth0UserId);

    boolean existsByUser_Auth0UserIdAndCourseId(String auth0UserId, Integer courseId);

    List<UserCourse> findByUser_Auth0UserIdAndCourseId(String userId, Integer courseId);

    boolean existsByUserIdAndCourseId(Integer userId, Integer courseId);

    @Query("""
                SELECT new programming.tutorial.dto.CourseCompletionDTO(
                    c.id, c.courseName,
                    COUNT(uc),\s
                    SUM(CASE WHEN uc.completed = true THEN 1 ELSE 0 END),
                    (SUM(CASE WHEN uc.completed = true THEN 1 ELSE 0 END) * 1.0 / COUNT(uc))
                )
                FROM UserCourse uc
                JOIN uc.course c
                GROUP BY c.id, c.courseName
                ORDER BY c.courseName
            """)
    List<CourseCompletionDTO> findCourseCompletionRates();

    int countByUserAndCompletedTrue(User user);
}
