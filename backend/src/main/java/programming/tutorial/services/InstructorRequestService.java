package programming.tutorial.services;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import programming.tutorial.domain.InstructorRequest;
import programming.tutorial.domain.User;
import programming.tutorial.domain.InstructorRequestStatus;
import programming.tutorial.dto.InstructorRequestDTO;

import java.util.List;
import java.util.Optional;

@Service
public interface InstructorRequestService {
    InstructorRequest submitRequest(InstructorRequest request);

    boolean hasPendingRequest(User user);

    List<InstructorRequest> getAllRequests();

    Optional<InstructorRequest> findById(Long id);

    InstructorRequest updateRequestStatus(Long id, InstructorRequestStatus status);

    List<InstructorRequest> getPendingRequests();

    ResponseEntity<?> submitInstructorRequest(InstructorRequestDTO dto, String auth0UserId);

}
