package programming.tutorial.services.impl;

import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;
import programming.tutorial.dao.CourseRepository;
import programming.tutorial.dao.LessonRepository;
import programming.tutorial.dao.UserRepository;
import programming.tutorial.domain.*;
import programming.tutorial.dto.CourseDTO;
import programming.tutorial.dto.CourseWithLessonsDTO;
import programming.tutorial.dto.LessonDTO;
import programming.tutorial.dto.UserDTO;
import programming.tutorial.monitoring.CacheMetrics;
import programming.tutorial.services.CourseService;
import io.micrometer.core.instrument.Timer;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class CourseServiceJpa implements CourseService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private LessonRepository lessonRepository;
    @Autowired
    private CacheServiceJpa cacheService;
    @Autowired
    private CacheMetrics cacheMetrics;
    @Autowired
    private MeterRegistry meterRegistry;


    @Override
    @Cacheable(value = "course_by_name", key = "#name")
    public Optional<Course> findByName(CourseDTO courseDTO) {
        return Optional.ofNullable(courseRepository.findByCourseName(courseDTO.getCourseName()));
    }

    @Override
    @Cacheable(value = "course_by_id", key = "#courseDTO.courseId")
    public Optional<Course> findById(CourseDTO courseDTO) {
        return courseRepository.findById(courseDTO.getCourseId());
    }

    @Override
    @Caching(evict = {
            @CacheEvict(value = "all_courses", allEntries = true),
            @CacheEvict(value = "course_by_id", key = "#courseDTO.courseId"),
            @CacheEvict(value = "course_by_name", key = "#courseDTO.courseName"),
            @CacheEvict(value = "courses_by_user", key = "#courseDTO.creator.auth0UserId")
    })
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
    @CacheEvict(value = "all_courses", allEntries = true)
    public void deleteCourse(Integer courseId) {
        courseRepository.deleteById(courseId);
    }

    private UserDTO mapUser(User user) {
        if (user == null) return null;
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setSurname(user.getSurname());
        dto.setUsername(user.getUsername());
        dto.setAuth0UserId(user.getAuth0UserId());
        dto.setRole(user.getRole());
        dto.setActive(user.isActive());
        dto.setDateCreated(user.getDateCreated());
        dto.setTier(user.getTier());
        return dto;
    }

    @Override
    @Cacheable(value = "all_courses")
    public List<CourseDTO> getAllCourses() {
        Timer.Sample sample = Timer.start(meterRegistry);
        long start = System.currentTimeMillis();
        cacheMetrics.miss();
        /* First run will print this if cache isn't evicted previously
         * Other runs will not print this unless cache is invalidated
         * */
        System.out.println(">>> DB QUERY EXECUTED — NO CACHE HIT <<<");
        List<CourseDTO> courses = courseRepository.findAll().stream()
                .map(course -> {
                    CourseDTO dto = new CourseDTO(
                            course.getId(),
                            course.getCourseName(),
                            course.getLength(),
                            course.getDescription(),
                            course.getCategory(),
                            course.getCreator() != null ? course.getCreator().getId() : null,
                            course.isSystemCourse()
                    );
                    dto.setCreator(mapUser(course.getCreator()));
                    return dto;
                })
                .collect(Collectors.toList());

        sample.stop(Timer.builder("app.cache.getAllCourses.time")
                .description("Execution time for getAllCourses")
                .register(meterRegistry));

        long duration = System.currentTimeMillis() - start;
        System.out.println("getAllCourses execution time: " + duration + " ms");
        return courses;
    }

    /**
     * Method to check how caching improves/behaves versus regular method.
     * This bypasses the cache entirely and records execution time for comparison.
     */
    public List<CourseDTO> getAllCoursesUncached() {
        Timer.Sample sample = Timer.start(meterRegistry);
        long start = System.currentTimeMillis();
        System.out.println("Uncached getAllCourses method called");
        List<CourseDTO> courses = courseRepository.findAll().stream()
                .map(course -> new CourseDTO(
                        course.getId(),
                        course.getCourseName(),
                        course.getLength(),
                        course.getDescription(),
                        course.getCategory()
                ))
                .collect(Collectors.toList());

        sample.stop(Timer.builder("app.cache.getAllCourses_uncached.time")
                .description("Execution time for getAllCourses WITHOUT cache")
                .register(meterRegistry));

        long duration = System.currentTimeMillis() - start;
        System.out.println("getAllCoursesUncached execution time: " + duration + " ms");
        return courses;
    }


    @Override
    @Caching(evict = {
            @CacheEvict(value = "all_courses", allEntries = true),
            @CacheEvict(value = "courses_by_user", key = "#dto.auth0UserId"),
            @CacheEvict(value = "lessons_for_course", key = "#result.id")
    })
    public Course createCourseWithLessons(CourseWithLessonsDTO dto) {
        User creator = userRepository.findByAuth0UserId(dto.getAuth0UserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found for Auth0 ID: " + dto.getAuth0UserId()));

        List<String> lessonTitles = dto.getLessons();

        if (lessonTitles == null || lessonTitles.isEmpty()) {
            throw new IllegalArgumentException("Lesson titles are required");
        }

        int maxAllowed = getMaxLessonsByTier(creator.getTier());
        if (lessonTitles.size() > maxAllowed) {
            throw new IllegalArgumentException("Too many lessons for user tier: " + creator.getTier());
        }

        UUID inviteToken = dto.getInviteToken() != null
                ? dto.getInviteToken()
                : UUID.randomUUID();

        Course course = new Course(
                dto.getCourseName(),
                dto.getCourseLength(),
                dto.getDescription(),
                dto.getCategory(),
                creator,
                false,
                inviteToken
        );


        course = courseRepository.save(course);

        List<Lesson> lessons = new ArrayList<>();
        for (int i = 0; i < lessonTitles.size(); i++) {
            String title = lessonTitles.get(i);
            Lesson lesson = new Lesson();
            lesson.setLessonName(title);
            lesson.setContent("Placeholder content");
            lesson.setEditable(true);
            lesson.setCourse(course);
            lesson.setLessonNumber(i + 1);
            lessons.add(lesson);
        }


        lessonRepository.saveAll(lessons);
        return course;
    }

    private int getMaxLessonsByTier(Tier tier) {
        return switch (tier) {
            case FREE -> 5;
            case PROFESSIONAL -> 15;
            case ULTIMATE -> Integer.MAX_VALUE;
        };
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
    @Cacheable(value = "courses_by_user", key = "#auth0UserId")
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

    @Override
    @Cacheable(value = "lessons_for_course", key = "#courseId")
    public List<LessonDTO> getLessonsForCourse(Integer courseId) {
        List<Lesson> lessons = lessonRepository.findByCourseIdOrderByIdAsc(courseId);
        return lessons.stream()
                .map(lesson -> new LessonDTO(
                        lesson.getId(),
                        lesson.getLessonName(),
                        lesson.getCourse().getId(),
                        lesson.getUser().getId(),
                        lesson.isEditable(),
                        lesson.isCompleted()
                ))
                .collect(Collectors.toList());
    }
}
