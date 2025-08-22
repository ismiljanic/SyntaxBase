package programming.tutorial.controller;

import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import programming.tutorial.services.NotificationService;

@WebMvcTest(NotificationController.class)
class NotificationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private NotificationService notificationService;

    private Long notificationId;

    @BeforeEach
    void setUp() {
        notificationId = 1L;
    }

    @Test
    @WithMockUser
    void markNotificationAsRead_ShouldReturnOk() throws Exception {
        ResponseEntity<String> response = ResponseEntity.ok("Notification marked as read.");

        mockMvc.perform(put("/api/notifications/{id}/mark-read", 1L)
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("Notification marked as read."));

        verify(notificationService).markAsRead(1L);
    }


    @Test
    @WithMockUser
    void markNotificationAsRead_ShouldReturnNotFound_WhenServiceThrows() throws Exception {
        when(notificationService.markAsRead(1L))
                .thenThrow(new RuntimeException("Notification not found"));

        mockMvc.perform(put("/api/notifications/{id}/mark-read", 1L)
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Notification not found"));

        verify(notificationService).markAsRead(1L);
    }

}