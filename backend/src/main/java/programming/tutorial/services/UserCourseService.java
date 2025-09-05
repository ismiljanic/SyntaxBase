package programming.tutorial.services;

import org.springframework.stereotype.Service;
import programming.tutorial.domain.UserCourse;
import programming.tutorial.dto.CourseDTO;
import programming.tutorial.dto.StartCourseRequest;
import programming.tutorial.dto.UserCourseDTO;

import java.util.List;
public interface UserCourseService {
    void enrollUserInCourse(UserCourseDTO userCourseDTO);

    List<CourseDTO> getCoursesByUserId(String userId);

    boolean isUserEnrolledInCourse(String userId, Integer courseId);

    void startCourseForUser(StartCourseRequest request);

    boolean markCourseAsCompleted(String auth0UserId, Integer courseId);

}
