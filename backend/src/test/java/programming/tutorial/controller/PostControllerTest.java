package programming.tutorial.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import programming.tutorial.domain.Post;
import programming.tutorial.dto.NotificationDTO;
import programming.tutorial.dto.PostDTO;
import programming.tutorial.services.NotificationService;
import programming.tutorial.services.PostService;

import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PostController.class)
class PostControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @MockBean
    private PostService postService;
    @MockBean
    private NotificationService notificationService;

    @Test
    @WithMockUser
    void getAllPosts_shouldReturnList() throws Exception {
        PostDTO postDTO = new PostDTO();
        postDTO.setId(1);
        postDTO.setContent("Content");

        when(postService.getAllPosts()).thenReturn(List.of(postDTO));

        mockMvc.perform(get("/api/posts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].content").value("Content"));
    }

    @Test
    @WithMockUser
    void createPost_shouldReturnOk_whenSuccessful() throws Exception {
        Post post = new Post();
        post.setId(1);
        post.setContent("Content");

        when(postService.createPost(any(Post.class))).thenReturn(post);

        mockMvc.perform(post("/api/posts")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(post)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.content").value("Content"));
    }

    @Test
    @WithMockUser
    void createPost_ShouldReturnBadRequest_WhenIllegalArgument() throws Exception {
        Post post = new Post();
        when(postService.createPost(any(Post.class)))
                .thenThrow(new IllegalArgumentException("Invalid data"));

        mockMvc.perform(post("/api/posts")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(post)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Invalid data"));
    }

    @Test
    void deletePost_ShouldReturnOk_WhenSuccessful() throws Exception {
        mockMvc.perform(delete("/api/posts/1")
                        .with(csrf())
                        .with(jwt().jwt(jwt -> jwt.claim("sub", "auth0|123"))))
                .andExpect(status().isOk())
                .andExpect(content().string("Post and its replies deleted successfully."));
    }

    @Test
    @WithMockUser
    void deletePost_ShouldReturnForbidden_WhenUnauthorized() throws Exception {
        doThrow(new SecurityException("Not your post"))
                .when(postService).deletePost(eq(1), anyString());

        mockMvc.perform(delete("/api/posts/1")
                        .with(csrf())
                        .with(jwt().jwt(jwt -> jwt.claim("sub", "auth0|123"))))
                .andExpect(status().isForbidden())
                .andExpect(content().string("Not your post"));
    }

    @Test
    @WithMockUser
    void getNotifications_ShouldReturnList() throws Exception {
        NotificationDTO notification = new NotificationDTO();
        notification.setId(5L);
        notification.setMessage("You have a new reply");

        when(notificationService.getNotificationsForUser("auth0|123"))
                .thenReturn(List.of(notification));

        mockMvc.perform(get("/api/posts/notifications/auth0|123"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(5))
                .andExpect(jsonPath("$[0].message").value("You have a new reply"));
    }

    @Test
    @WithMockUser
    void updatePost_ShouldReturnOk_WhenSuccessful() throws Exception {
        PostDTO dto = new PostDTO();
        dto.setContent("Updated Content");

        mockMvc.perform(put("/api/posts/1")
                        .with(csrf())
                        .with(jwt().jwt(jwt -> jwt.claim("sub", "auth0|123")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser
    void updatePost_ShouldReturnForbidden_WhenUnauthorized() throws Exception {
        PostDTO dto = new PostDTO();
        dto.setContent("Updated Content");

        doThrow(new SecurityException("Unauthorized"))
                .when(postService).updatePost(eq(1), any(PostDTO.class), anyString());

        mockMvc.perform(put("/api/posts/1")
                        .with(csrf())
                        .with(jwt().jwt(jwt -> jwt.claim("sub", "auth0|123")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isForbidden())
                .andExpect(content().string("Unauthorized"));
    }

    @Test
    @WithMockUser
    void getPost_ShouldReturnOk_WhenFound() throws Exception {
        PostDTO dto = new PostDTO();
        dto.setId(7);
        dto.setContent("My Post");

        when(postService.getPost(7)).thenReturn(dto);

        mockMvc.perform(get("/api/posts/7"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(7))
                .andExpect(jsonPath("$.content").value("My Post"));
    }

    @Test
    @WithMockUser
    void getPost_ShouldReturnNotFound_WhenNotExists() throws Exception {
        when(postService.getPost(999))
                .thenThrow(new IllegalArgumentException("Post not found"));

        mockMvc.perform(get("/api/posts/999"))
                .andExpect(status().isNotFound());
    }
}