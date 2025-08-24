package programming.tutorial.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import programming.tutorial.domain.Course;
import programming.tutorial.dto.CourseDTO;
import programming.tutorial.dto.CourseWithLessonsDTO;
import programming.tutorial.dto.LessonDTO;
import programming.tutorial.services.CourseService;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CourseController.class)
class CourseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private CourseService courseService;

    @Test
    @WithMockUser
    void getCourseById_shouldReturnCourse_whenFound() throws Exception {
        Course course = new Course();
        course.setId(1);
        course.setCourseName("Java Basics");

        when(courseService.findById(any(CourseDTO.class))).thenReturn(Optional.of(course));

        mockMvc.perform(get("/api/courses/1")
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.courseName").value("Java Basics"));
    }

    @Test
    @WithMockUser
    void getCourseById_shouldReturnNotFound_whenNotFound() throws Exception {
        when(courseService.findById(any(CourseDTO.class))).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/courses/1")
                        .with(csrf()))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser
    void getCourseByName_shouldReturnCourse_whenFound() throws Exception {
        Course course = new Course();
        course.setId(2);
        course.setCourseName("Spring Boot");

        when(courseService.findByName(any(CourseDTO.class))).thenReturn(Optional.of(course));

        mockMvc.perform(get("/api/courses/name/Spring Boot")
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(2))
                .andExpect(jsonPath("$.courseName").value("Spring Boot"));
    }

    @Test
    @WithMockUser
    void getCourseByName_shouldReturnNotFound_whenNotFound() throws Exception {

        when(courseService.findByName(any(CourseDTO.class))).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/courses/name/Spring Boot")
                        .with(csrf()))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser
    void createCourse_shouldReturnCreatedCourse() throws Exception {
        CourseDTO dto = new CourseDTO(null, "New Course", 5, "Desc", "Category");
        Course course = new Course();
        course.setId(1);
        course.setCourseName("New Course");

        when(courseService.saveCourse(any(CourseDTO.class))).thenReturn(course);

        mockMvc.perform(post("/api/courses")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.courseName").value("New Course"));
    }

    @Test
    @WithMockUser
    void updateCourse_shouldReturnUpdatedCourse() throws Exception {
        CourseDTO dto = new CourseDTO(null, "Updated Course", 5, "Desc", "Category");
        Course updated = new Course();
        updated.setId(1);
        updated.setCourseName("Updated Course");

        when(courseService.saveCourse(any(CourseDTO.class))).thenReturn(updated);

        mockMvc.perform(put("/api/courses/1")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.courseName").value("Updated Course"));
    }

    @Test
    @WithMockUser
    void deleteCourse_shouldReturnNoContent() throws Exception {
        mockMvc.perform(delete("/api/courses/1")
                        .with(csrf()))
                .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser
    void getAllCourses_shouldReturnList() throws Exception {
        CourseDTO course1 = new CourseDTO(1, "Course 1", 5, "Desc1", "Cat1");
        CourseDTO course2 = new CourseDTO(2, "Course 2", 3, "Desc2", "Cat2");

        when(courseService.getAllCourses()).thenReturn(List.of(course1, course2));

        mockMvc.perform(get("/api/courses")
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].courseName").value("Course 1"))
                .andExpect(jsonPath("$[1].courseName").value("Course 2"));
    }

    @Test
    @WithMockUser
    void createCourseWithLessons_shouldReturnInviteToken_whenSuccessful() throws Exception {
        CourseWithLessonsDTO dto = new CourseWithLessonsDTO();
        Course course = new Course();
        UUID token = UUID.randomUUID();
        course.setInviteToken(token);

        when(courseService.createCourseWithLessons(any(CourseWithLessonsDTO.class))).thenReturn(course);

        mockMvc.perform(post("/api/courses/create-with-lessons")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.inviteToken").value(token.toString()));
    }

    @Test
    @WithMockUser
    void createCourseWithLessons_shouldReturnBadRequest_whenServiceThrows() throws Exception {
        CourseWithLessonsDTO dto = new CourseWithLessonsDTO();
        when(courseService.createCourseWithLessons(any(CourseWithLessonsDTO.class)))
                .thenThrow(new IllegalArgumentException("Invalid data"));

        mockMvc.perform(post("/api/courses/create-with-lessons")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Invalid data"));
    }

    @Test
    @WithMockUser
    void getLessonsForCourse_shouldReturnListOfLessons() throws Exception {
        LessonDTO lesson1 = new LessonDTO(1, "Lesson 1", 10);
        LessonDTO lesson2 = new LessonDTO(2, "Lesson 2", 20);

        when(courseService.getLessonsForCourse(1)).thenReturn(List.of(lesson1, lesson2));

        mockMvc.perform(get("/api/courses/1/lessons")
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].lessonName").value("Lesson 1"))
                .andExpect(jsonPath("$[1].lessonName").value("Lesson 2"));
    }

    @Test
    @WithMockUser
    void getCoursesForUser_shouldReturnUserCourses() throws Exception {
        CourseDTO c1 = new CourseDTO(1, "Course A", 5, "Desc", "Cat");
        CourseDTO c2 = new CourseDTO(2, "Course B", 3, "Desc", "Cat");

        when(courseService.getCoursesByUserAuth0Id("user123")).thenReturn(List.of(c1, c2));

        mockMvc.perform(get("/api/courses/user/user123")
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].courseName").value("Course A"))
                .andExpect(jsonPath("$[1].courseName").value("Course B"));
    }
}