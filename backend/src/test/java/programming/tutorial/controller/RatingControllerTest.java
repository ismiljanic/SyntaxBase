package programming.tutorial.controller;

import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import programming.tutorial.domain.Rating;
import programming.tutorial.dto.RatingDTO;
import programming.tutorial.services.RatingService;

@WebMvcTest(RatingController.class)
class RatingControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private RatingService ratingService;

    private Rating rating;
    private RatingDTO ratingDTO;

    @BeforeEach
    void setUp() {
        rating = new Rating();
        rating.setId(1L);
        rating.setCourseId(100L);
        rating.setAuth0UserId("auth0|123");
        rating.setRating(5);

        ratingDTO = new RatingDTO();
        ratingDTO.setCourseId(100);
        ratingDTO.setId(2);
        ratingDTO.setRating(5);
    }

    @Test
    @WithMockUser
    void getRating_ShouldReturnRating() throws Exception {
        when(ratingService.getRating(100L)).thenReturn(rating);

        mockMvc.perform(get("/api/ratings/{courseId}", 100))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.courseId").value(100))
                .andExpect(jsonPath("$.rating").value(5));
    }

    @Test
    @WithMockUser
    void saveRating_ShouldReturnOk_WhenSuccessful() throws Exception {
        when(ratingService.saveRating(any(Rating.class))).thenReturn(rating);

        mockMvc.perform(post("/api/ratings/save")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(rating)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.courseId").value(100))
                .andExpect(jsonPath("$.rating").value(5));

        verify(ratingService).saveRating(any(Rating.class));
    }

    @Test
    @WithMockUser
    void saveRating_ShouldReturnConflict_WhenIllegalState() throws Exception {
        when(ratingService.saveRating(any(Rating.class))).thenThrow(new IllegalStateException("Duplicate rating"));

        mockMvc.perform(post("/api/ratings/save")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(rating)))
                .andExpect(status().isConflict())
                .andExpect(content().string("Duplicate rating"));
    }

    @Test
    @WithMockUser
    void saveRating_ShouldReturnServerError_OnOtherException() throws Exception {
        when(ratingService.saveRating(any(Rating.class))).thenThrow(new RuntimeException("DB error"));

        mockMvc.perform(post("/api/ratings/save")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(rating)))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string("Failed to save rating"));
    }

    @Test
    @WithMockUser
    void getUserRatingsByAuth0Id_ShouldReturnList() throws Exception {
        when(ratingService.getUserRatings("auth0|123")).thenReturn(List.of(ratingDTO));

        mockMvc.perform(get("/api/ratings/user/{auth0UserId}", "auth0|123").with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].courseId").value(100))
                .andExpect(jsonPath("$[0].rating").value(5));
    }
}