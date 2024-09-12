package programming.tutorial.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import programming.tutorial.domain.UserCourse;

import java.util.List;

public interface UserCourseRepository extends JpaRepository<UserCourse, Integer> {
    List<UserCourse> findByUserId(Integer userId);

    boolean existsByUserIdAndCourseId(Integer userId, Integer courseId);
}
