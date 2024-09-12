package programming.tutorial.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import programming.tutorial.dao.CourseRepository;
import programming.tutorial.domain.Course;
import programming.tutorial.dto.CourseDTO;
import programming.tutorial.services.CourseService;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CourseServiceJpa implements CourseService {

    @Autowired
    private CourseRepository courseRepository;

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
        course.setName(courseDTO.getCourseName());
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
            System.out.println("Course ID: " + course.getId() + ", Name: " + course.getName());
        }
        return courses.stream()
                .map(course -> new CourseDTO(course.getId(), course.getName(), course.getLength(), course.getDescription(), course.getCategory()))
                .collect(Collectors.toList());
    }
}
