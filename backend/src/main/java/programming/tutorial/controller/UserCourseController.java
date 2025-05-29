package programming.tutorial.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import programming.tutorial.dao.*;
import programming.tutorial.domain.Role;
import programming.tutorial.domain.User;
import programming.tutorial.domain.UserCourse;
import programming.tutorial.domain.UserProgress;
import programming.tutorial.dto.CourseDTO;
import programming.tutorial.dto.UserCourseDTO;
import programming.tutorial.services.UserCourseService;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user-courses")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
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
    public ResponseEntity<String> enrollUserInCourse(@RequestBody Map<String, Object> payload, Principal principal) {
        try {
            String authenticatedAuth0UserId = principal.getName();
            String auth0UserId = (String) payload.get("auth0UserId");
            if (!authenticatedAuth0UserId.equals(auth0UserId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid user id");
            }

            Integer courseId = (Integer) payload.get("courseId");

            User user = getOrCreateUserByAuth0Id(authenticatedAuth0UserId);
            Integer userId = user.getId();

            UserCourseDTO userCourseDTO = new UserCourseDTO();
            userCourseDTO.setUserId(userId);
            userCourseDTO.setCourseId(courseId);

            userCourseService.enrollUserInCourse(userCourseDTO);

            if (!userProgressRepository.findByUserIdAndCourseId(userId, courseId).isPresent()) {
                UserProgress newUserProgress = new UserProgress();
                newUserProgress.setUser(user);
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

    public User getOrCreateUserByAuth0Id(String auth0UserId) {
        return userRepository.findByAuth0UserId(auth0UserId)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setAuth0UserId(auth0UserId);
                    newUser.setName("Unknown");
                    newUser.setSurname("User");
                    newUser.setPassword("");
                    newUser.setUsername("user_" + auth0UserId.substring(auth0UserId.length() - 5));
                    newUser.setDateCreated(LocalDateTime.now());
                    newUser.setRole(Role.USER);
                    return userRepository.save(newUser);
                });
    }

    @GetMapping("/user/{auth0UserId}")
    public ResponseEntity<List<CourseDTO>> getCoursesByAuth0UserId(@PathVariable String auth0UserId) {
        System.out.println("Fetching courses for user with ID: {" + auth0UserId + "}");

        User user = userRepository.findByAuth0UserId(auth0UserId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        List<CourseDTO> courses = userCourseService.getCoursesByUserId(user.getId());
        System.out.println("Fetched {" + courses.size() + "} courses " + " for user with ID: {" + auth0UserId + "}");
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
