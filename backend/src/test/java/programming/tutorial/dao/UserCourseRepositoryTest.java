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
import programming.tutorial.domain.User;
import programming.tutorial.domain.UserCourse;
import programming.tutorial.dto.CourseCompletionDTO;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = Replace.ANY)
@ActiveProfiles("test")
class UserCourseRepositoryTest {

    @Autowired
    private UserCourseRepository userCourseRepository;

    @Autowired
    private TestEntityManager entityManager;

    private User user1;
    private User user2;
    private Course course1;
    private Course course2;

    @BeforeEach
    void setup() {
        user1 = new User();
        user1.setAuth0UserId("auth0|user1");
        user1.setName("John");
        user1.setSurname("Doe");
        user1.setPassword("pass");
        user1.setUsername("john");
        user1.setDateCreated(LocalDateTime.now());
        user1.setActive(true);
        entityManager.persist(user1);

        user2 = new User();
        user2.setAuth0UserId("auth0|user2");
        user2.setName("Jane");
        user2.setSurname("Doe");
        user2.setPassword("pass");
        user2.setUsername("jane");
        user2.setDateCreated(LocalDateTime.now());
        user2.setActive(true);
        entityManager.persist(user2);

        course1 = new Course();
        course1.setCourseName("Java Basics");
        entityManager.persist(course1);

        course2 = new Course();
        course2.setCourseName("Spring Boot");
        entityManager.persist(course2);

        UserCourse uc1 = new UserCourse();
        uc1.setUser(user1);
        uc1.setCourse(course1);
        uc1.setCompleted(true);
        entityManager.persist(uc1);

        UserCourse uc2 = new UserCourse();
        uc2.setUser(user1);
        uc2.setCourse(course2);
        uc2.setCompleted(false);
        entityManager.persist(uc2);

        UserCourse uc3 = new UserCourse();
        uc3.setUser(user2);
        uc3.setCourse(course1);
        uc3.setCompleted(true);
        entityManager.persist(uc3);

        entityManager.flush();
    }

    @Test
    void testFindByUser_Auth0UserId() {
        List<UserCourse> user1Courses = userCourseRepository.findByUser_Auth0UserId("auth0|user1");
        assertThat(user1Courses).hasSize(2);
        assertThat(user1Courses).extracting("course.courseName")
                .containsExactlyInAnyOrder("Java Basics", "Spring Boot");
    }

    @Test
    void testExistsByUser_Auth0UserIdAndCourseId() {
        boolean exists = userCourseRepository.existsByUser_Auth0UserIdAndCourseId("auth0|user1", course1.getId());
        assertThat(exists).isTrue();

        boolean notExists = userCourseRepository.existsByUser_Auth0UserIdAndCourseId("auth0|user2", course2.getId());
        assertThat(notExists).isFalse();
    }

    @Test
    void testFindByUser_Auth0UserIdAndCourseId() {
        List<UserCourse> list = userCourseRepository.findByUser_Auth0UserIdAndCourseId("auth0|user1", course1.getId());
        assertThat(list).hasSize(1);
        assertThat(list.get(0).getCompleted()).isTrue();
    }

    @Test
    void testExistsByUserIdAndCourseId() {
        boolean exists = userCourseRepository.existsByUserIdAndCourseId(user1.getId(), course1.getId());
        assertThat(exists).isTrue();

        boolean notExists = userCourseRepository.existsByUserIdAndCourseId(user2.getId(), course2.getId());
        assertThat(notExists).isFalse();
    }

    @Test
    void testFindCourseCompletionRates() {
        List<CourseCompletionDTO> rates = userCourseRepository.findCourseCompletionRates();

        assertThat(rates).hasSize(2);
        CourseCompletionDTO javaRate = rates.stream()
                .filter(r -> r.getCourseName().equals("Java Basics"))
                .findFirst()
                .orElseThrow();
        assertThat(javaRate.getCompletedCount()).isEqualTo(2);
        assertThat(javaRate.getTotalEnrolled()).isEqualTo(2);
        assertThat(javaRate.getCompletionRate()).isEqualTo(1.0);

        CourseCompletionDTO springRate = rates.stream()
                .filter(r -> r.getCourseName().equals("Spring Boot"))
                .findFirst()
                .orElseThrow();
        assertThat(springRate.getCompletedCount()).isEqualTo(0);
        assertThat(springRate.getTotalEnrolled()).isEqualTo(1);
        assertThat(springRate.getCompletionRate()).isEqualTo(0.0);
    }

    @Test
    void testCountByUserAndCompletedTrue() {
        int completedCount = userCourseRepository.countByUserAndCompletedTrue(user1);

        assertThat(completedCount).isEqualTo(1);
    }
}