package programming.tutorial.services;

import org.springframework.stereotype.Service;
import programming.tutorial.domain.Rating;
import programming.tutorial.dto.RatingDTO;

import java.util.List;

@Service
public interface RatingService {
    public Rating getRating(Long courseId);
    public Rating saveRating(Rating rating);
    public List<RatingDTO> getUserRatings(String userId);
}