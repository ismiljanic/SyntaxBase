package programming.tutorial.services.impl;

import org.antlr.v4.runtime.misc.LogManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import programming.tutorial.dao.InstructorRequestRepository;
import programming.tutorial.dao.UserRepository;
import programming.tutorial.domain.InstructorRequest;
import programming.tutorial.domain.Role;
import programming.tutorial.domain.User;
import programming.tutorial.domain.InstructorRequestStatus;
import programming.tutorial.dto.InstructorRequestDTO;
import programming.tutorial.services.EmailService;
import programming.tutorial.services.InstructorRequestService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class InstructorRequestServiceJpa implements InstructorRequestService {
    @Autowired
    private final InstructorRequestRepository instructorRequestRepository;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailServiceJpa emailService;

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

            if (status == InstructorRequestStatus.APPROVED) {
                User user = request.getUser();
                if (Role.USER.equals(user.getRole())) {
                    user.setRole(Role.INSTRUCTOR);
                    userRepository.save(user);
                    emailService.sendApprovalEmail(request.getEmail(), user.getName());
                }
            }
            return instructorRequestRepository.save(request);
        }
        throw new RuntimeException("Instructor request not found");
    }

    public List<InstructorRequest> getPendingRequests() {
        return instructorRequestRepository.findByStatus(InstructorRequestStatus.PENDING);
    }

    @Override
    public ResponseEntity<?> submitInstructorRequest(InstructorRequestDTO dto, String auth0UserId) {
        Optional<User> userOpt = userRepository.findByAuth0UserId(auth0UserId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        User user = userOpt.get();

        if (instructorRequestRepository.existsByUserAndStatus(user, InstructorRequestStatus.PENDING)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("You already have a pending instructor request.");
        }

        InstructorRequest request = new InstructorRequest();
        request.setUser(user);
        request.setInstitution(dto.getInstitution());
        request.setPhone(dto.getPhone());
        request.setAddress(dto.getAddress());
        request.setCredentials(dto.getCredentials());
        request.setStatus(InstructorRequestStatus.PENDING);
        request.setRequestDate(LocalDateTime.now());
        request.setEmail(dto.getEmail());

        instructorRequestRepository.save(request);

        return ResponseEntity.ok("Instructor request submitted successfully.");
    }
}
