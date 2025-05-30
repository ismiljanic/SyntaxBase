package programming.tutorial.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import programming.tutorial.dao.CourseRepository;
import programming.tutorial.dao.UserCourseRepository;
import programming.tutorial.dao.UserRepository;
import programming.tutorial.domain.Course;
import programming.tutorial.domain.UserCourse;
import programming.tutorial.dto.CourseDTO;
import programming.tutorial.dto.UserCourseDTO;
import programming.tutorial.services.UserCourseService;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserCourseServiceJpa implements UserCourseService {

    @Autowired
    private UserCourseRepository userCourseRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public void enrollUserInCourse(UserCourseDTO userCourseDTO) {
        if (userCourseDTO.getAuth0UserId() == null || userCourseDTO.getCourseId() == null) {
            throw new IllegalArgumentException("Auth0UserId and Course ID must not be null");
        }

        if (isUserEnrolledInCourse(userCourseDTO.getAuth0UserId(), userCourseDTO.getCourseId())) {
            throw new IllegalStateException("User is already enrolled in this course");
        }

        var user = userRepository.findByAuth0UserId(userCourseDTO.getAuth0UserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        var course = courseRepository.findById(userCourseDTO.getCourseId())
                .orElseThrow(() -> new IllegalArgumentException("Course not found"));
        UserCourse userCourse = new UserCourse();
        System.out.println("User: " + user);
        System.out.println("User Auth0 ID: " + user.getAuth0UserId());
        System.out.println("Course: " + course);
        userCourse.setUser(user);
        userCourse.setCourse(course);
        userCourse.setCompleted(false);
        userCourseRepository.save(userCourse);
    }

    @Override
    public List<CourseDTO> getCoursesByUserId(String userId) {
        List<UserCourse> userCourses = userCourseRepository.findByUser_Auth0UserId(userId);
        return userCourses.stream()
                .map(userCourse -> {
                    Course course = userCourse.getCourse();
                    return new CourseDTO(course.getId(), course.getCourseName(), course.getLength(), course.getDescription(), course.getCategory());
                })
                .collect(Collectors.toList());
    }

    @Override
    public boolean isUserEnrolledInCourse(String userId, Integer courseId) {
        return userCourseRepository.existsByUser_Auth0UserIdAndCourseId(userId, courseId);
    }
}
