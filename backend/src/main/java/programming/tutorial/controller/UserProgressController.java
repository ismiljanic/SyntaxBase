package programming.tutorial.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import programming.tutorial.dto.LessonDTO;
import programming.tutorial.dto.LessonNumberDTO;
import programming.tutorial.services.CourseService;
import programming.tutorial.services.LessonService;
import programming.tutorial.services.UserProgressService;
import programming.tutorial.services.UserService;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/progress")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class UserProgressController {

    @Autowired
    private UserProgressService userProgressService;

    @Autowired
    private LessonService lessonService;

    @Autowired
    private CourseService courseService;

    @Autowired
    private UserService userService;

    public static class ProgressUpdateRequest {
        public Integer courseId;
        public Integer lessonId;
    }

    @GetMapping("/current-lesson")
    public ResponseEntity<LessonNumberDTO> getCurrentLessonNumber(
            @RequestParam String userId,
            @RequestParam Integer courseId
    ) {
        Optional<LessonDTO> lessonOpt = lessonService.getLessonByCourseIdAndCurrentUserProgress(courseId, userId);
        if (lessonOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        LessonDTO lesson = lessonOpt.get();
        return ResponseEntity.ok(new LessonNumberDTO(lesson.getLessonNumber()));
    }

    @PostMapping("/update")
    public ResponseEntity<String> updateProgress(
            @RequestBody ProgressUpdateRequest request,
            Authentication authentication) {
        System.out.println("Update hit in updateProgressController");
        String userId = extractUserId(authentication);
        boolean isEnrolled = userProgressService.isUserEnrolled(userId, request.courseId);
        boolean isOwner = courseService.isCourseOwner(userId, request.courseId);

        if (!isEnrolled && !isOwner) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }

        String auth0UserId = authentication.getName();
        return ResponseEntity.ok(
                userProgressService.updateProgress(auth0UserId, request.courseId, request.lessonId)
        );
    }

    @GetMapping("/progressBar")
    public ResponseEntity<?> getProgressBar(
            @RequestParam String userId,
            @RequestParam Integer courseId,
            Authentication authentication) {

        boolean isEnrolled = userProgressService.isUserEnrolled(userId, courseId);
        boolean isOwner = courseService.isCourseOwner(userId, courseId);

        if (!isEnrolled && !isOwner) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }

        return userProgressService.getProgressBar(userId, courseId);
    }

    @GetMapping("/lessons/first")
    public ResponseEntity<LessonDTO> getFirstLesson(@RequestParam Integer courseId, Authentication authentication) {
        String auth0Id = extractUserId(authentication);
        Integer userId = userService.getUserId(auth0Id);

        boolean isEnrolled = userProgressService.isUserEnrolled(auth0Id, courseId);
        boolean isOwner = courseService.isCourseOwner(auth0Id, courseId);

        if (!isEnrolled && !isOwner) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }

        return lessonService.getFirstLesson(courseId, userId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }


    @GetMapping("/lessons/{courseId}/number/{lessonNumber}")
    public ResponseEntity<LessonDTO> getLessonByNumber(
            @PathVariable Integer courseId,
            @PathVariable Integer lessonNumber,
            Authentication authentication
    ) {
        String userId = extractUserId(authentication);

        boolean isEnrolled = userProgressService.isUserEnrolled(userId, courseId);
        boolean isOwner = courseService.isCourseOwner(userId, courseId);

        if (!isEnrolled && !isOwner) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
        return lessonService.getLessonByCourseIdAndLessonNumber(courseId, lessonNumber)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/lessons/next")
    public ResponseEntity<LessonDTO> getNextLesson(@RequestParam Integer courseId, @RequestParam Integer currentLessonNumber, Authentication authentication) {
        String auth0Id = extractUserId(authentication);
        Integer userId = userService.findByAuth0UserId(auth0Id).getId();

        boolean isEnrolled = userProgressService.isUserEnrolled(auth0Id, courseId);
        boolean isOwner = courseService.isCourseOwner(auth0Id, courseId);

        if (!isEnrolled && !isOwner) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
        return lessonService. getNextLesson(courseId, currentLessonNumber, userId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }


    @GetMapping("/lessons/previous")
    public ResponseEntity<LessonDTO> getPreviousLesson(@RequestParam Integer courseId, @RequestParam Integer currentLessonNumber, Authentication authentication) {
        String auth0Id = extractUserId(authentication);
        Integer userId = userService.findByAuth0UserId(auth0Id).getId();

        boolean isEnrolled = userProgressService.isUserEnrolled(auth0Id, courseId);
        boolean isOwner = courseService.isCourseOwner(auth0Id, courseId);

        if (!isEnrolled && !isOwner) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }

        return lessonService.getPreviousLesson(courseId, currentLessonNumber, userId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    private String extractUserId(Authentication authentication) {
        if (authentication.getPrincipal() instanceof Jwt jwt) {
            return jwt.getClaimAsString("sub");
        }
        throw new IllegalStateException("Invalid authentication principal");
    }

    @GetMapping("/isEnrolled")
    public ResponseEntity<Map<String, Boolean>> isEnrolled(
            @RequestParam Integer courseId,
            Authentication authentication) {

        String userId = extractUserId(authentication);
        boolean enrolled = userProgressService.isUserEnrolled(userId, courseId);

        return ResponseEntity.ok(Map.of("enrolled", enrolled));
    }

    @GetMapping("/getLessonId")
    public ResponseEntity<Map<String, Integer>> getLessonIdByCourseAndNumber(
            @RequestParam String courseId,
            @RequestParam int lessonNumber,
            Authentication authentication) {

        String auth0UserId = extractUserId(authentication);

        Integer lessonId = lessonService.findLessonIdByCourseAndNumberAndUser(courseId, lessonNumber, auth0UserId);

        if (lessonId == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        Map<String, Integer> response = new HashMap<>();
        response.put("lessonId", lessonId);

        return ResponseEntity.ok(response);
    }
}