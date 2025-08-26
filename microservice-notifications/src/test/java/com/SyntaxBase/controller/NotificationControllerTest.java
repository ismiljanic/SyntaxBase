package com.SyntaxBase.controller;

import com.SyntaxBase.dto.NotificationDTO;
import com.SyntaxBase.services.NotificationService;
import com.SyntaxBase.utils.JwtUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.security.Principal;
import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;
import static org.mockito.BDDMockito.given;

class NotificationControllerTest {

    @InjectMocks
    private NotificationController notificationController;

    @Mock
    private NotificationService notificationService;

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private Principal principal;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void ping_shouldReturnPong() {
        String response = notificationController.ping();
        assertThat(response).isEqualTo("pong");
    }

    @Test
    void markAsRead_shouldReturnOk_whenNotificationExists() {
        Long notificationId = 1L;

        doNothing().when(notificationService).markNotificationAsRead(notificationId);

        ResponseEntity<?> response = notificationController.markAsRead(notificationId);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        verify(notificationService, times(1)).markNotificationAsRead(notificationId);
    }

    @Test
    void markAsRead_shouldReturnNotFound_whenNotificationDoesNotExist() {
        Long notificationId = 999L;
        doThrow(new RuntimeException("Notification not found"))
                .when(notificationService).markNotificationAsRead(notificationId);

        ResponseEntity<?> response = notificationController.markAsRead(notificationId);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(response.getBody()).isEqualTo("Notification not found");
    }

    @Test
    void getNotifications_shouldReturnNotifications_whenPrincipalExists() {
        NotificationDTO n1 = new NotificationDTO();
        n1.setMessage("Test 1");
        NotificationDTO n2 = new NotificationDTO();
        n2.setMessage("Test 2");
        List<NotificationDTO> mockNotifications = Arrays.asList(n1, n2);

        given(principal.getName()).willReturn("auth0|12345");
        given(notificationService.getNotificationsForUser("auth0|12345", false))
                .willReturn(mockNotifications);

        List<NotificationDTO> result = notificationController.getNotifications(principal);

        assertThat(result).hasSize(2);
        assertThat(result).extracting("message").containsExactly("Test 1", "Test 2");
    }

    @Test
    void getNotifications_shouldThrowRuntimeException_whenPrincipalIsNull() {
        RuntimeException exception = null;
        try {
            notificationController.getNotifications(null);
        } catch (RuntimeException ex) {
            exception = ex;
        }
        assertThat(exception).isNotNull();
        assertThat(exception.getMessage()).isEqualTo("Unauthorized - no principal found");
    }
}