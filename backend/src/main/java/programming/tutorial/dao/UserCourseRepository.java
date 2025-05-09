package programming.tutorial.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import programming.tutorial.domain.UserCourse;

import java.util.List;
@Repository
public interface UserCourseRepository extends JpaRepository<UserCourse, Integer> {
    List<UserCourse> findByUserId(Integer userId);

    boolean existsByUserIdAndCourseId(Integer userId, Integer courseId);

    List<UserCourse> findByUserIdAndCourseId(Integer userId, Integer courseId);

}
