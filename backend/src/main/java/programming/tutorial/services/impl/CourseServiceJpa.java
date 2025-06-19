package programming.tutorial.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import programming.tutorial.dao.CourseRepository;
import programming.tutorial.dao.LessonRepository;
import programming.tutorial.dao.UserRepository;
import programming.tutorial.domain.Course;
import programming.tutorial.domain.Lesson;
import programming.tutorial.domain.User;
import programming.tutorial.dto.CourseDTO;
import programming.tutorial.dto.CourseWithLessonsDTO;
import programming.tutorial.services.CourseService;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CourseServiceJpa implements CourseService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Override
    public Optional<Course> findByName(CourseDTO courseDTO) {
        return Optional.ofNullable(courseRepository.findByCourseName(courseDTO.getCourseName()));
    }

    @Override
    public Optional<Course> findById(CourseDTO courseDTO) {
        return courseRepository.findById(courseDTO.getCourseId());
    }

    @Override
    public Course saveCourse(CourseDTO courseDTO) {
        Course course = new Course();
        course.setId(courseDTO.getCourseId());
        course.setCourseName(courseDTO.getCourseName());
        course.setLength(courseDTO.getCourseLength());
        course.setDescription(courseDTO.getDescription());
        course.setCategory(courseDTO.getCategory());
        return courseRepository.save(course);
    }

    @Override
    public void deleteCourse(Integer courseId) {
        courseRepository.deleteById(courseId);
    }

    @Override
    public List<CourseDTO> getAllCourses() {
        List<Course> courses = courseRepository.findAll();
        System.out.println("Retrieved courses from database:");
        for (Course course : courses) {
            System.out.println("Course ID: " + course.getId() + ", Name: " + course.getCourseName());
        }
        return courses.stream()
                .map(course -> new CourseDTO(course.getId(), course.getCourseName(), course.getLength(), course.getDescription(), course.getCategory()))
                .collect(Collectors.toList());
    }

    @Override
    public void createCourseWithLessons(CourseWithLessonsDTO dto) {
        User creator = userRepository.findByAuth0UserId(dto.getAuth0UserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found for Auth0 ID: " + dto.getAuth0UserId()));

        Course course = new Course(dto.getCourseName(), dto.getCourseLength(), dto.getDescription(), dto.getCategory(), creator, false);
        course = courseRepository.save(course);

        if (dto.getLessons() != null && !dto.getLessons().isEmpty()) {
            for (String lessonTitle : dto.getLessons()) {
                Lesson lesson = new Lesson();
                lesson.setLessonName(lessonTitle);
                lesson.setCourse(course);
                lessonRepository.save(lesson);
            }
        }
    }

    @Override
    public List<CourseDTO> getCoursesByUserAuth0Id(String auth0UserId) {
        User user = userRepository.findByAuth0UserId(auth0UserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Set<Course> courses = user.getMyCourses();

        return courses.stream()
                .map(course -> new CourseDTO(course.getId(), course.getCourseName(), course.getLength(),
                        course.getDescription(), course.getCategory()))
                .collect(Collectors.toList());
    }
}
