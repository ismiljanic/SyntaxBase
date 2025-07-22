package programming.tutorial.services;

import org.springframework.stereotype.Service;
import programming.tutorial.dto.CourseCompletionDTO;
import programming.tutorial.dto.CourseRatingDTO;

import java.util.List;

@Service
public interface AdminAnalyticsService {
    List<CourseRatingDTO> getTopRatedCourses();
    List<CourseCompletionDTO> getCourseCompletionRates();
}
