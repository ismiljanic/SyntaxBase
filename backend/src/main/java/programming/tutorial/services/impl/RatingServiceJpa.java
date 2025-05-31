package programming.tutorial.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import programming.tutorial.dao.RatingRepository;
import programming.tutorial.domain.Rating;
import programming.tutorial.dto.RatingDTO;
import programming.tutorial.services.RatingService;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RatingServiceJpa implements RatingService {

    @Autowired
    private RatingRepository ratingRepository;

    @Override
    public Rating getRating(Long courseId) {
        return ratingRepository.findByCourseId(courseId);
    }

    public Rating saveRating(Rating rating) {
        String auth0UserId = rating.getAuth0UserId();
        Long courseId = rating.getCourseId();

        Optional<Rating> existingRating = ratingRepository.findByAuth0UserIdAndCourseId(auth0UserId, courseId);

        if (existingRating.isPresent()) {
            throw new IllegalStateException("User has already rated this course");
        }

        return ratingRepository.save(rating);
    }


    public List<RatingDTO> getUserRatings(String userId) {
        List<Rating> ratings = ratingRepository.findByAuth0UserId(userId);
        return ratings.stream().map(rating -> new RatingDTO(Math.toIntExact(rating.getCourseId()), rating.getRating()))
                .collect(Collectors.toList());
    }

}