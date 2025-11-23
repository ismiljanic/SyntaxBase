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
import programming.tutorial.domain.Role;
import programming.tutorial.dto.PostDTO;
import programming.tutorial.services.PostService;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AdminModerationController.class)
@Import(TestSecurityConfig.class)
class AdminModerationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private PostService postService;

    @Test
    @WithMockUser(roles = "ADMIN")
    void getModeratedPosts_shouldReturnList() throws Exception {
        PostDTO post1 = new PostDTO(
                1, "Content 1", "user1", "User One", new Date(), null, "General", Role.USER, new Date(), "SAFE", LocalDateTime.MIN);
        PostDTO post2 = new PostDTO(
                2, "Content 2", "user2", "User Two", new Date(), null, "WebDevelopment", Role.USER, new Date(), "TOXIC", LocalDateTime.MIN);

        when(postService.getAllModeratedPosts()).thenReturn(List.of(post1, post2));

        mockMvc.perform(get("/api/admin/moderation/posts")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].moderationLabel").value("SAFE"))
                .andExpect(jsonPath("$[1].id").value(2))
                .andExpect(jsonPath("$[1].moderationLabel").value("TOXIC"));
    }

    @Test
    @WithMockUser(roles = "USER")
    void getModeratedPosts_shouldReturnForbidden_forNonAdmin() throws Exception {
        mockMvc.perform(get("/api/admin/moderation/posts")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }
}