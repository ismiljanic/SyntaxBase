package programming.tutorial.controller;// RatingController.java

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import programming.tutorial.dao.RatingRepository;
import programming.tutorial.dao.UserRepository;
import programming.tutorial.domain.Rating;
import programming.tutorial.domain.User;
import programming.tutorial.dto.RatingDTO;
import programming.tutorial.services.RatingService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/ratings")
public class RatingController {

    @Autowired
    private RatingService ratingService;

    @GetMapping("/{courseId}")
    public ResponseEntity<Rating> getRating(@PathVariable Long courseId) {
        return ResponseEntity.ok(ratingService.getRating(courseId));
    }

    @PostMapping("/save")
    public ResponseEntity<?> saveRating(@RequestBody Rating rating) {
        try {
            return ResponseEntity.ok(ratingService.saveRating(rating));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to save rating");
        }
    }

    @GetMapping("/user/{auth0UserId}")
    public ResponseEntity<List<RatingDTO>> getUserRatingsByAuth0Id(@PathVariable String auth0UserId) {
        return ResponseEntity.ok(ratingService.getUserRatings(auth0UserId));
    }
}