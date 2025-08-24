package programming.tutorial.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import programming.tutorial.config.TestSecurityConfig;
import programming.tutorial.dto.CourseCompletionDTO;
import programming.tutorial.dto.CourseRatingDTO;
import programming.tutorial.services.AdminAnalyticsService;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AdminAnalyticsController.class)
@Import(TestSecurityConfig.class)
class AdminAnalyticsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AdminAnalyticsService adminAnalyticsService;

    @Test
    @WithMockUser(roles = "ADMIN")
    void getTopRatedCourses_shouldReturnList() throws Exception {
        CourseRatingDTO course1 = new CourseRatingDTO(101, "Course name", 4.5);

        CourseRatingDTO course2 = new CourseRatingDTO(102, "Course name 2", 4.2);

        when(adminAnalyticsService.getTopRatedCourses()).thenReturn(List.of(course1, course2));

        mockMvc.perform(get("/api/admin/analytics/top-rated-courses")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].courseId").value(101))
                .andExpect(jsonPath("$[0].averageRating").value(4.5))
                .andExpect(jsonPath("$[1].courseId").value(102))
                .andExpect(jsonPath("$[1].averageRating").value(4.2));
    }

    @Test
    @WithMockUser(roles = "USER")
    void getTopRatedCourses_shouldReturnForbidden_forNonAdmin() throws Exception {
        mockMvc.perform(get("/api/admin/analytics/top-rated-courses")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getCompletionRates_shouldReturnList() throws Exception {

        CourseCompletionDTO course1 = new CourseCompletionDTO(101, "Course name", 4L, 2L, 0.5);

        CourseCompletionDTO course2 = new CourseCompletionDTO(102, "Course name 2", 6L, 2L, 0.333);

        when(adminAnalyticsService.getCourseCompletionRates()).thenReturn(List.of(course1, course2));

        mockMvc.perform(get("/api/admin/analytics/completion-rates")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].courseId").value(101))
                .andExpect(jsonPath("$[0].completionRate").value(0.5))
                .andExpect(jsonPath("$[1].courseId").value(102))
                .andExpect(jsonPath("$[1].completionRate").value(0.333));
    }

    @Test
    @WithMockUser(roles = "USER")
    void getCompletionRates_shouldReturnForbidden_forNonAdmin() throws Exception {
        mockMvc.perform(get("/api/admin/analytics/completion-rates")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }
}