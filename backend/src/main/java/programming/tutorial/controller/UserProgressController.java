package programming.tutorial.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import programming.tutorial.dao.LessonRepository;
import programming.tutorial.dao.UserProgressRepository;
import programming.tutorial.dao.UserRepository;
import programming.tutorial.domain.Lesson;
import programming.tutorial.domain.User;
import programming.tutorial.domain.UserProgress;
import programming.tutorial.dto.LessonDTO;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/progress")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class UserProgressController {

    @Autowired
    private UserProgressRepository userProgressRepository;
    @Autowired
    private LessonRepository lessonRepository;
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/current-lesson")
    public ResponseEntity<LessonDTO> getCurrentLesson(
            @RequestParam String userId,
            @RequestParam Integer courseId) {

        Optional<UserProgress> userProgressOpt = userProgressRepository.findByUser_Auth0UserIdAndCourse_Id(userId, courseId);
        if (userProgressOpt.isPresent()) {
            UserProgress userProgress = userProgressOpt.get();
            Lesson currentLesson = userProgress.getCurrentLesson();

            LessonDTO lessonDTO = new LessonDTO();
            lessonDTO.setId(currentLesson.getId());
            lessonDTO.setLessonName(currentLesson.getLessonName());
            lessonDTO.setCourseId(courseId);

            return ResponseEntity.ok(lessonDTO);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/update")
    public ResponseEntity<String> updateProgress(
            @RequestParam Integer courseId,
            @RequestParam Integer lessonId) {
        System.out.println("Progress update endpoint hit for lessonId = " + lessonId);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String auth0UserId = authentication.getName();

        Optional<UserProgress> userProgressOpt = userProgressRepository.findByUser_Auth0UserIdAndCourse_Id(auth0UserId, courseId);
        System.out.println("lessonid: " + lessonId);

        if (userProgressOpt.isPresent()) {
            UserProgress userProgress = userProgressOpt.get();

            Optional<Lesson> nextLessonOpt = lessonRepository.findNextLesson(courseId, lessonId);

            if (nextLessonOpt.isPresent()) {
                userProgress.setCurrentLesson(nextLessonOpt.get());
                userProgressRepository.save(userProgress);
                return ResponseEntity.ok("Progress updated successfully.");
            } else {
                System.out.println("No next lesson — course might be complete.");
                return ResponseEntity.ok("No more lessons. Course might be complete.");
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User progress not found.");
        }
    }


    @GetMapping("/progressBar")
    public ResponseEntity<?> getCurrentProgressBar(
            @RequestParam String userId,
            @RequestParam Integer courseId
    ) {
        Optional<User> optionalUser = userRepository.findByAuth0UserId(userId);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        User user = optionalUser.get();
        Integer numericUserId = user.getId();

        Long totalLessons = lessonRepository.getCourseLength(courseId);
        Long completedLessons = lessonRepository.countCompletedLessonsForUserAndCourse(courseId, numericUserId);

        double progress = totalLessons > 0 ? (completedLessons / (double) totalLessons) * 100 : 0;

        Map<String, Object> response = new HashMap<>();
        response.put("totalLessons", totalLessons);
        response.put("completedLessons", completedLessons);
        response.put("progress", progress);

        return ResponseEntity.ok(response);
    }
}
