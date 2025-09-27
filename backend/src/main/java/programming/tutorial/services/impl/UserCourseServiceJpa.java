package programming.tutorial.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import programming.tutorial.dao.*;
import programming.tutorial.domain.*;
import programming.tutorial.dto.CourseDTO;
import programming.tutorial.dto.StartCourseRequest;
import programming.tutorial.dto.UserCourseDTO;
import programming.tutorial.services.BadgeService;
import programming.tutorial.services.CertificateService;
import programming.tutorial.services.UserCourseService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserCourseServiceJpa implements UserCourseService {

    @Autowired
    private UserCourseRepository userCourseRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LessonRepository lessonRepository;
    @Autowired
    private UserProgressRepository userProgressRepository;
    @Autowired
    private CertificateRepository certificateRepository;

    @Autowired
    private CertificateService certificateService;
    @Autowired
    private BadgeService badgeService;

    @Override
    public void enrollUserInCourse(UserCourseDTO userCourseDTO) {
        if (userCourseDTO.getAuth0UserId() == null || userCourseDTO.getCourseId() == null) {
            throw new IllegalArgumentException("Auth0UserId and Course ID must not be null");
        }

        if (isUserEnrolledInCourse(userCourseDTO.getAuth0UserId(), userCourseDTO.getCourseId())) {
            throw new IllegalStateException("User is already enrolled in this course");
        }

        var user = userRepository.findByAuth0UserId(userCourseDTO.getAuth0UserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        var course = courseRepository.findById(userCourseDTO.getCourseId())
                .orElseThrow(() -> new IllegalArgumentException("Course not found"));

        UserCourse userCourse = new UserCourse();
        userCourse.setUser(user);
        userCourse.setCourse(course);
        userCourse.setCompleted(false);
        userCourseRepository.save(userCourse);

        List<Lesson> existingLessons = lessonRepository.findByCourse_IdAndUser_Auth0UserId(course.getId(), user.getAuth0UserId());

        if (existingLessons.isEmpty()) {
            int totalLessons = course.getLength() != 0 ? course.getLength() : 10;
            for (int i = 1; i <= totalLessons; i++) {
                Lesson lesson = new Lesson();
                lesson.setLessonName("Lesson " + i);
                lesson.setCourse(course);
                lesson.setUser(user);
                lesson.setCompleted(false);
                lesson.setLessonNumber(i);
                lessonRepository.save(lesson);
            }
            System.out.println("Created " + totalLessons + " lessons for user " + user.getUsername() + " in course " + course.getId());
        } else {
            System.out.println("Lessons already exist for user " + user.getUsername() + " in course " + course.getId());
        }
    }

    @Override
    public List<CourseDTO> getCoursesByUserId(String userId) {
        List<UserCourse> userCourses = userCourseRepository.findByUser_Auth0UserId(userId);
        return userCourses.stream()
                .map(userCourse -> {
                    Course course = userCourse.getCourse();
                    return new CourseDTO(course.getId(), course.getCourseName(), course.getLength(), course.getDescription(), course.getCategory(), course.getCreator().getId(), course.isSystemCourse());
                })
                .collect(Collectors.toList());
    }

    @Override
    public boolean isUserEnrolledInCourse(String userId, Integer courseId) {
        return userCourseRepository.existsByUser_Auth0UserIdAndCourseId(userId, courseId);
    }

    private User createNewUser(String auth0UserId) {
        User newUser = new User();
        newUser.setAuth0UserId(auth0UserId);
        newUser.setName("Unknown");
        newUser.setSurname("User");
        newUser.setPassword("");
        newUser.setUsername("user_" + auth0UserId.substring(Math.max(0, auth0UserId.length() - 5)));
        newUser.setDateCreated(LocalDateTime.now());
        newUser.setRole(Role.USER);
        return userRepository.save(newUser);
    }


    @Override
    public void startCourseForUser(StartCourseRequest request) {
        String auth0UserId = request.getAuth0UserId();
        Integer courseId = request.getCourseId();
        User user = userRepository.findByAuth0UserId(auth0UserId)
                .orElseGet(() -> createNewUser(auth0UserId));

        if (!courseRepository.existsById(courseId)) {
            throw new IllegalArgumentException("Invalid course ID");
        }

        enrollUserInCourse(new UserCourseDTO(auth0UserId, courseId));

        boolean progressExists = userProgressRepository.findByUser_Auth0UserIdAndCourse_Id(auth0UserId, courseId).isPresent();
        if (!progressExists) {
            Lesson firstLesson = lessonRepository
                    .findFirstByCourse_IdAndUser_IdOrderByIdAsc(courseId, user.getId())
                    .orElseThrow(() -> new IllegalStateException("No lessons found for this course and user"));
            UserProgress progress = new UserProgress();
            progress.setUser(user);
            progress.setCourse(courseRepository.findById(courseId).orElseThrow());
            progress.setCurrentLesson(firstLesson);
            userProgressRepository.save(progress);
        }
    }

    @Override
    public boolean markCourseAsCompleted(String auth0UserId, Integer courseId) {
        List<UserCourse> userCourses = userCourseRepository.findByUser_Auth0UserIdAndCourseId(auth0UserId, courseId);
        if (userCourses.isEmpty()) return false;

        UserCourse userCourse = userCourses.get(0);
        userCourse.setCompleted(true);
        userCourseRepository.save(userCourse);

        boolean alreadyIssued = certificateRepository.existsByUser_Auth0UserIdAndCourse_Id(auth0UserId, courseId);
        if (!alreadyIssued) {
            certificateService.generateAndSendCertificate(userCourse.getUser(), userCourse.getCourse());
        }

        System.out.println("Trying to award user with badge");
        User user = userCourse.getUser();
        int completedCourses = userCourseRepository.countByUserAndCompletedTrue(user);
        System.out.println("Calling badgeService");
        badgeService.awardCourseCompletionBadge(user, completedCourses);
        System.out.println("badgeService called successfully");
        return true;
    }
}