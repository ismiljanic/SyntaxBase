package programming.tutorial.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import programming.tutorial.dto.CourseDTO;
import programming.tutorial.dto.UserCourseDTO;
import programming.tutorial.services.UserCourseService;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user-courses")
@CrossOrigin(origins = "*")
public class UserCourseController {

    @Autowired
    private UserCourseService userCourseService;

    @PostMapping
    public ResponseEntity<String> enrollUserInCourse(@RequestBody UserCourseDTO userCourseDTO) {
        try {
            userCourseService.enrollUserInCourse(userCourseDTO);
            return ResponseEntity.ok().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("You are already enrolled in this course.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid input.");
        }
    }



    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CourseDTO>> getCoursesByUserId(@PathVariable Integer userId) {
        List<CourseDTO> courses = userCourseService.getCoursesByUserId(userId);
        return ResponseEntity.ok(courses);
    }
}
