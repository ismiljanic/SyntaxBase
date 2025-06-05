package programming.tutorial.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import programming.tutorial.dto.CourseDTO;
import programming.tutorial.dto.StartCourseRequest;
import programming.tutorial.services.UserCourseService;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/user-courses")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class UserCourseController {

    @Autowired
    private UserCourseService userCourseService;

    @PostMapping("/startCourse")
    public ResponseEntity<String> enrollUserInCourse(@RequestBody StartCourseRequest request, Principal principal) {
        try {
            String authenticatedAuth0UserId = principal.getName();
            if (!authenticatedAuth0UserId.equals(request.getAuth0UserId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid user id");
            }

            userCourseService.startCourseForUser(request);
            return ResponseEntity.ok().build();

        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("You are already enrolled in this course.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid input.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Server error.");
        }
    }

    @GetMapping("/user/{auth0UserId}")
    public ResponseEntity<List<CourseDTO>> getCoursesByAuth0UserId(@PathVariable String auth0UserId) {
        List<CourseDTO> courses = userCourseService.getCoursesByUserId(auth0UserId);
        return ResponseEntity.ok(courses);
    }

    @PutMapping("/completeCourse/{courseId}")
    public ResponseEntity<String> completeCourse(@PathVariable Integer courseId, @AuthenticationPrincipal Jwt principal) {
        String userId = principal.getSubject();
        boolean success = userCourseService.markCourseAsCompleted(userId, courseId);
        if (success) {
            return ResponseEntity.ok("Course marked as completed");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Course enrollment not found");
        }
    }
}
