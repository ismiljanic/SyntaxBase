package programming.tutorial.services;

import org.springframework.stereotype.Service;
import programming.tutorial.domain.Course;
import programming.tutorial.dto.CourseDTO;

import java.util.List;
import java.util.Optional;
@Service
public interface CourseService {

    Optional<Course> findByName(CourseDTO courseDTO);

    Optional<Course> findById(CourseDTO courseDTO);

    Course saveCourse(CourseDTO courseDTO);

    void deleteCourse(Integer courseId);

    List<CourseDTO> getAllCourses();
}
