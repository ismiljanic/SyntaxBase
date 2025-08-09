package programming.tutorial.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import programming.tutorial.domain.Lesson;
import programming.tutorial.domain.LessonFeedback;
import programming.tutorial.domain.User;

import java.util.Optional;
@Repository
public interface LessonFeedbackRepository extends JpaRepository<LessonFeedback, Integer> {

    Optional<LessonFeedback> findByLessonAndUser(Lesson lesson, User user);
    boolean existsByLessonIdAndUserAuth0UserId(Integer lessonId, String userId);

    @Modifying
    @Query("DELETE FROM LessonFeedback lf WHERE lf.user.id = :userId AND lf.lesson.course.id = :courseId")
    void deleteByUserIdAndCourseId(@Param("userId") Integer userId, @Param("courseId") Integer courseId);

}
