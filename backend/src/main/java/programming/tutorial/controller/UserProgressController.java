package programming.tutorial.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import programming.tutorial.dto.LessonDTO;
import programming.tutorial.services.LessonService;
import programming.tutorial.services.UserProgressService;

@RestController
@RequestMapping("/api/progress")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class UserProgressController {

    @Autowired
    private UserProgressService userProgressService;

    @Autowired
    private LessonService lessonService;

    @GetMapping("/current-lesson")
    public ResponseEntity<LessonDTO> getCurrentLesson(
            @RequestParam String userId,
            @RequestParam Integer courseId) {

        return userProgressService.getCurrentLesson(userId, courseId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/update")
    public ResponseEntity<String> updateProgress(
            @RequestParam Integer courseId,
            @RequestParam Integer lessonId) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String auth0UserId = auth.getName();

        return ResponseEntity.ok(userProgressService.updateProgress(auth0UserId, courseId, lessonId));
    }

    @GetMapping("/progressBar")
    public ResponseEntity<?> getProgressBar(
            @RequestParam String userId,
            @RequestParam Integer courseId) {

        return userProgressService.getProgressBar(userId, courseId);
    }

    @GetMapping("/lessons/first")
    public ResponseEntity<LessonDTO> getFirstLesson(@RequestParam Integer courseId) {
        return lessonService.getFirstLesson(courseId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/lessons/{courseId}/{lessonId}")
    public ResponseEntity<LessonDTO> getLesson(
            @PathVariable Integer courseId,
            @PathVariable Integer lessonId) {
        return lessonService.getLessonByCourseIdAndLessonId(courseId, lessonId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/lessons/next")
    public ResponseEntity<LessonDTO> getNextLesson(@RequestParam Integer courseId, @RequestParam Integer currentLessonId) {
        return lessonService.getNextLesson(courseId, currentLessonId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/lessons/previous")
    public ResponseEntity<LessonDTO> getPreviousLesson(@RequestParam Integer courseId, @RequestParam Integer currentLessonId) {
        return lessonService.getPreviousLesson(courseId, currentLessonId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

}