package programming.tutorial.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import programming.tutorial.dao.LessonRepository;
import programming.tutorial.dao.UserProgressRepository;
import programming.tutorial.domain.Lesson;
import programming.tutorial.domain.UserProgress;
import programming.tutorial.dto.LessonDTO;

import java.util.Optional;

@RestController
@RequestMapping("/api/progress")
@CrossOrigin(origins = "*")
public class UserProgressController {

    @Autowired
    private UserProgressRepository userProgressRepository;
    @Autowired
    private LessonRepository lessonRepository;

    @GetMapping("/current-lesson")
    public ResponseEntity<LessonDTO> getCurrentLesson(
            @RequestParam Integer userId,
            @RequestParam Integer courseId) {

        Optional<UserProgress> userProgressOpt = userProgressRepository.findByUserIdAndCourseId(userId, courseId);
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
            @RequestParam Integer userId,
            @RequestParam Integer courseId,
            @RequestParam Integer lessonId) {

        Optional<UserProgress> userProgressOpt = userProgressRepository.findByUserIdAndCourseId(userId, courseId);
        System.out.println("lessonid: " + lessonId);
        if (userProgressOpt.isPresent()) {
            UserProgress userProgress = userProgressOpt.get();
            Lesson currentLesson = userProgress.getCurrentLesson();

            Optional<Lesson> nextLessonOpt = lessonRepository.findNextLesson(courseId, lessonId);
            if (nextLessonOpt.isPresent()) {
                System.out.println("next lesson" + nextLessonOpt);
                userProgress.setCurrentLesson(nextLessonOpt.get());
                System.out.println("user progress: " + userProgress);
                userProgressRepository.save(userProgress);
                return ResponseEntity.ok("Progress updated successfully.");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Next lesson not found.");
            }
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
