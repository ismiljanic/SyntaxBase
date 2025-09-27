package programming.tutorial.services;

import org.springframework.stereotype.Service;
import programming.tutorial.domain.Rating;
import programming.tutorial.dto.RatingDTO;

import java.util.List;

public interface RatingService {
    Rating getRating(Long courseId);
    Rating saveRating(Rating rating);
    List<RatingDTO> getUserRatings(String auth0UserId);
}
