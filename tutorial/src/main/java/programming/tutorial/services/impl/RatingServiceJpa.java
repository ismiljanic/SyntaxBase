package programming.tutorial.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import programming.tutorial.dao.RatingRepository;
import programming.tutorial.domain.Rating;
import programming.tutorial.dto.RatingDTO;
import programming.tutorial.services.RatingService;

import java.util.List;
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
        return ratingRepository.save(rating);
    }

    public List<RatingDTO> getUserRatings(Integer userId) {
        List<Rating> ratings = ratingRepository.findByUserId(Long.valueOf(userId));
        return ratings.stream().map(rating -> new RatingDTO(Math.toIntExact(rating.getCourseId()), rating.getRating()))
                .collect(Collectors.toList());
    }

}