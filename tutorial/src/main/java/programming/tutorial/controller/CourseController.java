package programming.tutorial.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import programming.tutorial.domain.Course;
import programming.tutorial.dto.CourseDTO;
import programming.tutorial.services.CourseService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "*")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable Integer id) {
        Optional<Course> course = courseService.findById(new CourseDTO(id, null, 0, null, null));
        return course.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<Course> getCourseByName(@PathVariable String name) {
        Optional<Course> course = courseService.findByName(new CourseDTO(null, name, 0, null, null));
        return course.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Course> createCourse(@RequestBody CourseDTO courseDTO) {
        Course course = courseService.saveCourse(courseDTO);
        System.out.println("Created course: " + course.getId() + ", Name: " + course.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(course);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Course> updateCourse(@PathVariable Integer id, @RequestBody CourseDTO courseDTO) {
        CourseDTO updatedCourseDTO = new CourseDTO(id, courseDTO.getCourseName(), courseDTO.getCourseLength(), courseDTO.getDescription(), courseDTO.getCategory());
        Course course = courseService.saveCourse(updatedCourseDTO);
        System.out.println("Updated course: " + course.getId() + ", Name: " + course.getName());
        return ResponseEntity.ok(course);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable Integer id) {
        courseService.deleteCourse(id);
        System.out.println("Deleted course with ID: " + id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public List<CourseDTO> getAllCourses() {
        List<CourseDTO> courses = courseService.getAllCourses();
        System.out.println("Courses returned by getAllCourses:");
        for (CourseDTO course : courses) {
            System.out.println("Course ID: " + course.getCourseId() + ", Name: " + course.getCourseName());
        }
        return courses;
    }
}