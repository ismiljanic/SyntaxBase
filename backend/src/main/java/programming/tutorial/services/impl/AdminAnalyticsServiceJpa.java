package programming.tutorial.services.impl;

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import programming.tutorial.dao.RatingRepository;
import programming.tutorial.dao.UserCourseRepository;
import programming.tutorial.dto.CourseCompletionDTO;
import programming.tutorial.dto.CourseRatingDTO;
import programming.tutorial.services.AdminAnalyticsService;

import java.util.List;

import org.slf4j.Logger;

@Service
public class AdminAnalyticsServiceJpa implements AdminAnalyticsService {
    private static final Logger logger = LoggerFactory.getLogger(AdminAnalyticsServiceJpa.class);
    @Autowired
    private RatingRepository ratingRepository;
    @Autowired
    private UserCourseRepository userCourseRepository;

    @Override
    public List<CourseRatingDTO> getTopRatedCourses() {
        List<CourseRatingDTO> topRatedCourses = ratingRepository.findAverageRatingsByCourse();

        logger.info("Fetched top-rated courses");
        topRatedCourses.forEach(course ->
                logger.info("Course ID: {}, Title: {}, Avg Rating: {}",
                        course.getCourseId(), course.getCourseName(), course.getAverageRating())
        );

        return topRatedCourses;
    }

    @Override
    public List<CourseCompletionDTO> getCourseCompletionRates() {
        List<CourseCompletionDTO> completionRates = userCourseRepository.findCourseCompletionRates();

        logger.info("Fetched course completion rates:");
        completionRates.forEach(course ->
                logger.info("Course ID: {}, Title: {}, Enrolled: {}, Completed: {}, Rate: {}%",
                        course.getCourseId(), course.getCourseName(),
                        course.getTotalEnrolled(), course.getCompletedCount(), course.getCompletionRate())
        );

        return completionRates;
    }
}
