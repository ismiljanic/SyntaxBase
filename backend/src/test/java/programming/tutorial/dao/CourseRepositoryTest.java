package programming.tutorial.dao;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;
import programming.tutorial.domain.Course;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = Replace.ANY)
@ActiveProfiles("test")
class CourseRepositoryTest {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private TestEntityManager entityManager;

    private Course course;

    @BeforeEach
    void setUp() {
        course = new Course();
        course.setCategory("Programming");
        course.setCourseName("Java Basics");
        entityManager.persist(course);
        entityManager.flush();
    }

    @Test
    void findById() {
        Optional<Course> result = courseRepository.findById(course.getId());
        assertThat(result).isPresent();
        assertThat(result.get().getCourseName()).isEqualTo("Java Basics");
    }

    @Test
    void testFindByCategory() {
        Course result = courseRepository.findByCategory("Programming");
        assertThat(result).isNotNull();
        assertThat(result.getCourseName()).isEqualTo("Java Basics");
    }

    @Test
    void testFindByCourseName() {
        Course result = courseRepository.findByCourseName("Java Basics");
        assertThat(result).isNotNull();
        assertThat(result.getCategory()).isEqualTo("Programming");
    }
}