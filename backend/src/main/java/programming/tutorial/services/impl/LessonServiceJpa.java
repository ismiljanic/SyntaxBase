package programming.tutorial.services.impl;

import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.javapoet.ClassName;
import org.springframework.stereotype.Service;
import programming.tutorial.dao.CourseRepository;
import programming.tutorial.dao.LessonRepository;
import programming.tutorial.dao.UserProgressRepository;
import programming.tutorial.dao.UserRepository;
import programming.tutorial.domain.Course;
import programming.tutorial.domain.Lesson;
import programming.tutorial.domain.User;
import programming.tutorial.dto.LessonDTO;
import programming.tutorial.services.LessonService;

import java.util.List;
import java.util.Optional;

@Service
public class LessonServiceJpa implements LessonService {

    @Autowired
    private LessonRepository lessonRepository;
    @Autowired
    private UserProgressRepository userProgressRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserRepository userRepository;

    private static final Logger logger = LoggerFactory.getLogger(ClassName.class);

    public Optional<LessonDTO> getFirstLesson(Integer courseId, Integer userId) {
        return lessonRepository.findFirstByCourseIdOrderByLessonNumberAsc(courseId)
                .map(LessonDTO::fromEntity);
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
        dto.setCompleted(lesson.isCompleted());
        dto.setContent(lesson.getContent());
        dto.setLessonNumber(lesson.getLessonNumber());
        return dto;
    }


    @Override
    public Optional<LessonDTO> getLessonByCourseIdAndLessonNumber(Integer courseId, Integer lessonNumber) {
        List<Lesson> lessons = lessonRepository.findByCourse_IdOrderByLessonNumberAsc(courseId);

        Optional<Lesson> targetLessonOpt = lessons.stream()
                .filter(lesson -> lesson.getLessonNumber() != null && lesson.getLessonNumber().equals(lessonNumber))
                .findFirst();

        if (targetLessonOpt.isEmpty()) {
            System.out.println("Lesson not found for courseId=" + courseId + ", lessonNumber=" + lessonNumber);
            return Optional.empty();
        }

        Lesson lesson = targetLessonOpt.get();

        boolean isFirst = lessons.get(0).getLessonNumber().equals(lesson.getLessonNumber());
        boolean isLast = lessons.get(lessons.size() - 1).getLessonNumber().equals(lesson.getLessonNumber());

        LessonDTO dto = convertToDto(lesson);
        dto.setFirst(isFirst);
        dto.setLast(isLast);

        return Optional.of(dto);
    }

    @Override
    public Optional<LessonDTO> getLessonByCourseIdAndCurrentUserProgress(Integer courseId, String userId) {

        Optional<LessonDTO> currentLessonOpt = userProgressRepository.findByUser_Auth0UserIdAndCourse_Id(userId, courseId)
                .map(userProgress -> {
                    Lesson currentLesson = userProgress.getCurrentLesson();
                    logger.info("Found current lesson for user: id={}, name={}, number={}",
                            currentLesson.getId(), currentLesson.getLessonName(), currentLesson.getLessonNumber());
                    return new LessonDTO(currentLesson.getId(), currentLesson.getLessonName(), currentLesson.getLessonNumber());
                });

        if (currentLessonOpt.isPresent()) {
            return currentLessonOpt;
        } else {
            logger.info("No current lesson found in user progress, fetching first lesson of course");
            Optional<Lesson> firstLessonOpt = lessonRepository.findFirstByCourseIdOrderByLessonNumberAsc(courseId);

            if (firstLessonOpt.isPresent()) {
                Lesson firstLesson = firstLessonOpt.get();
                logger.info("Found first lesson: id={}, name={}, number={}",
                        firstLesson.getId(), firstLesson.getLessonName(), firstLesson.getLessonNumber());
            } else {
                logger.warn("No lessons found for courseId: {}", courseId);
            }

            return firstLessonOpt.map(lesson -> new LessonDTO(lesson.getId(), lesson.getLessonName(), lesson.getLessonNumber()));
        }
    }

    @Override
    public Integer findLessonIdByCourseAndNumberAndUser(String courseId, int lessonNumber, String auth0UserId) {
        Optional<User> userOpt = userRepository.findByAuth0UserId(auth0UserId);

        if (userOpt.isEmpty()) {
            throw new EntityNotFoundException("User not found for auth0UserId: " + auth0UserId);
        }

        Integer userId = userOpt.get().getId();

        Optional<Lesson> lesson = lessonRepository.findByCourseIdAndLessonNumberAndUserId(
                Integer.parseInt(courseId),
                lessonNumber,
                userId
        );

        return lesson.map(Lesson::getId).orElse(null);
    }


    public Optional<LessonDTO> getLessonByCourseIdAndLessonId(Integer courseId, Integer lessonId) {
        Optional<Lesson> lessonOpt = lessonRepository.findById(lessonId);

        if (lessonOpt.isEmpty() || !lessonOpt.get().getCourse().getId().equals(courseId)) {
            return Optional.empty();
        }

        Integer lessonNumber = lessonOpt.get().getLessonNumber();

        return getLessonByCourseIdAndLessonNumber(courseId, lessonNumber);
    }


    public Optional<LessonDTO> getNextLesson(Integer courseId, Integer currentLessonNumber, Integer userId) {
        return lessonRepository.findNextLesson(courseId, currentLessonNumber, userId)
                .map(this::convertToDto);
    }

    public Optional<LessonDTO> getPreviousLesson(Integer courseId, Integer currentLessonNumber, Integer userId) {
        return lessonRepository.findPreviousLesson(courseId, currentLessonNumber, userId)
                .map(this::convertToDto);
    }
}
