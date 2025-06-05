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

    @Override
    public Rating saveRating(Rating rating) {
        Optional<Rating> existing = ratingRepository.findByAuth0UserIdAndCourseId(
                rating.getAuth0UserId(), rating.getCourseId()
        );

        if (existing.isPresent()) {
            throw new IllegalStateException("Rating already exists for this user and course");
        }

        return ratingRepository.save(rating);
    }

    @Override
    public List<RatingDTO> getUserRatings(String auth0UserId) {
        return ratingRepository.findByAuth0UserId(auth0UserId)
                .stream()
                .map(r -> new RatingDTO(Math.toIntExact(r.getCourseId()), r.getRating()))
                .collect(Collectors.toList());
    }
}