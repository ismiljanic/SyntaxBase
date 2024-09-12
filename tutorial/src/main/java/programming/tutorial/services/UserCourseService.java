package programming.tutorial.services;

import programming.tutorial.domain.UserCourse;
import programming.tutorial.dto.CourseDTO;
import programming.tutorial.dto.UserCourseDTO;

import java.util.List;

public interface UserCourseService {
    void enrollUserInCourse(UserCourseDTO userCourseDTO);
    List<CourseDTO> getCoursesByUserId(Integer userId);
    boolean isUserEnrolledInCourse(Integer userId, Integer courseId);
}
