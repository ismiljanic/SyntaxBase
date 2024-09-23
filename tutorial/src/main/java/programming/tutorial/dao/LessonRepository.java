package programming.tutorial.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import programming.tutorial.domain.Lesson;

import java.util.Optional;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Integer> {
    @Query("SELECT l FROM Lesson l WHERE l.course.id = :courseId AND l.id = (SELECT MIN(l2.id) FROM Lesson l2 WHERE l2.course.id = :courseId AND l2.id > :currentLessonId)")
    Optional<Lesson> findNextLesson(@Param("courseId") Integer courseId, @Param("currentLessonId") Integer currentLessonId);

    @Query("SELECT COUNT(l) FROM Lesson l WHERE l.course.id = :courseId AND l.user.id = :userId")
    Long countLessonsForCourse(@Param("courseId") Integer courseId, @Param("userId") Integer userId);

    @Query("SELECT COUNT(l) FROM Lesson l WHERE l.course.id = :courseId AND l.user.id = :userId AND l.completed = true")
    Long countCompletedLessonsForUserAndCourse(@Param("courseId") Integer courseId, @Param("userId") Integer userId);
}