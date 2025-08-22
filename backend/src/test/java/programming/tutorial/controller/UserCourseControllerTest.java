package programming.tutorial.controller;

import static org.mockito.Mockito.*;
import static org.assertj.core.api.Assertions.assertThat;

import java.security.Principal;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;
import programming.tutorial.dto.CourseDTO;
import programming.tutorial.dto.StartCourseRequest;
import programming.tutorial.services.UserCourseService;

class UserCourseControllerTest {

    @Mock
    private UserCourseService userCourseService;

    @InjectMocks
    private UserCourseController userCourseController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void enrollUserInCourse_ShouldReturnOk_WhenValidUser() {
        StartCourseRequest request = new StartCourseRequest();
        request.setAuth0UserId("auth0|123");
        Principal principal = () -> "auth0|123";

        ResponseEntity<String> response = userCourseController.enrollUserInCourse(request, principal);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        verify(userCourseService).startCourseForUser(request);
    }

    @Test
    void enrollUserInCourse_ShouldReturnForbidden_WhenUserIdMismatch() {
        StartCourseRequest request = new StartCourseRequest();
        request.setAuth0UserId("auth0|456");
        Principal principal = () -> "auth0|123";

        ResponseEntity<String> response = userCourseController.enrollUserInCourse(request, principal);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
        assertThat(response.getBody()).isEqualTo("Invalid user id");
        verify(userCourseService, never()).startCourseForUser(any());
    }

    @Test
    void enrollUserInCourse_ShouldReturnConflict_WhenAlreadyEnrolled() {
        StartCourseRequest request = new StartCourseRequest();
        request.setAuth0UserId("auth0|123");
        Principal principal = () -> "auth0|123";

        doThrow(new IllegalStateException()).when(userCourseService).startCourseForUser(request);

        ResponseEntity<String> response = userCourseController.enrollUserInCourse(request, principal);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
        assertThat(response.getBody()).isEqualTo("You are already enrolled in this course.");
    }

    @Test
    void enrollUserInCourse_ShouldReturnBadRequest_WhenInvalidInput() {
        StartCourseRequest request = new StartCourseRequest();
        request.setAuth0UserId("auth0|123");
        Principal principal = () -> "auth0|123";

        doThrow(new IllegalArgumentException()).when(userCourseService).startCourseForUser(request);

        ResponseEntity<String> response = userCourseController.enrollUserInCourse(request, principal);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isEqualTo("Invalid input.");
    }

    @Test
    void enrollUserInCourse_ShouldReturnServerError_OnUnexpectedException() {
        StartCourseRequest request = new StartCourseRequest();
        request.setAuth0UserId("auth0|123");
        Principal principal = () -> "auth0|123";

        doThrow(new RuntimeException()).when(userCourseService).startCourseForUser(request);

        ResponseEntity<String> response = userCourseController.enrollUserInCourse(request, principal);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
        assertThat(response.getBody()).isEqualTo("Server error.");
    }

    @Test
    void getCoursesByAuth0UserId_ShouldReturnCourses() {
        String userId = "auth0|123";
        List<CourseDTO> mockCourses = List.of(new CourseDTO(), new CourseDTO());

        when(userCourseService.getCoursesByUserId(userId)).thenReturn(mockCourses);

        ResponseEntity<List<CourseDTO>> response = userCourseController.getCoursesByAuth0UserId(userId);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(mockCourses);
    }

    @Test
    void completeCourse_ShouldReturnOk_WhenSuccessful() {
        Integer courseId = 10;
        Jwt principal = mock(Jwt.class);
        when(principal.getSubject()).thenReturn("auth0|123");
        when(userCourseService.markCourseAsCompleted("auth0|123", courseId)).thenReturn(true);

        ResponseEntity<String> response = userCourseController.completeCourse(courseId, principal);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo("Course marked as completed");
    }

    @Test
    void completeCourse_ShouldReturnNotFound_WhenEnrollmentNotFound() {
        Integer courseId = 10;
        Jwt principal = mock(Jwt.class);
        when(principal.getSubject()).thenReturn("auth0|123");
        when(userCourseService.markCourseAsCompleted("auth0|123", courseId)).thenReturn(false);

        ResponseEntity<String> response = userCourseController.completeCourse(courseId, principal);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(response.getBody()).isEqualTo("Course enrollment not found");
    }
}