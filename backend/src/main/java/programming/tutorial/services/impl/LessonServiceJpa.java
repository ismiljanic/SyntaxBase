package programming.tutorial.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import programming.tutorial.dao.LessonRepository;
import programming.tutorial.domain.Lesson;
import programming.tutorial.dto.LessonDTO;
import programming.tutorial.services.LessonService;

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
        Optional<Lesson> lessonOpt = lessonRepository.findByIdAndCourse_Id(lessonId, courseId);
        System.out.println("Looking for lessonId=" + lessonId + ", courseId=" + courseId);
        System.out.println("Found? " + lessonOpt.isPresent());

        return lessonRepository.findByIdAndCourse_Id(lessonId, courseId)
                .map(this::convertToDto);
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
