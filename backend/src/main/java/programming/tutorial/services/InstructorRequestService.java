package programming.tutorial.services;

import org.springframework.stereotype.Service;
import programming.tutorial.domain.InstructorRequest;
import programming.tutorial.domain.User;
import programming.tutorial.domain.InstructorRequestStatus;

import java.util.List;
import java.util.Optional;

@Service
public interface InstructorRequestService {
    InstructorRequest submitRequest(InstructorRequest request);

    boolean hasPendingRequest(User user);

    List<InstructorRequest> getAllRequests();

    Optional<InstructorRequest> findById(Long id);

    InstructorRequest updateRequestStatus(Long id, InstructorRequestStatus status);
}
