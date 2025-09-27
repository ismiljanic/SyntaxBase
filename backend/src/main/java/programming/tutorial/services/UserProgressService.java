package programming.tutorial.services;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import programming.tutorial.dto.LessonDTO;

import java.util.Optional;

public interface UserProgressService {
    Optional<LessonDTO> getCurrentLesson(String userId, Integer courseId);

    String updateProgress(String auth0UserId, Integer courseId, Integer lessonId);

    ResponseEntity<?> getProgressBar(String userId, Integer courseId);

    boolean isUserEnrolled(String userId, Integer courseId);
}

