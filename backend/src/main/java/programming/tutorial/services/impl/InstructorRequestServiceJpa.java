package programming.tutorial.services.impl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import programming.tutorial.dao.InstructorRequestRepository;
import programming.tutorial.domain.InstructorRequest;
import programming.tutorial.domain.User;
import programming.tutorial.domain.InstructorRequestStatus;
import programming.tutorial.services.InstructorRequestService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class InstructorRequestServiceJpa implements InstructorRequestService {

    private final InstructorRequestRepository instructorRequestRepository;

    public InstructorRequestServiceJpa(InstructorRequestRepository repository) {
        this.instructorRequestRepository = repository;
    }

    @Override
    public InstructorRequest submitRequest(InstructorRequest request) {
        request.setStatus(InstructorRequestStatus.PENDING);
        request.setRequestDate(LocalDateTime.now());
        return instructorRequestRepository.save(request);
    }

    @Override
    public boolean hasPendingRequest(User user) {
        return instructorRequestRepository.existsByUserAndStatus(user, InstructorRequestStatus.PENDING);
    }

    @Override
    public List<InstructorRequest> getAllRequests() {
        return instructorRequestRepository.findAll();
    }

    @Override
    public Optional<InstructorRequest> findById(Long id) {
        return instructorRequestRepository.findById(id);
    }

    @Override
    public InstructorRequest updateRequestStatus(Long id, InstructorRequestStatus status) {
        Optional<InstructorRequest> optional = instructorRequestRepository.findById(id);
        if (optional.isPresent()) {
            InstructorRequest request = optional.get();
            request.setStatus(status);
            request.setDecisionDate(LocalDateTime.now());
            return instructorRequestRepository.save(request);
        }
        throw new RuntimeException("Instructor request not found");
    }
}
