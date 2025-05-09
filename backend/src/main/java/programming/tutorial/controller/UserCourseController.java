package programming.tutorial.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import programming.tutorial.dao.*;
import programming.tutorial.domain.UserCourse;
import programming.tutorial.domain.UserProgress;
import programming.tutorial.dto.CourseDTO;
import programming.tutorial.dto.UserCourseDTO;
import programming.tutorial.services.UserCourseService;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user-courses")
@CrossOrigin(origins = "*")
public class UserCourseController {

    @Autowired
    private UserCourseService userCourseService;
    @Autowired
    private UserCourseRepository userCourseRepository;
    @Autowired
    private UserProgressRepository userProgressRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CourseRepository courseRepository;
    @Autowired
    private LessonRepository lessonRepository;

    @PostMapping("/startCourse")
    public ResponseEntity<String> enrollUserInCourse(@RequestBody UserCourseDTO userCourseDTO) {
        try {
            userCourseService.enrollUserInCourse(userCourseDTO);

            Integer userId = userCourseDTO.getUserId();
            Integer courseId = userCourseDTO.getCourseId();

            if (!userProgressRepository.findByUserIdAndCourseId(userId, courseId).isPresent()) {
                UserProgress newUserProgress = new UserProgress();
                newUserProgress.setUser(userRepository.findById(userId).orElse(null));
                newUserProgress.setCourse(courseRepository.findById(courseId).orElse(null));
                newUserProgress.setCurrentLesson(lessonRepository.findById(1).orElse(null));
                userProgressRepository.save(newUserProgress);
            }

            return ResponseEntity.ok().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("You are already enrolled in this course.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid input.");
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CourseDTO>> getCoursesByUserId(@PathVariable Integer userId) {
        System.out.println("Fetching courses for user with ID: {" + userId + "}");
        List<CourseDTO> courses = userCourseService.getCoursesByUserId(userId);
        System.out.println("Fetched {" + courses.size() + "} courses " + " for user with ID: {" + userId + "}");
        return ResponseEntity.ok(courses);
    }

    @PutMapping("/completeCourse/{userId}/{courseId}")
    public ResponseEntity<String> completeCourse(@PathVariable Integer userId, @PathVariable Integer courseId) {
        List<UserCourse> userCourses = userCourseRepository.findByUserIdAndCourseId(userId, courseId);
        System.out.println("Found " + userCourses.size() + " userCourse records");

        if (userCourses.isEmpty()) {
            System.out.println("No course enrollment found for user/course");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Course enrollment not found");
        }

        UserCourse userCourse = userCourses.get(0);
        userCourse.setCompleted(true);
        userCourseRepository.save(userCourse);

        return ResponseEntity.ok("Course marked as completed");
    }
}
