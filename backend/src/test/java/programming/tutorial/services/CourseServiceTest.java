package programming.tutorial.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import programming.tutorial.dao.CourseRepository;
import programming.tutorial.dao.LessonRepository;
import programming.tutorial.dao.UserRepository;
import programming.tutorial.domain.Course;
import programming.tutorial.domain.Lesson;
import programming.tutorial.domain.Tier;
import programming.tutorial.domain.User;
import programming.tutorial.dto.CourseDTO;
import programming.tutorial.dto.CourseWithLessonsDTO;
import programming.tutorial.dto.LessonDTO;
import programming.tutorial.services.impl.CourseServiceJpa;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CourseServiceTest {

    @Mock
    private CourseRepository courseRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private LessonRepository lessonRepository;
    @InjectMocks
    private CourseServiceJpa courseService;
    private CourseDTO courseDTO;
    private CourseDTO courseDTO1;
    private CourseDTO courseDTO2;
    private Course course;
    private Course course1;
    private Course course2;
    private User creator;

    private CourseDTO createCourseDTO(int id, String name, String description) {
        CourseDTO dto = new CourseDTO();
        dto.setCourseId(id);
        dto.setCourseName(name);
        dto.setCourseLength(120);
        dto.setDescription(description);
        dto.setCategory("Programming");
        return dto;
    }

    private Course createCourseFromDTO(CourseDTO dto) {
        Course course = new Course();
        course.setId(dto.getCourseId());
        course.setCourseName(dto.getCourseName());
        course.setLength(dto.getCourseLength());
        course.setDescription(dto.getDescription());
        course.setCategory(dto.getCategory());
        return course;
    }


    @BeforeEach
    void setUp() {
        courseDTO = createCourseDTO(1, "Java Basics", "Learn Java from scratch");
        courseDTO1 = createCourseDTO(1, "Java Basics 1", "dto1");
        courseDTO2 = createCourseDTO(2, "Java Basics 2", "dto2");

        course = createCourseFromDTO(courseDTO);
        course1 = createCourseFromDTO(courseDTO1);
        course2 = createCourseFromDTO(courseDTO2);

        creator = new User();
        creator.setId(1);
        creator.setTier(Tier.FREE);
        creator.setAuth0UserId("auth0|12345");
    }

    @Test
    void findByName_shouldReturnCourseIfExists() {
        when(courseRepository.findByCourseName("Java Basics")).thenReturn(course);

        Optional<Course> result = courseService.findByName(courseDTO);

        assertTrue(result.isPresent());
        assertEquals("Java Basics", result.get().getCourseName());
        verify(courseRepository, times(1)).findByCourseName("Java Basics");
    }

    @Test
    void findByName_shouldReturnEmptyIfNotFound() {
        when(courseRepository.findByCourseName("Java Basics")).thenReturn(null);

        Optional<Course> result = courseService.findByName(courseDTO);

        assertFalse(result.isPresent());
        verify(courseRepository, times(1)).findByCourseName("Java Basics");
    }

    @Test
    void findById_shouldReturnCourseIfExists() {
        when(courseRepository.findById(1)).thenReturn(Optional.of(course));

        Optional<Course> result = courseService.findById(courseDTO);

        assertTrue(result.isPresent());
        assertEquals(1, result.get().getId());
        verify(courseRepository, times(1)).findById(1);
    }

    @Test
    void findById_shouldReturnEmptyIfNotFound() {
        when(courseRepository.findById(1)).thenReturn(Optional.empty());

        Optional<Course> result = courseService.findById(courseDTO);

        assertFalse(result.isPresent());
        verify(courseRepository, times(1)).findById(1);
    }

    @Test
    void saveCourse_shouldSaveAndReturnCourse() {
        when(courseRepository.save(any(Course.class))).thenReturn(course);

        Course saved = courseService.saveCourse(courseDTO);

        assertNotNull(saved);
        assertEquals("Java Basics", saved.getCourseName());
        verify(courseRepository, times(1)).save(any(Course.class));
    }

    @Test
    void deleteCourse_shouldCallRepositoryDelete() {
        doNothing().when(courseRepository).deleteById(1);

        courseService.deleteCourse(1);

        verify(courseRepository, times(1)).deleteById(1);
    }

    @Test
    void getAllCourses_shouldReturnMappedCourseDTOs() {
        when(courseRepository.findAll()).thenReturn(Arrays.asList(course1, course2));

        List<CourseDTO> result = courseService.getAllCourses();

        assertNotNull(result);
        assertEquals(2, result.size());

        CourseDTO dto1 = result.get(0);
        assertEquals(1, dto1.getCourseId());
        assertEquals("Java Basics 1", dto1.getCourseName());
        assertEquals(120, dto1.getCourseLength());
        assertEquals("dto1", dto1.getDescription());
        assertEquals("Programming", dto1.getCategory());

        CourseDTO dto2 = result.get(1);
        assertEquals(2, dto2.getCourseId());
        assertEquals("Java Basics 2", dto2.getCourseName());

        verify(courseRepository, times(1)).findAll();
    }

    @Test
    void getAllCourses_shouldReturnEmptyListIfNoCourses() {
        when(courseRepository.findAll()).thenReturn(Arrays.asList());

        List<CourseDTO> result = courseService.getAllCourses();

        assertNotNull(result);
        assertTrue(result.isEmpty());

        verify(courseRepository, times(1)).findAll();
    }

    @Test
    void createCourseWithLessons_shouldCreateCourseAndLessons() {
        CourseWithLessonsDTO dto = new CourseWithLessonsDTO();
        dto.setAuth0UserId("auth0|12345");
        dto.setCourseName("Java Advanced");
        dto.setCourseLength(180);
        dto.setDescription("Advanced Java course");
        dto.setCategory("Programming");
        dto.setLessons(Arrays.asList("Lesson 1", "Lesson 2"));

        when(userRepository.findByAuth0UserId("auth0|12345")).thenReturn(Optional.of(creator));
        when(courseRepository.save(any(Course.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Course result = courseService.createCourseWithLessons(dto);

        assertNotNull(result);
        assertEquals("Java Advanced", result.getCourseName());
        verify(courseRepository).save(any(Course.class));
        verify(lessonRepository).saveAll(anyList());
    }

    @Test
    void createCourseWithLessons_shouldThrowIfUserNotFound() {
        CourseWithLessonsDTO dto = new CourseWithLessonsDTO();
        dto.setAuth0UserId("unknown_user");
        dto.setLessons(Arrays.asList("Lesson 1"));

        when(userRepository.findByAuth0UserId("unknown_user")).thenReturn(Optional.empty());

        Exception exception = assertThrows(IllegalArgumentException.class, () ->
                courseService.createCourseWithLessons(dto)
        );

        assertTrue(exception.getMessage().contains("User not found"));
        verify(courseRepository, never()).save(any());
        verify(lessonRepository, never()).saveAll(any());
    }

    @Test
    void createCourseWithLessons_shouldThrowIfLessonsEmpty() {
        CourseWithLessonsDTO dto = new CourseWithLessonsDTO();
        dto.setAuth0UserId("auth0|12345");
        dto.setLessons(Collections.emptyList());

        when(userRepository.findByAuth0UserId("auth0|12345")).thenReturn(Optional.of(creator));

        Exception exception = assertThrows(IllegalArgumentException.class, () ->
                courseService.createCourseWithLessons(dto)
        );

        assertTrue(exception.getMessage().contains("Lesson titles are required"));
        verify(courseRepository, never()).save(any());
        verify(lessonRepository, never()).saveAll(any());
    }

    @Test
    void createCourseWithLessons_shouldThrowIfTooManyLessonsForTier() {
        CourseWithLessonsDTO dto = new CourseWithLessonsDTO();
        dto.setAuth0UserId("auth0|12345");
        dto.setLessons(Arrays.asList("L1", "L2", "L3", "L4", "L5", "L6", "L7", "L8", "L9", "L10", "L11"));

        when(userRepository.findByAuth0UserId("auth0|12345")).thenReturn(Optional.of(creator));

        Exception exception = assertThrows(IllegalArgumentException.class, () ->
                courseService.createCourseWithLessons(dto)
        );

        assertTrue(exception.getMessage().contains("Too many lessons for user tier"));
        verify(courseRepository, never()).save(any());
        verify(lessonRepository, never()).saveAll(any());
    }

    @Test
    void createCourseWithLessons_shouldUseProvidedInviteToken() {
        CourseWithLessonsDTO dto = new CourseWithLessonsDTO();
        dto.setAuth0UserId("auth0|12345");
        dto.setCourseName("Test Course");
        dto.setLessons(Arrays.asList("Lesson 1"));
        UUID providedToken = UUID.randomUUID();
        dto.setInviteToken(providedToken);

        when(userRepository.findByAuth0UserId("auth0|12345")).thenReturn(Optional.of(creator));
        when(courseRepository.save(any(Course.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Course course = courseService.createCourseWithLessons(dto);

        assertEquals(providedToken, course.getInviteToken());
    }

    @Test
    void getCoursesByUserAuth0Id_shouldReturnUserCourses() {
        User user = new User();
        user.setAuth0UserId("auth0|12345");

        Course course1 = new Course();
        course1.setId(1);
        course1.setCourseName("Course 1");

        Course course2 = new Course();
        course2.setId(2);
        course2.setCourseName("Course 2");

        user.setMyCourses(new HashSet<>(Arrays.asList(course1, course2)));

        when(userRepository.findByAuth0UserId("auth0|12345")).thenReturn(Optional.of(user));

        List<CourseDTO> result = courseService.getCoursesByUserAuth0Id("auth0|12345");

        assertNotNull(result);
        assertEquals(2, result.size());
        assertTrue(result.stream().anyMatch(dto -> dto.getCourseName().equals("Course 1")));
        assertTrue(result.stream().anyMatch(dto -> dto.getCourseName().equals("Course 2")));
    }

    @Test
    void getCoursesByUserAuth0Id_shouldThrowIfUserNotFound() {
        when(userRepository.findByAuth0UserId("unknown")).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () ->
                courseService.getCoursesByUserAuth0Id("unknown")
        );

        assertTrue(exception.getMessage().contains("User not found"));
    }

    @Test
    void isCourseOwner_shouldReturnTrueIfUserIsOwner() {
        Course course = new Course();
        User creator = new User();
        creator.setAuth0UserId("auth0|12345");
        course.setCreator(creator);

        when(courseRepository.findById(1)).thenReturn(Optional.of(course));

        boolean result = courseService.isCourseOwner("auth0|12345", 1);

        assertTrue(result);
    }

    @Test
    void isCourseOwner_shouldReturnFalseIfUserIsNotOwner() {
        Course course = new Course();
        User creator = new User();
        creator.setAuth0UserId("auth0|12345");
        course.setCreator(creator);

        when(courseRepository.findById(1)).thenReturn(Optional.of(course));

        boolean result = courseService.isCourseOwner("auth0|99999", 1);

        assertFalse(result);
    }

    @Test
    void isCourseOwner_shouldReturnFalseIfCourseNotFound() {
        when(courseRepository.findById(1)).thenReturn(Optional.empty());

        boolean result = courseService.isCourseOwner("auth0|12345", 1);

        assertFalse(result);
    }

    @Test
    void getLessonsForCourse_shouldReturnMappedLessonDTOs() {
        Course course = new Course();
        course.setId(1);

        User user = new User();
        user.setId(10);

        Lesson lesson1 = new Lesson();
        lesson1.setId(1);
        lesson1.setLessonName("Lesson 1");
        lesson1.setCourse(course);
        lesson1.setUser(user);
        lesson1.setEditable(true);
        lesson1.setCompleted(false);

        Lesson lesson2 = new Lesson();
        lesson2.setId(2);
        lesson2.setLessonName("Lesson 2");
        lesson2.setCourse(course);
        lesson2.setUser(user);
        lesson2.setEditable(false);
        lesson2.setCompleted(true);

        when(lessonRepository.findByCourseIdOrderByIdAsc(1))
                .thenReturn(Arrays.asList(lesson1, lesson2));

        List<LessonDTO> result = courseService.getLessonsForCourse(1);

        assertNotNull(result);
        assertEquals(2, result.size());

        LessonDTO dto1 = result.get(0);
        assertEquals(1, dto1.getId());
        assertEquals("Lesson 1", dto1.getLessonName());
        assertEquals(1, dto1.getCourseId());
        assertEquals(10, dto1.getUserId());
        assertTrue(dto1.isEditable());
        assertFalse(dto1.isCompleted());

        LessonDTO dto2 = result.get(1);
        assertEquals(2, dto2.getId());
        assertEquals("Lesson 2", dto2.getLessonName());
        assertFalse(dto2.isEditable());
        assertTrue(dto2.isCompleted());
    }

    @Test
    void getLessonsForCourse_shouldReturnEmptyListIfNoLessons() {
        when(lessonRepository.findByCourseIdOrderByIdAsc(1)).thenReturn(Collections.emptyList());

        List<LessonDTO> result = courseService.getLessonsForCourse(1);

        assertNotNull(result);
        assertTrue(result.isEmpty());
    }
}