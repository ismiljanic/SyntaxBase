package programming.tutorial.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import programming.tutorial.dao.CourseRepository;
import programming.tutorial.dao.LessonRepository;
import programming.tutorial.dao.UserCourseRepository;
import programming.tutorial.dao.UserRepository;
import programming.tutorial.domain.Course;
import programming.tutorial.domain.Lesson;
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

    @Autowired
    private LessonRepository lessonRepository;

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
        userCourse.setUser(user);
        userCourse.setCourse(course);
        userCourse.setCompleted(false);
        userCourseRepository.save(userCourse);

        List<Lesson> existingLessons = lessonRepository.findByCourse_IdAndUser_Auth0UserId(course.getId(), user.getAuth0UserId());

        if (existingLessons.isEmpty()) {
            int totalLessons = course.getLength() != 0 ? course.getLength() : 10;
            for (int i = 1; i <= totalLessons; i++) {
                Lesson lesson = new Lesson();
                lesson.setLessonName("Lesson " + i);
                lesson.setCourse(course);
                lesson.setUser(user);
                lesson.setCompleted(false);
                lessonRepository.save(lesson);
            }
            System.out.println("Created " + totalLessons + " lessons for user " + user.getUsername() + " in course " + course.getId());
        } else {
            System.out.println("Lessons already exist for user " + user.getUsername() + " in course " + course.getId());
        }
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
