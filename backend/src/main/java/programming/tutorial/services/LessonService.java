package programming.tutorial.services;

import org.springframework.stereotype.Service;
import programming.tutorial.dto.LessonDTO;

import java.util.Optional;

@Service
public interface LessonService {

    Optional<LessonDTO> getFirstLesson(Integer courseId, Integer userId);

    Optional<LessonDTO> getLessonByCourseIdAndLessonId(Integer courseId, Integer lessonId);

    Optional<LessonDTO> getNextLesson(Integer courseId, Integer currentLessonId, Integer userId);
    Optional<LessonDTO> getPreviousLesson(Integer courseId, Integer currentLessonId, Integer userId);

    Optional<LessonDTO> getLessonByCourseIdAndLessonNumber(Integer courseId, Integer lessonId);

    Optional<LessonDTO> getLessonByCourseIdAndCurrentUserProgress(Integer courseId, String userId);

    Integer findLessonIdByCourseAndNumberAndUser(String courseId, int lessonNumber, String userId);
}
