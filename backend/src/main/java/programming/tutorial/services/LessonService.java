package programming.tutorial.services;

import org.springframework.stereotype.Service;
import programming.tutorial.dto.LessonDTO;

import java.util.Optional;

@Service
public interface LessonService {

    Optional<LessonDTO> getFirstLesson(Integer courseId);

    Optional<LessonDTO> getLessonByCourseIdAndLessonId(Integer courseId, Integer lessonId);

    Optional<LessonDTO> getNextLesson(Integer courseId, Integer currentLessonId);
    Optional<LessonDTO> getPreviousLesson(Integer courseId, Integer currentLessonId);
}
