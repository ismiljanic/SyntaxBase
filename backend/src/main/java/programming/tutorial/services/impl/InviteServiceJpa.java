package programming.tutorial.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.expression.ExpressionException;
import org.springframework.stereotype.Service;
import programming.tutorial.dao.*;
import programming.tutorial.domain.*;
import programming.tutorial.services.EmailService;
import programming.tutorial.services.InviteService;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class InviteServiceJpa implements InviteService {

    @Autowired
    private InviteRepository inviteRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private UserCourseRepository userCourseRepository;

    @Autowired
    private EmailService emailService;

    public InviteResponse acceptInvite(String token, String username) {
        CourseInviteToken invite = inviteRepository.findByToken(token)
                .orElseThrow(() -> new ExpressionException("Invalid or expired token"));

        if (invite.isUsed() || invite.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new ExpressionException("Token is no longer valid");
        }

        User user = userRepository.findByAuth0UserId(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        System.out.println("user: " + user.getUsername());
        System.out.println("invite email: " + invite.getInvitedEmail());
        if (!user.getUsername().equalsIgnoreCase(invite.getInvitedEmail())) {
            throw new RuntimeException("Invite is not for this user");
        }

        Course course = invite.getCourse();

        boolean alreadyEnrolled = userCourseRepository.existsByUserIdAndCourseId(user.getId(), course.getId());
        if (!alreadyEnrolled) {
            UserCourse userCourse = new UserCourse();
            userCourse.setUser(user);
            userCourse.setCourse(course);
            userCourse.setCompleted(false);
            userCourseRepository.save(userCourse);
        }

        invite.setUsed(true);
        inviteRepository.save(invite);

        Lesson firstLesson = lessonRepository.findFirstByCourse_IdOrderByIdAsc(course.getId())
                .orElseThrow(() -> new RuntimeException("No lessons in course"));

        return new InviteResponse(course.getId(), firstLesson.getId());
    }

    public String generateInviteToken(Long courseId, Long lessonId, String invitedByUserId, String email) {
        Course course = courseRepository.findById(Math.toIntExact(courseId))
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));

        Lesson lesson = lessonRepository.findFirstByCourse_IdOrderByIdAsc(course.getId()).orElseThrow(() -> new RuntimeException("Lesson not found with id: " + lessonId));

        CourseInviteToken token = new CourseInviteToken();
        token.setToken(UUID.randomUUID().toString());
        token.setCourse(course);
        token.setLessonId(Long.valueOf(lesson.getId()));
        token.setInvitedByUserId(invitedByUserId);
        token.setExpiresAt(LocalDateTime.now().plusDays(7));
        token.setInvitedEmail(email);

        inviteRepository.save(token);

        return token.getToken();
    }

    public void createAndSendInvite(String email, Long courseId, String inviterUserId) {
        Course course = courseRepository.findById(Math.toIntExact(courseId))
                .orElseThrow(() -> new RuntimeException("Course not found"));

        User existingUser = userRepository.findByUsername(email);

        if (existingUser != null) {
            boolean alreadyEnrolled = userCourseRepository.existsByUserIdAndCourseId(existingUser.getId(), courseId.intValue());
            if (alreadyEnrolled) {
                throw new IllegalStateException("User is already enrolled in this course. Can't send invite again.");
            }
        }

        String token = generateInviteToken(courseId, null, inviterUserId, email);

        String inviteLink = "http://localhost:3000/accept-invite?token=" + token;

        User inviter = userRepository.findByAuth0UserId(inviterUserId)
                .orElseThrow(() -> new RuntimeException("Inviter user not found"));

        emailService.sendCourseInviteEmail(
                email,
                inviter.getName(),
                course.getCourseName(),
                inviteLink
        );
    }
}
