package programming.tutorial.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import programming.tutorial.domain.InstructorRequest;
import programming.tutorial.domain.InstructorRequestStatus;
import programming.tutorial.domain.User;

import java.util.List;

@Repository
public interface InstructorRequestRepository extends JpaRepository<InstructorRequest, Long> {
    boolean existsByUserAndStatus(User user, InstructorRequestStatus status);
    List<InstructorRequest> findByStatus(InstructorRequestStatus status);
}