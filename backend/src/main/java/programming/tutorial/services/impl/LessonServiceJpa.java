package programming.tutorial.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import programming.tutorial.dao.LessonRepository;
import programming.tutorial.domain.Lesson;
import programming.tutorial.dto.LessonDTO;
import programming.tutorial.services.LessonService;

import java.util.List;
import java.util.Optional;

@Service
public class LessonServiceJpa implements LessonService {

    @Autowired
    private LessonRepository lessonRepository;

    public Optional<LessonDTO> getFirstLesson(Integer courseId) {
        return lessonRepository.findFirstByCourse_IdOrderByIdAsc(courseId)
                .map(lesson -> new LessonDTO(lesson.getId(), lesson.getLessonName(), courseId));
    }

    private LessonDTO convertToDto(Lesson lesson) {
        if (lesson == null) {
            return null;
        }

        LessonDTO dto = new LessonDTO();
        dto.setId(lesson.getId());
        dto.setLessonName(lesson.getLessonName());
        dto.setCourseId(lesson.getCourse() != null ? lesson.getCourse().getId() : null);
        dto.setUserId(lesson.getUser() != null ? lesson.getUser().getId() : null);
        dto.setCompleted(lesson.isCompleted() ? "true" : "false");
        dto.setContent(lesson.getContent());
        return dto;
    }


    @Override
    public Optional<LessonDTO> getLessonByCourseIdAndLessonId(Integer courseId, Integer lessonId) {
        List<Lesson> lessons = lessonRepository.findByCourse_IdOrderByIdAsc(courseId);

        Optional<Lesson> targetLessonOpt = lessons.stream()
                .filter(lesson -> lesson.getId().equals(lessonId))
                .findFirst();

        if (targetLessonOpt.isEmpty()) {
            System.out.println("Lesson not found for courseId=" + courseId + ", lessonId=" + lessonId);
            return Optional.empty();
        }

        Lesson lesson = targetLessonOpt.get();

        boolean isFirst = lessons.get(0).getId().equals(lesson.getId());
        boolean isLast = lessons.get(lessons.size() - 1).getId().equals(lesson.getId());

        LessonDTO dto = convertToDto(lesson);
        dto.setFirst(isFirst);
        dto.setLast(isLast);

        return Optional.of(dto);
    }


    public Optional<LessonDTO> getNextLesson(Integer courseId, Integer currentLessonId) {
        return lessonRepository.findNextLesson(courseId, currentLessonId)
                .map(this::convertToDto);
    }

    public Optional<LessonDTO> getPreviousLesson(Integer courseId, Integer currentLessonId) {
        return lessonRepository.findPreviousLesson(courseId, currentLessonId)
                .map(this::convertToDto);
    }

}
