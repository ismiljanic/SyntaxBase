package programming.tutorial.controller;// RatingController.java

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import programming.tutorial.domain.Rating;
import programming.tutorial.dto.RatingDTO;
import programming.tutorial.services.RatingService;

import java.util.List;

@RestController
@RequestMapping("/api/ratings")
public class RatingController {
    @Autowired
    private RatingService ratingService;

    @GetMapping("/{courseId}")
    public ResponseEntity<Rating> getRating(@PathVariable Long courseId) {
        Rating rating = ratingService.getRating(courseId);
        return ResponseEntity.ok(rating);
    }

    @PostMapping("/save")
    public ResponseEntity<Rating> saveRating(@RequestBody Rating rating) {
        Rating savedRating = ratingService.saveRating(rating);
        return ResponseEntity.ok(savedRating);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<RatingDTO>> getUserRatings(@PathVariable Long userId) {
        List<RatingDTO> ratings = ratingService.getUserRatings(Math.toIntExact(userId));
        return ResponseEntity.ok(ratings);
    }
}
