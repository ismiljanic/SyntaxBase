package programming.tutorial.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import programming.tutorial.domain.UserCourse;

import java.util.List;
@Repository
public interface UserCourseRepository extends JpaRepository<UserCourse, Integer> {
    List<UserCourse> findByUser_Auth0UserId(String auth0UserId);

    boolean existsByUser_Auth0UserIdAndCourseId(String auth0UserId, Integer courseId);
    List<UserCourse> findByUser_Auth0UserIdAndCourseId(String userId, Integer courseId);

}
