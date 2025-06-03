package programming.tutorial.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import programming.tutorial.dao.InstructorRequestRepository;
import programming.tutorial.domain.InstructorRequest;
import programming.tutorial.domain.InstructorRequestStatus;
import programming.tutorial.services.InstructorRequestService;

import java.util.List;

@RestController
@RequestMapping("/api/admin/instructor-requests")
public class InstructorRequestAdminController {
    @Autowired
    private final InstructorRequestService instructorRequestService;

    @Autowired
    private InstructorRequestRepository instructorRequestRepository;

    public InstructorRequestAdminController(InstructorRequestService instructorRequestService) {
        this.instructorRequestService = instructorRequestService;
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/approved")
    public ResponseEntity<?> approveRequest(@PathVariable Long id) {
        try {
            InstructorRequest updated = instructorRequestService.updateRequestStatus(id, InstructorRequestStatus.APPROVED);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/rejected")
    public ResponseEntity<?> rejectRequest(@PathVariable Long id) {
        try {
            InstructorRequest updated = instructorRequestService.updateRequestStatus(id, InstructorRequestStatus.REJECTED);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/pending")
    public List<InstructorRequest> getPendingRequests() {
        return instructorRequestRepository.findByStatus(InstructorRequestStatus.PENDING);
    }
}
