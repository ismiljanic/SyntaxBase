package programming.tutorial.services;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import programming.tutorial.dao.RatingRepository;
import programming.tutorial.dao.UserCourseRepository;
import programming.tutorial.dto.CourseCompletionDTO;
import programming.tutorial.dto.CourseRatingDTO;
import programming.tutorial.services.impl.AdminAnalyticsServiceJpa;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminAnalyticsServiceTest {

    @Mock
    private RatingRepository ratingRepository;
    @Mock
    private UserCourseRepository userCourseRepository;
    @InjectMocks
    private AdminAnalyticsServiceJpa adminAnalyticsServiceJpa;

    @Test
    void getTopRatedCourses_shouldReturnCourses() {
        CourseRatingDTO course1 = new CourseRatingDTO(1, "Java 101", 4.5);
        CourseRatingDTO course2 = new CourseRatingDTO(2, "Spring Boot", 4.8);

        when(ratingRepository.findAverageRatingsByCourse())
                .thenReturn(List.of(course1, course2));

        List<CourseRatingDTO> result = adminAnalyticsServiceJpa.getTopRatedCourses();

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Java 101", result.get(0).getCourseName());
        assertEquals(4.8, result.get(1).getAverageRating());

        verify(ratingRepository, times(1)).findAverageRatingsByCourse();
    }

    @Test
    void getCourseCompletionRates_shouldReturnRates() {
        CourseCompletionDTO course1 = new CourseCompletionDTO(1, "Java 101", 100L, 80L, 80.0);
        CourseCompletionDTO course2 = new CourseCompletionDTO(2, "Spring Boot", 50L, 45L, 90.0);

        when(userCourseRepository.findCourseCompletionRates())
                .thenReturn(List.of(course1, course2));

        List<CourseCompletionDTO> result = adminAnalyticsServiceJpa.getCourseCompletionRates();

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(100, result.get(0).getTotalEnrolled());
        assertEquals(90.0, result.get(1).getCompletionRate());

        verify(userCourseRepository, times(1)).findCourseCompletionRates();
    }
}