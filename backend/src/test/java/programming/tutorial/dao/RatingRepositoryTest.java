package programming.tutorial.dao;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;
import programming.tutorial.domain.Course;
import programming.tutorial.domain.Rating;
import programming.tutorial.dto.CourseRatingDTO;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = Replace.ANY)
@ActiveProfiles("test")
class RatingRepositoryTest {

    @Autowired
    private RatingRepository ratingRepository;

    @Autowired
    private TestEntityManager entityManager;

    private Course course1;
    private Course course2;

    @BeforeEach
    void setup() {
        course1 = new Course();
        course1.setCourseName("Java Basics");
        entityManager.persist(course1);

        course2 = new Course();
        course2.setCourseName("Spring Boot");
        entityManager.persist(course2);

        Rating rating1 = new Rating();
        rating1.setAuth0UserId("auth0|user1");
        rating1.setCourseId(Long.valueOf(course1.getId()));
        rating1.setRating(5);
        entityManager.persist(rating1);

        Rating rating2 = new Rating();
        rating2.setAuth0UserId("auth0|user2");
        rating2.setCourseId(Long.valueOf(course2.getId()));
        rating2.setRating(3);
        entityManager.persist(rating2);

        Rating rating3 = new Rating();
        rating3.setAuth0UserId("auth0|user1");
        rating3.setCourseId(Long.valueOf(course2.getId()));
        rating3.setRating(4);
        entityManager.persist(rating3);

        entityManager.flush();
    }

    @Test
    void testFindByCourseId() {
        Rating rating = ratingRepository.findByCourseId(Long.valueOf(course1.getId()));
        assertThat(rating).isNotNull();
        assertThat(rating.getCourseId()).isEqualTo(Long.valueOf(course1.getId()));
    }

    @Test
    void testFindByAuth0UserId() {
        List<Rating> ratings = ratingRepository.findByAuth0UserId("auth0|user1");
        assertThat(ratings).hasSize(2);
        assertThat(ratings).extracting("courseId").containsExactlyInAnyOrder(Long.valueOf(course1.getId()), Long.valueOf(course2.getId()));
    }

    @Test
    void testFindByAuth0UserIdAndCourseId() {
        Optional<Rating> ratingOpt = ratingRepository.findByAuth0UserIdAndCourseId("auth0|user1", Long.valueOf(course1.getId()));
        assertThat(ratingOpt).isPresent();
        assertThat(ratingOpt.get().getRating()).isEqualTo(5);
    }

    @Test
    void testFindAverageRatingsByCourse() {
        List<CourseRatingDTO> averages = ratingRepository.findAverageRatingsByCourse();
        assertThat(averages).hasSize(2);

        CourseRatingDTO first = averages.get(0);
        assertThat(first.getCourseId()).isEqualTo(course1.getId());
        assertThat(first.getAverageRating()).isEqualTo(5.0);

        CourseRatingDTO second = averages.get(1);
        assertThat(second.getCourseId()).isEqualTo(course2.getId());
        assertThat(second.getAverageRating()).isEqualTo(3.5);
    }

    @Test
    void testDeleteByAuth0UserIdAndCourseId() {
        ratingRepository.deleteByAuth0UserIdAndCourseId("auth0|user1", course1.getId());
        entityManager.flush();

        Optional<Rating> ratingOpt = ratingRepository.findByAuth0UserIdAndCourseId("auth0|user1", Long.valueOf(course1.getId()));
        assertThat(ratingOpt).isEmpty();
    }

    @Test
    void testFindByCourseId_nonExistentCourse_returnsNull() {
        Rating rating = ratingRepository.findByCourseId(9999L);
        assertThat(rating).isNull();
    }

    @Test
    void testFindByAuth0UserId_nonExistentUser_returnsEmptyList() {
        List<Rating> ratings = ratingRepository.findByAuth0UserId("auth0|unknown");
        assertThat(ratings).isEmpty();
    }

    @Test
    void testFindByAuth0UserIdAndCourseId_nonExistent_returnsEmptyOptional() {
        Optional<Rating> ratingOpt = ratingRepository.findByAuth0UserIdAndCourseId("auth0|user1", 9999L);
        assertThat(ratingOpt).isEmpty();
    }

    @Test
    void testFindAverageRatingsByCourse_noRatings_returnsEmptyList() {
        ratingRepository.deleteAll();
        entityManager.flush();

        List<CourseRatingDTO> averages = ratingRepository.findAverageRatingsByCourse();
        assertThat(averages).isEmpty();
    }

    @Test
    void testDeleteByAuth0UserIdAndCourseId_nonExistent_doesNotFail() {
        ratingRepository.deleteByAuth0UserIdAndCourseId("auth0|unknown", 9999);
        entityManager.flush();

        List<Rating> allRatings = ratingRepository.findAll();
        assertThat(allRatings).hasSize(3);
    }
}