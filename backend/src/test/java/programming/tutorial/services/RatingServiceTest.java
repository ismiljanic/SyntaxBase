package programming.tutorial.services;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import programming.tutorial.dao.RatingRepository;
import programming.tutorial.domain.Rating;
import programming.tutorial.dto.RatingDTO;
import programming.tutorial.services.impl.RatingServiceJpa;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class RatingServiceTest {

    @Mock
    private RatingRepository ratingRepository;
    @InjectMocks
    private RatingServiceJpa ratingServiceJpa;

    @Test
    void getRating_returnsRating() {
        Rating rating = new Rating();
        rating.setCourseId(1L);
        rating.setRating(5);

        when(ratingRepository.findByCourseId(1L)).thenReturn(rating);

        Rating result = ratingServiceJpa.getRating(1L);

        assertNotNull(result);
        assertEquals(5, result.getRating());
        verify(ratingRepository).findByCourseId(1L);
    }

    @Test
    void getRating_returnsNullWhenNotFound() {
        when(ratingRepository.findByCourseId(99L)).thenReturn(null);

        Rating result = ratingServiceJpa.getRating(99L);

        assertNull(result);
        verify(ratingRepository).findByCourseId(99L);
    }


    @Test
    void saveRating_savesWhenNoExisting() {
        Rating rating = new Rating();
        rating.setAuth0UserId("auth0|123");
        rating.setCourseId(1L);
        rating.setRating(4);

        when(ratingRepository.findByAuth0UserIdAndCourseId("auth0|123", 1L))
                .thenReturn(Optional.empty());
        when(ratingRepository.save(rating)).thenReturn(rating);

        Rating result = ratingServiceJpa.saveRating(rating);

        assertEquals(4, result.getRating());
        verify(ratingRepository).save(rating);
    }

    @Test
    void saveRating_throwsIfExistingFound() {
        Rating rating = new Rating();
        rating.setAuth0UserId("auth0|123");
        rating.setCourseId(1L);

        when(ratingRepository.findByAuth0UserIdAndCourseId("auth0|123", 1L))
                .thenReturn(Optional.of(new Rating()));

        IllegalStateException ex = assertThrows(IllegalStateException.class,
                () -> ratingServiceJpa.saveRating(rating));

        assertEquals("Rating already exists for this user and course", ex.getMessage());
        verify(ratingRepository, never()).save(any());
    }

    @Test
    void getUserRatings_returnsEmptyListWhenNoneExist() {
        when(ratingRepository.findByAuth0UserId("auth0|empty"))
                .thenReturn(Collections.emptyList());

        List<RatingDTO> result = ratingServiceJpa.getUserRatings("auth0|empty");

        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(ratingRepository).findByAuth0UserId("auth0|empty");
    }
}
