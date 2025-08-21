package programming.tutorial.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;
import programming.tutorial.dao.*;
import programming.tutorial.domain.*;
import programming.tutorial.dto.InstructorRequestDTO;
import programming.tutorial.services.impl.EmailServiceJpa;
import programming.tutorial.services.impl.InstructorRequestServiceJpa;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class InstructorRequestServiceTest {

    @Mock
    private InstructorRequestRepository instructorRequestRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private EmailServiceJpa emailService;
    @InjectMocks
    private InstructorRequestServiceJpa instructorRequestServiceJpa;

    @BeforeEach
    void setup() {
        instructorRequestServiceJpa = new InstructorRequestServiceJpa(instructorRequestRepository);
        ReflectionTestUtils.setField(instructorRequestServiceJpa, "userRepository", userRepository);
        ReflectionTestUtils.setField(instructorRequestServiceJpa, "emailService", emailService);
    }

    @Test
    void submitRequest_shouldSetStatusAndDateAndSave() {
        InstructorRequest request = new InstructorRequest();
        User user = new User();
        request.setUser(user);

        when(instructorRequestRepository.save(any(InstructorRequest.class))).thenAnswer(invocation -> invocation.getArgument(0));

        InstructorRequest savedRequest = instructorRequestServiceJpa.submitRequest(request);

        assertEquals(InstructorRequestStatus.PENDING, savedRequest.getStatus());
        assertNotNull(savedRequest.getRequestDate());
        assertEquals(user, savedRequest.getUser());
        verify(instructorRequestRepository, times(1)).save(request);
    }

    @Test
    void hasPendingRequest_shouldReturnTrueIfExists() {
        User user = new User();
        when(instructorRequestRepository.existsByUserAndStatus(user, InstructorRequestStatus.PENDING)).thenReturn(true);

        boolean result = instructorRequestServiceJpa.hasPendingRequest(user);

        assertTrue(result);
        verify(instructorRequestRepository, times(1)).existsByUserAndStatus(user, InstructorRequestStatus.PENDING);
    }

    @Test
    void hasPendingRequest_shouldReturnFalseIfNotExists() {
        User user = new User();
        when(instructorRequestRepository.existsByUserAndStatus(user, InstructorRequestStatus.PENDING)).thenReturn(false);

        boolean result = instructorRequestServiceJpa.hasPendingRequest(user);

        assertFalse(result);
        verify(instructorRequestRepository, times(1)).existsByUserAndStatus(user, InstructorRequestStatus.PENDING);
    }

    @Test
    void getAllRequests_shouldReturnList() {
        InstructorRequest req1 = new InstructorRequest();
        InstructorRequest req2 = new InstructorRequest();
        List<InstructorRequest> requests = Arrays.asList(req1, req2);

        when(instructorRequestRepository.findAll()).thenReturn(requests);

        List<InstructorRequest> result = instructorRequestServiceJpa.getAllRequests();

        assertEquals(2, result.size());
        assertEquals(requests, result);
        verify(instructorRequestRepository, times(1)).findAll();
    }

    @Test
    void findById_shouldReturnRequestIfExists() {
        InstructorRequest request = new InstructorRequest();
        request.setId(1L);

        when(instructorRequestRepository.findById(1L)).thenReturn(Optional.of(request));

        Optional<InstructorRequest> result = instructorRequestServiceJpa.findById(1L);

        assertTrue(result.isPresent());
        assertEquals(request, result.get());
        verify(instructorRequestRepository, times(1)).findById(1L);
    }

    @Test
    void findById_shouldReturnEmptyIfNotExists() {
        when(instructorRequestRepository.findById(1L)).thenReturn(Optional.empty());

        Optional<InstructorRequest> result = instructorRequestServiceJpa.findById(1L);

        assertFalse(result.isPresent());
        verify(instructorRequestRepository, times(1)).findById(1L);
    }

    @Test
    void updateRequestStatus_shouldThrowIfRequestNotFound() {
        when(instructorRequestRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () ->
                instructorRequestServiceJpa.updateRequestStatus(1L, InstructorRequestStatus.PENDING));

        assertEquals("Instructor request not found", exception.getMessage());
        verify(instructorRequestRepository, never()).save(any());
    }

    @Test
    void updateRequestStatus_shouldUpdateStatusAndDecisionDate() {
        User user = new User();
        user.setId(1);
        user.setUsername("username");
        user.setRole(Role.USER);
        user.setAuth0UserId("auth0Id");

        InstructorRequest request = new InstructorRequest();
        request.setId(1L);
        request.setUser(user);
        request.setStatus(InstructorRequestStatus.PENDING);
        request.setDecisionDate(LocalDateTime.now());
        request.setEmail("user@example.com");
        request.setInstitution("Test Institution");
        request.setPhone("1234567890");
        request.setAddress("Test Address");
        request.setCredentials("Some credentials");

        when(instructorRequestRepository.findById(1L)).thenReturn(Optional.of(request));
        when(instructorRequestRepository.save(any(InstructorRequest.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        when(userRepository.save(any(User.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        InstructorRequest updated = instructorRequestServiceJpa.updateRequestStatus(request.getId(), InstructorRequestStatus.APPROVED);

        assertEquals(InstructorRequestStatus.APPROVED, updated.getStatus());
        assertNotNull(updated.getDecisionDate());
        assertEquals(Role.INSTRUCTOR, user.getRole());

        verify(instructorRequestRepository, times(1)).save(request);
        verify(userRepository, times(1)).save(user);
        verify(emailService, times(1)).sendApprovalEmail("user@example.com", user.getName());
    }

    @Test
    void updateRequestStatus_shouldNotChangeUserRoleIfAlreadyInstructor() {
        User user = new User();
        user.setRole(Role.INSTRUCTOR);

        InstructorRequest request = new InstructorRequest();
        request.setId(1L);
        request.setUser(user);
        request.setEmail("inst@example.com");

        when(instructorRequestRepository.findById(1L)).thenReturn(Optional.of(request));
        when(instructorRequestRepository.save(any(InstructorRequest.class))).thenAnswer(invocation -> invocation.getArgument(0));

        InstructorRequest updated = instructorRequestServiceJpa.updateRequestStatus(1L, InstructorRequestStatus.APPROVED);

        assertEquals(InstructorRequestStatus.APPROVED, updated.getStatus());
        assertEquals(Role.INSTRUCTOR, user.getRole());

        verify(userRepository, never()).save(user);
        verify(emailService, never()).sendApprovalEmail(anyString(), anyString());
    }

    @Test
    void getPendingRequests_shouldReturnOnlyPendingRequests() {
        InstructorRequest req1 = new InstructorRequest();
        InstructorRequest req2 = new InstructorRequest();
        List<InstructorRequest> pendingRequests = Arrays.asList(req1, req2);

        when(instructorRequestRepository.findByStatus(InstructorRequestStatus.PENDING)).thenReturn(pendingRequests);

        List<InstructorRequest> result = instructorRequestServiceJpa.getPendingRequests();

        assertEquals(2, result.size());
        assertEquals(pendingRequests, result);
        verify(instructorRequestRepository, times(1)).findByStatus(InstructorRequestStatus.PENDING);
    }

    @Test
    void submitInstructorRequest_shouldReturnNotFoundIfUserDoesNotExist() {
        String auth0UserId = "nonexistent-user";
        InstructorRequestDTO dto = new InstructorRequestDTO();

        when(userRepository.findByAuth0UserId(auth0UserId)).thenReturn(Optional.empty());

        ResponseEntity<?> response = instructorRequestServiceJpa.submitInstructorRequest(dto, auth0UserId);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("User not found", response.getBody());
        verify(instructorRequestRepository, never()).save(any());
    }

    @Test
    void submitInstructorRequest_shouldReturnBadRequestIfPendingRequestExists() {
        User user = new User();
        user.setAuth0UserId("user123");

        InstructorRequestDTO dto = new InstructorRequestDTO();

        when(userRepository.findByAuth0UserId("user123")).thenReturn(Optional.of(user));
        when(instructorRequestRepository.existsByUserAndStatus(user, InstructorRequestStatus.PENDING)).thenReturn(true);

        ResponseEntity<?> response = instructorRequestServiceJpa.submitInstructorRequest(dto, "user123");

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("You already have a pending instructor request.", response.getBody());
        verify(instructorRequestRepository, never()).save(any());
    }

    @Test
    void submitInstructorRequest_shouldSaveRequestAndReturnOk() {
        User user = new User();
        user.setAuth0UserId("user123");
        user.setUsername("user@example.com");

        InstructorRequestDTO dto = new InstructorRequestDTO();
        dto.setInstitution("Test Institution");
        dto.setPhone("1234567890");
        dto.setAddress("Test Address");
        dto.setCredentials("Some credentials");
        dto.setEmail("user@example.com");

        when(userRepository.findByAuth0UserId("user123")).thenReturn(Optional.of(user));
        when(instructorRequestRepository.existsByUserAndStatus(user, InstructorRequestStatus.PENDING)).thenReturn(false);
        when(instructorRequestRepository.save(any(InstructorRequest.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ResponseEntity<?> response = instructorRequestServiceJpa.submitInstructorRequest(dto, "user123");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Instructor request submitted successfully.", response.getBody());

        verify(instructorRequestRepository, times(1)).save(any(InstructorRequest.class));
    }
}