package programming.tutorial.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import programming.tutorial.domain.Lesson;
import programming.tutorial.domain.LessonFeedback;
import programming.tutorial.domain.User;

import java.util.Optional;
@Repository
public interface LessonFeedbackRepository extends JpaRepository<LessonFeedback, Integer> {

    Optional<LessonFeedback> findByLessonAndUser(Lesson lesson, User user);
    boolean existsByLessonIdAndUserAuth0UserId(Integer lessonId, String userId);
}
