package programming.tutorial.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import programming.tutorial.dao.CourseRepository;
import programming.tutorial.dao.LessonRepository;
import programming.tutorial.dao.UserRepository;
import programming.tutorial.domain.*;
import programming.tutorial.dto.CourseDTO;
import programming.tutorial.dto.CourseWithLessonsDTO;
import programming.tutorial.services.CourseService;

import java.util.ArrayList;
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

        int requestedLessonCount = getRequestedLessonCount(dto, creator);

        Course course = new Course(dto.getCourseName(), dto.getCourseLength(), dto.getDescription(), dto.getCategory(), creator, false);
        course = courseRepository.save(course);

        boolean isFreeUser = creator.getTier().equals(Tier.FREE);

        List<Lesson> lessons = getDefaultLessons(course, isFreeUser);
        lessonRepository.saveAll(lessons);
    }

    private List<Lesson> getDefaultLessons(Course course, boolean isFreeUser) {
        List<String> titles = List.of("Introduction", "Basic Concepts", "Getting Started", "Common Pitfalls", "Summary & Next Steps");
        List<String> contents = List.of(
                "Welcome to this course!",
                "Let's cover some fundamentals.",
                "Getting your environment ready.",
                "Things to avoid early on.",
                "Summary and what's next."
        );

        int limit = isFreeUser ? 5 : titles.size();

        List<Lesson> lessons = new ArrayList<>();
        for (int i = 0; i < limit; i++) {
            Lesson lesson = new Lesson();
            lesson.setLessonName(titles.get(i));
            lesson.setContent(contents.get(i));
            lesson.setEditable(true);
            lesson.setCourse(course);
            lessons.add(lesson);
        }

        return lessons;
    }


    private static int getRequestedLessonCount(CourseWithLessonsDTO dto, User creator) {
        if (creator.getRole() != Role.INSTRUCTOR) {
            throw new IllegalStateException("Only users with INSTRUCTOR role can create courses.");
        }


        Tier tier = creator.getTier();
        int maxAllowedLessons = switch (tier) {
            case FREE -> 5;
            case PROFESSIONAL -> 15;
            case ULTIMATE -> Integer.MAX_VALUE;
        };

        int requestedLessonCount = dto.getLessons() != null ? dto.getLessons().size() : 0;
        if (requestedLessonCount > maxAllowedLessons) {
            throw new IllegalArgumentException("Your tier (" + tier + ") allows a maximum of " + maxAllowedLessons + " lessons per course.");
        }
        return requestedLessonCount;
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

    @Override
    public boolean isCourseOwner(String userId, Integer courseId) {
        Course course = courseRepository.findById(courseId).orElse(null);
        return course != null && course.getCreator().getAuth0UserId().equals(userId);
    }

}
