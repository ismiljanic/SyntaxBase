package programming.tutorial.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import programming.tutorial.dao.*;
import programming.tutorial.domain.Course;
import programming.tutorial.domain.Lesson;
import programming.tutorial.domain.User;
import programming.tutorial.domain.UserProgress;
import programming.tutorial.dto.LessonDTO;
import programming.tutorial.services.UserProgressService;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class UserProgressServiceJpa implements UserProgressService {

    @Autowired
    private UserProgressRepository userProgressRepository;
    @Autowired
    private LessonRepository lessonRepository;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserCourseRepository userCourseRepository;

    @Override
    public Optional<LessonDTO> getCurrentLesson(String userId, Integer courseId) {
        return userProgressRepository.findByUser_Auth0UserIdAndCourse_Id(userId, courseId)
                .map(userProgress -> {
                    Lesson currentLesson = userProgress.getCurrentLesson();
                    return new LessonDTO(currentLesson.getId(), currentLesson.getLessonName(), courseId);
                });
    }

    @Override
    public String updateProgress(String auth0UserId, Integer courseId, Integer currentLessonNumber) {
        Optional<UserProgress> userProgressOpt = userProgressRepository.findByUser_Auth0UserIdAndCourse_Id(auth0UserId, courseId);

        if (userProgressOpt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User progress not found");
        }

        UserProgress userProgress = userProgressOpt.get();

        Optional<Lesson> nextLessonOpt = lessonRepository.findNextLesson(courseId, currentLessonNumber);

        if (nextLessonOpt.isPresent()) {
            userProgress.setCurrentLesson(nextLessonOpt.get());
            userProgressRepository.save(userProgress);
            return "Progress updated successfully.";
        } else {
            return "No more lessons. Course might be complete.";
        }
    }

    @Override
    public ResponseEntity<?> getProgressBar(String userId, Integer courseId) {
        Optional<User> userOpt = userRepository.findByAuth0UserId(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        Optional<Course> courseOpt = courseRepository.findById(courseId);
        if (courseOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Course not found");
        }

        Integer numericUserId = userOpt.get().getId();
        Course course = courseOpt.get();
        int total = course.getLength();
        Long completed = lessonRepository.countCompletedLessonsForUserAndCourse(courseId, numericUserId);

        double progress = total > 0 ? (completed / (double) total) * 100 : 0;

        Map<String, Object> response = new HashMap<>();
        response.put("totalLessons", total);
        response.put("completedLessons", completed);
        response.put("progress", progress);

        return ResponseEntity.ok(response);
    }

    public boolean isUserEnrolled(String auth0UserId, Integer courseId) {
        Optional<User> userOpt = userRepository.findByAuth0UserId(auth0UserId);
        if (userOpt.isEmpty()) {
            return false;
        }
        Integer userId = userOpt.get().getId();
        return userCourseRepository.existsByUserIdAndCourseId(userId, courseId);
    }

}
