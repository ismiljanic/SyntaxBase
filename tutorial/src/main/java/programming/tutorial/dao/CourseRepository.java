package programming.tutorial.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import programming.tutorial.domain.Course;

import java.util.Optional;

public interface CourseRepository extends JpaRepository<Course, Integer> {

    Optional<Course> findById(Integer courseId);

    Course findByCategory(String category);

    Course findByCourseName(String courseName);
}
