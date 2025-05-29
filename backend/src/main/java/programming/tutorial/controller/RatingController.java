package programming.tutorial.controller;// RatingController.java

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import programming.tutorial.dao.UserRepository;
import programming.tutorial.domain.Rating;
import programming.tutorial.domain.User;
import programming.tutorial.dto.RatingDTO;
import programming.tutorial.services.RatingService;

import java.util.List;

@RestController
@RequestMapping("/api/ratings")
public class RatingController {
    @Autowired
    private RatingService ratingService;

    @Autowired
    private UserRepository userRepository;

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

    @GetMapping("/user/{auth0UserId}")
    public ResponseEntity<List<RatingDTO>> getUserRatingsByAuth0Id(@PathVariable String auth0UserId) {
        User user = userRepository.findByAuth0UserId(auth0UserId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        List<RatingDTO> ratings = ratingService.getUserRatings(user.getId());
        return ResponseEntity.ok(ratings);
    }
}
