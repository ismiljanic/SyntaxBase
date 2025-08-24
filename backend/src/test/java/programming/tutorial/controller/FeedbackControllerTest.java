package programming.tutorial.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import programming.tutorial.domain.FeedbackRequest;
import programming.tutorial.dto.LessonCompletionDTO;
import programming.tutorial.dto.LessonFeedbackRequestDTO;
import programming.tutorial.services.LessonFeedbackService;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(FeedbackController.class)
class FeedbackControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private LessonFeedbackService feedbackService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser
    void sendFeedback_shouldReturnString() throws Exception {
        FeedbackRequest request = new FeedbackRequest();
        request.setMessage("Test feedback");

        when(feedbackService.sendFeedbackEmail(any(FeedbackRequest.class))).thenReturn("Email sent");

        mockMvc.perform(post("/api/feedback/email")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().string("Email sent"));
    }

    @Test
    @WithMockUser
    void receiveFeedback_shouldReturnString() throws Exception {
        LessonFeedbackRequestDTO requestDTO = new LessonFeedbackRequestDTO();
        requestDTO.setLessonId(101);
        requestDTO.setFeedback("Great lesson!");

        when(feedbackService.receiveFeedback(any(LessonFeedbackRequestDTO.class), any(Integer.class)))
                .thenReturn("Feedback received");

        mockMvc.perform(post("/api/feedback/receiveFeedback")
                        .with(csrf())
                        .param("userId", "123")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDTO)))
                .andExpect(status().isOk())
                .andExpect(content().string("Feedback received"));
    }

    @Test
    @WithMockUser(username = "auth0|123")
    void submitFeedback_shouldReturnOk() throws Exception {
        LessonFeedbackRequestDTO requestDTO = new LessonFeedbackRequestDTO();
        requestDTO.setLessonId(101);
        requestDTO.setFeedback("Nice lesson");

        when(feedbackService.submitFeedback(any(LessonFeedbackRequestDTO.class), any(String.class)))
                .thenReturn(ResponseEntity.ok("Feedback submitted"));

        mockMvc.perform(post("/api/feedback/submit")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDTO)))
                .andExpect(status().isOk())
                .andExpect(content().string("Feedback submitted"));
    }

    @Test
    @WithMockUser(username = "auth0|123")
    void markLessonAsCompleted_shouldReturnOk() throws Exception {
        LessonCompletionDTO completionDTO = new LessonCompletionDTO();
        completionDTO.setLessonId(101);

        when(feedbackService.markLessonAsCompleted(any(LessonCompletionDTO.class), any(String.class)))
                .thenReturn(ResponseEntity.ok("Lesson completed"));

        mockMvc.perform(post("/api/feedback/complete")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(completionDTO)))
                .andExpect(status().isOk())
                .andExpect(content().string("Lesson completed"));
    }

    @Test
    @WithMockUser(username = "auth0|123")
    void checkFeedbackStatus_shouldReturnOk() throws Exception {
        when(feedbackService.checkFeedbackStatus(101, "auth0|123"))
                .thenReturn(ResponseEntity.ok("Completed"));

        mockMvc.perform(get("/api/feedback/status")
                        .with(csrf())
                        .param("lessonId", "101"))
                .andExpect(status().isOk())
                .andExpect(content().string("Completed"));
    }

    @Test
    @WithMockUser
    void sendFeedback_shouldReturnError_whenServiceThrows() throws Exception {
        FeedbackRequest request = new FeedbackRequest();
        request.setMessage("Test feedback");

        when(feedbackService.sendFeedbackEmail(any(FeedbackRequest.class)))
                .thenThrow(new RuntimeException("Email service failed"));

        mockMvc.perform(post("/api/feedback/email")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isInternalServerError());
    }

    @Test
    @WithMockUser
    void receiveFeedback_shouldReturnError_whenServiceThrows() throws Exception {
        LessonFeedbackRequestDTO requestDTO = new LessonFeedbackRequestDTO();
        requestDTO.setLessonId(101);
        requestDTO.setFeedback("Great lesson!");

        when(feedbackService.receiveFeedback(any(LessonFeedbackRequestDTO.class), any(Integer.class)))
                .thenThrow(new IllegalArgumentException("Invalid user ID"));

        mockMvc.perform(post("/api/feedback/receiveFeedback")
                        .with(csrf())
                        .param("userId", String.valueOf(1))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDTO)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "auth0|123")
    void submitFeedback_shouldReturnError_whenServiceThrows() throws Exception {
        LessonFeedbackRequestDTO requestDTO = new LessonFeedbackRequestDTO();
        requestDTO.setLessonId(101);
        requestDTO.setFeedback("Nice lesson");

        when(feedbackService.submitFeedback(any(LessonFeedbackRequestDTO.class), any(String.class)))
                .thenReturn(ResponseEntity.status(500).body("Submission failed"));

        mockMvc.perform(post("/api/feedback/submit")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDTO)))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string("Submission failed"));
    }

    @Test
    @WithMockUser(username = "auth0|123")
    void markLessonAsCompleted_shouldReturnError_whenServiceThrows() throws Exception {
        LessonCompletionDTO completionDTO = new LessonCompletionDTO();
        completionDTO.setLessonId(101);

        when(feedbackService.markLessonAsCompleted(any(LessonCompletionDTO.class), any(String.class)))
                .thenReturn(ResponseEntity.status(404).body("Lesson not found"));

        mockMvc.perform(post("/api/feedback/complete")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(completionDTO)))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Lesson not found"));
    }

    @Test
    @WithMockUser(username = "auth0|123")
    void checkFeedbackStatus_shouldReturnError_whenServiceThrows() throws Exception {
        when(feedbackService.checkFeedbackStatus(101, "auth0|123"))
                .thenReturn(ResponseEntity.status(500).body("Service error"));

        mockMvc.perform(get("/api/feedback/status")
                        .with(csrf())
                        .param("lessonId", "101"))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string("Service error"));
    }
}