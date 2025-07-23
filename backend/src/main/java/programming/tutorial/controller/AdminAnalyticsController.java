package programming.tutorial.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import programming.tutorial.dto.CourseCompletionDTO;
import programming.tutorial.dto.CourseRatingDTO;
import programming.tutorial.services.AdminAnalyticsService;

import java.util.List;

@RestController
@RequestMapping("/api/admin/analytics")
@PreAuthorize("hasRole('ADMIN')")
public class AdminAnalyticsController {

    @Autowired
    private AdminAnalyticsService adminAnalyticsService;

    @GetMapping("/top-rated-courses")
    public ResponseEntity<List<CourseRatingDTO>> getTopRatedCourses() {
        return ResponseEntity.ok(adminAnalyticsService.getTopRatedCourses());
    }

    @GetMapping("/completion-rates")
    public ResponseEntity<List<CourseCompletionDTO>> getCompletionRates() {
        return ResponseEntity.ok(adminAnalyticsService.getCourseCompletionRates());
    }
}
