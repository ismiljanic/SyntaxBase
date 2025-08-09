package programming.tutorial.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import programming.tutorial.domain.Course;
import programming.tutorial.domain.Lesson;
import programming.tutorial.domain.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Integer> {

    @Query("SELECT l FROM Lesson l WHERE l.course.id = :courseId AND l.user.id = :userId AND l.lessonNumber = (SELECT MIN(l2.lessonNumber) FROM Lesson l2 WHERE l2.course.id = :courseId AND l2.lessonNumber > :currentLessonNumber AND l2.user.id = :userId)")
    Optional<Lesson> findNextLesson(@Param("courseId") Integer courseId, @Param("currentLessonNumber") Integer currentLessonNumber, @Param("userId") Integer userId);

    @Query("SELECT l FROM Lesson l WHERE l.course.id = :courseId AND l.user.id = :userId AND l.lessonNumber = (SELECT MAX(l2.lessonNumber) FROM Lesson l2 WHERE l2.course.id = :courseId AND l2.user.id = :userId AND l2.lessonNumber < :currentLessonNumber)")
    Optional<Lesson> findPreviousLesson(@Param("courseId") Integer courseId, @Param("currentLessonNumber") Integer currentLessonNumber, @Param("userId") Integer userId);

    @Query("SELECT COUNT(DISTINCT l.id) FROM Lesson l WHERE l.course.id = :courseId")
    Long getCourseLength(@Param("courseId") Integer courseId);

    @Query("SELECT COUNT(l) FROM Lesson l WHERE l.course.id = :courseId AND l.user.id = :userId AND l.completed = true")
    Long countCompletedLessonsForUserAndCourse(@Param("courseId") Integer courseId, @Param("userId") Integer userId);

    List<Lesson> findByCourse_IdAndUser_Auth0UserId(Integer id, String auth0UserId);

    Optional<Lesson> findFirstByCourse_IdOrderByIdAsc(Integer courseId);

    Optional<Lesson> findByIdAndCourse_Id(Integer lessonId, Integer courseId);

    List<Lesson> findByCourse_IdOrderByLessonNumberAsc(Integer courseId);

    Optional<Lesson> findFirstByCourse_IdAndUser_IdOrderByIdAsc(Integer courseId, Integer userId);

    List<Lesson> findByCourseIdOrderByIdAsc(Integer courseId);

    Optional<Lesson> findFirstByCourseIdOrderByLessonNumberAsc(Integer courseId);

    Optional<Lesson> findByCourseIdAndLessonNumberAndUserId(int courseId, int lessonNumber, int userId);

    Optional<Lesson> findByCourseIdAndLessonNumber(Integer courseId, Integer nextLessonNumber);

    void deleteByUserIdAndCourseId(Integer userId, Integer courseId);
}