package programming.tutorial.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import programming.tutorial.domain.Role;
import programming.tutorial.dto.*;
import programming.tutorial.services.PostService;
import programming.tutorial.services.UserService;
import programming.tutorial.services.impl.UserNotFoundException;

import java.security.Principal;
import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@WebMvcTest(UserAdminController.class)
@AutoConfigureMockMvc(addFilters = false)
class UserAdminControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @MockBean
    private PostService postService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void getAllUsers_shouldReturnList() throws Exception {
        List<UserDTO> users = List.of(
                new UserDTO("auth0|1", "user1@example.com", Role.USER, true),
                new UserDTO("auth0|2", "user2@example.com", Role.USER, true)
        );

        when(userService.getAllUsers()).thenReturn(users);

        mockMvc.perform(get("/api/admin/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].username").value("user1@example.com"))
                .andExpect(jsonPath("$[1].username").value("user2@example.com"));
    }

    @Test
    void suspendUser_shouldReturnOk_whenUserExists() throws Exception {
        doNothing().when(userService).setUserActiveStatus("user1", false);

        mockMvc.perform(put("/api/admin/users/user1/suspend"))
                .andExpect(status().isOk())
                .andExpect(content().string("User suspended"));

        verify(userService).setUserActiveStatus("user1", false);
    }

    @Test
    void suspendUser_shouldReturnNotFound_whenUserDoesNotExist() throws Exception {
        doThrow(new RuntimeException("User not found")).when(userService).setUserActiveStatus("userX", false);

        mockMvc.perform(put("/api/admin/users/userX/suspend"))
                .andExpect(status().isNotFound())
                .andExpect(content().string("User not found"));
    }

    @Test
    void activateUser_shouldReturnOk_whenUserExists() throws Exception {
        doNothing().when(userService).setUserActiveStatus("user1", true);

        mockMvc.perform(put("/api/admin/users/user1/activate"))
                .andExpect(status().isOk())
                .andExpect(content().string("User activated"));

        verify(userService).setUserActiveStatus("user1", true);
    }

    @Test
    void activateUser_shouldReturnNotFound_whenUserDoesNotExist() throws Exception {
        doThrow(new RuntimeException("User not found")).when(userService).setUserActiveStatus("userX", true);

        mockMvc.perform(put("/api/admin/users/userX/activate"))
                .andExpect(status().isNotFound())
                .andExpect(content().string("User not found"));
    }

    @Test
    void updateUserRole_shouldReturnOk_whenRoleUpdated() throws Exception {
        Role role = Role.ADMIN;

        doNothing().when(userService).updateUserRoles("user1", role);

        mockMvc.perform(put("/api/admin/users/user1/roles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(role)))
                .andExpect(status().isOk())
                .andExpect(content().string("User role updated"));

        verify(userService).updateUserRoles("user1", role);
    }

    @Test
    void updateUserRole_shouldReturnBadRequest_whenServiceThrows() throws Exception {
        Role role = Role.USER;

        doThrow(new RuntimeException("Invalid role")).when(userService).updateUserRoles("user1", role);

        mockMvc.perform(put("/api/admin/users/user1/roles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(role)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Invalid role"));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void deleteUserAsAdmin_shouldReturnOk_whenSuccessful() throws Exception {
        String userId = "auth0|123";

        doNothing().when(userService).deleteUserAsAdmin(userId);

        Principal mockPrincipal = () -> "auth0|admin";

        mockMvc.perform(delete("/api/admin/users/deleteAccount/{userId}", userId)
                        .principal(mockPrincipal)
                        .header("Authorization", "Bearer dummyToken"))
                .andExpect(status().isOk())
                .andExpect(content().string("User deleted successfully"));

        verify(userService).deleteUserAsAdmin(userId);
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void deleteUserAsAdmin_shouldReturnInternalServerError_whenException() throws Exception {
        String userId = "auth0|123";

        doThrow(new RuntimeException("DB error")).when(userService).deleteUserAsAdmin(userId);

        Principal mockPrincipal = () -> "auth0|admin";

        mockMvc.perform(delete("/api/admin/users/deleteAccount/{userId}", userId)
                        .principal(mockPrincipal)
                        .header("Authorization", "Bearer dummyToken"))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string("Error deleting user: DB error"));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void getUserById_shouldReturnOk_whenUserExists() throws Exception {
        String userId = "auth0|123";
        UserAccountDTO dto = new UserAccountDTO();
        dto.setUsername("user@example.com");

        when(userService.getUserAccountDTOByAuth0UserId(userId)).thenReturn(dto);

        mockMvc.perform(get("/api/admin/users/{userId}", userId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("user@example.com"));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void getUserById_shouldReturnNotFound_whenUserNotFound() throws Exception {
        String userId = "auth0|123";

        when(userService.getUserAccountDTOByAuth0UserId(userId))
                .thenThrow(new UserNotFoundException("User not found"));

        mockMvc.perform(get("/api/admin/users/{userId}", userId))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void getUserById_shouldReturnInternalServerError_whenGenericException() throws Exception {
        String userId = "auth0|123";

        when(userService.getUserAccountDTOByAuth0UserId(userId))
                .thenThrow(new RuntimeException("Unexpected error"));

        mockMvc.perform(get("/api/admin/users/{userId}", userId))
                .andExpect(status().isInternalServerError());
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void softDeletePostAsAdmin_shouldReturnOk_whenSuccessful() throws Exception {
        int postId = 1;

        doNothing().when(postService).softDeletePost(postId);

        mockMvc.perform(put("/api/admin/users/posts/{postId}/delete", postId))
                .andExpect(status().isOk())
                .andExpect(content().string("Post soft-deleted successfully"));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void softDeletePostAsAdmin_shouldReturnNotFound_whenPostNotFound() throws Exception {
        int postId = 1;

        doThrow(new IllegalArgumentException("Post not found")).when(postService).softDeletePost(postId);

        mockMvc.perform(put("/api/admin/users/posts/{postId}/delete", postId))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Post not found"));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void restoreDeletedPost_shouldReturnOk_whenSuccessful() throws Exception {
        int postId = 123;
        doNothing().when(postService).restorePost(postId);

        mockMvc.perform(put("/api/admin/users/posts/{postId}/restore", postId))
                .andExpect(status().isOk())
                .andExpect(content().string("Post restored"));

        verify(postService).restorePost(postId);
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void restoreDeletedPost_shouldReturnNotFound_whenPostDoesNotExist() throws Exception {
        int postId = 999;
        doThrow(new IllegalArgumentException("Post not found")).when(postService).restorePost(postId);

        mockMvc.perform(put("/api/admin/users/posts/{postId}/restore", postId))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Post not found"));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void removeUserFromCourse_shouldReturnOk_whenSuccessful() throws Exception {
        String userId = "auth0|123";
        int courseId = 456;
        doNothing().when(userService).removeUserFromCourse(userId, courseId);

        mockMvc.perform(delete("/api/admin/users/{userId}/courses/{courseId}", userId, courseId))
                .andExpect(status().isOk())
                .andExpect(content().string("User removed from course successfully"));

        verify(userService).removeUserFromCourse(userId, courseId);
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void removeUserFromCourse_shouldReturnNotFound_whenExceptionThrown() throws Exception {
        String userId = "auth0|123";
        int courseId = 999;
        doThrow(new RuntimeException("User not enrolled in course")).when(userService).removeUserFromCourse(userId, courseId);

        mockMvc.perform(delete("/api/admin/users/{userId}/courses/{courseId}", userId, courseId))
                .andExpect(status().isNotFound())
                .andExpect(content().string("User not enrolled in course"));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void testRoute_shouldReturnOk() throws Exception {
        String userId = "auth0|123";
        int courseId = 1;

        mockMvc.perform(get("/api/admin/users/{userId}/courses/{courseId}", userId, courseId))
                .andExpect(status().isOk())
                .andExpect(content().string("Test OK"));
    }
}