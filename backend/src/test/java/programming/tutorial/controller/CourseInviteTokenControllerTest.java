package programming.tutorial.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import programming.tutorial.config.TestSecurityConfig;
import programming.tutorial.domain.InviteRequest;
import programming.tutorial.domain.InviteResponse;
import programming.tutorial.dto.CourseInviteAcceptRequestDTO;
import programming.tutorial.services.InviteService;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CourseInviteTokenController.class)
@ContextConfiguration(classes = {CourseInviteTokenController.class, TestSecurityConfig.class})
class CourseInviteTokenControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private InviteService inviteService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser
    void acceptInvite_shouldReturnOk_whenSuccessful() throws Exception {
        CourseInviteAcceptRequestDTO request = new CourseInviteAcceptRequestDTO();
        request.setToken("valid-token");

        InviteResponse response = new InviteResponse(100, 5);

        when(inviteService.acceptInvite(anyString(), anyString())).thenReturn(response);

        mockMvc.perform(post("/api/invite/accept")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.courseId").value(100))
                .andExpect(jsonPath("$.lessonNumber").value(5));
    }

    @Test
    @WithMockUser
    void acceptInvite_shouldReturnBadRequest_whenServiceThrows() throws Exception {
        CourseInviteAcceptRequestDTO request = new CourseInviteAcceptRequestDTO();
        request.setToken("invalid-token");

        when(inviteService.acceptInvite(anyString(), anyString()))
                .thenThrow(new IllegalArgumentException("Invalid invite token"));

        mockMvc.perform(post("/api/invite/accept")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Invalid invite token"));
    }

    @Test
    @WithMockUser
    void sendInvite_shouldReturnOk_whenSuccessful() throws Exception {
        InviteRequest request = new InviteRequest();
        request.setEmail("test@example.com");
        request.setCourseId(101L);

        mockMvc.perform(post("/api/invite/send-invite")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request))
                        .principal(() -> "auth0|123"))
                .andExpect(status().isOk())
                .andExpect(content().string("Invite sent"));
    }


    @Test
    @WithMockUser
    void sendInvite_shouldReturnBadRequest_whenServiceThrows() throws Exception {
        InviteRequest request = new InviteRequest();
        request.setEmail("test@example.com");
        request.setCourseId(101L);

        doThrow(new IllegalArgumentException("Invalid email")).when(inviteService)
                .createAndSendInvite(anyString(), anyLong(), anyString());

        mockMvc.perform(post("/api/invite/send-invite")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request))
                        .principal(() -> "auth0|123"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Invalid email"));
    }
}