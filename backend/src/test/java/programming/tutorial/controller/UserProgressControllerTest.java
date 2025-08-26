package programming.tutorial.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.test.web.servlet.MockMvc;
import programming.tutorial.domain.User;
import programming.tutorial.dto.LessonDTO;
import programming.tutorial.services.CourseService;
import programming.tutorial.services.LessonService;
import programming.tutorial.services.UserProgressService;
import programming.tutorial.services.UserService;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@WebMvcTest(UserProgressController.class)
@AutoConfigureMockMvc(addFilters = false)
class UserProgressControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserProgressService userProgressService;
    @MockBean
    private LessonService lessonService;
    @MockBean
    private CourseService courseService;
    @MockBean
    private UserService userService;
    @Mock
    private Authentication authentication;

    private final String auth0Id = "auth0|123";
    private final Integer courseId = 1;
    private final Integer userId = 42;
    private final LessonDTO lessonDTO = new LessonDTO(1, "Lesson 1", courseId, userId, true, false);

    @BeforeEach
    void setup() {
        when(authentication.getName()).thenReturn(auth0Id);
        when(userService.getUserId(auth0Id)).thenReturn(userId);
    }

    @Test
    void getCurrentLessonNumber_shouldReturnLessonNumberIfExists() throws Exception {
        LessonDTO lessonDTO = new LessonDTO();
        lessonDTO.setLessonNumber(5);

        when(lessonService.getLessonByCourseIdAndCurrentUserProgress(1, "auth0|12345"))
                .thenReturn(Optional.of(lessonDTO));

        mockMvc.perform(get("/api/progress/current-lesson")
                        .param("userId", "auth0|12345")
                        .param("courseId", "1")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.lessonNumber").value(5));
    }

    @Test
    void getCurrentLessonNumber_shouldReturnNotFoundIfLessonNotExists() throws Exception {
        when(lessonService.getLessonByCourseIdAndCurrentUserProgress(1, "auth0|12345"))
                .thenReturn(Optional.empty());

        mockMvc.perform(get("/api/progress/current-lesson")
                        .param("userId", "auth0|12345")
                        .param("courseId", "1")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    void getProgressBar_shouldReturnForbidden_whenUserNotEnrolledAndNotOwner() throws Exception {
        when(userProgressService.isUserEnrolled("auth0|123", 1)).thenReturn(false);
        when(courseService.isCourseOwner("auth0|123", 1)).thenReturn(false);

        mockMvc.perform(get("/api/progress/progressBar")
                        .param("userId", "auth0|123")
                        .param("courseId", "1"))
                .andExpect(status().isForbidden());
    }

    @Test
    void getProgressBar_shouldReturnProgressBar_whenUserIsEnrolled() throws Exception {
        when(userProgressService.isUserEnrolled(eq("auth0|123"), eq(1))).thenReturn(true);
        when(courseService.isCourseOwner(eq("auth0|123"), eq(1))).thenReturn(false);

        ResponseEntity<?> response = ResponseEntity.ok("Progress bar data");

        doReturn(ResponseEntity.ok("Progress bar data"))
                .when(userProgressService).getProgressBar(eq("auth0|123"), eq(1));

        mockMvc.perform(get("/api/progress/progressBar")
                        .param("userId", "auth0|123")
                        .param("courseId", "1"))
                .andExpect(status().isOk())
                .andExpect(content().string("Progress bar data"));
    }

    @Test
    void getProgressBar_shouldReturnProgressBar_whenUserIsOwner() throws Exception {
        when(userProgressService.isUserEnrolled(eq("auth0|123"), eq(1))).thenReturn(false);
        when(courseService.isCourseOwner(eq("auth0|123"), eq(1))).thenReturn(true);

        doReturn(ResponseEntity.ok("Owner progress bar data"))
                .when(userProgressService).getProgressBar(eq("auth0|123"), eq(1));

        mockMvc.perform(get("/api/progress/progressBar")
                        .param("userId", "auth0|123")
                        .param("courseId", "1"))
                .andExpect(status().isOk())
                .andExpect(content().string("Owner progress bar data"));
    }


    @Test
    void getFirstLesson_shouldReturnLesson_whenUserEnrolled() throws Exception {
        when(userProgressService.isUserEnrolled(auth0Id, courseId)).thenReturn(true);
        when(courseService.isCourseOwner(auth0Id, courseId)).thenReturn(false);
        when(lessonService.getFirstLesson(courseId, userId)).thenReturn(Optional.of(lessonDTO));

        Jwt jwt = Jwt.withTokenValue("token")
                .header("alg", "none")
                .claim("sub", auth0Id)
                .build();

        when(authentication.getPrincipal()).thenReturn(jwt);

        mockMvc.perform(get("/api/progress/lessons/first")
                        .param("courseId", courseId.toString())
                        .principal(authentication))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.lessonName").value("Lesson 1"));
    }

    @Test
    void getFirstLesson_shouldReturnForbidden_whenNotEnrolledOrOwner() throws Exception {
        when(userProgressService.isUserEnrolled(auth0Id, courseId)).thenReturn(false);
        when(courseService.isCourseOwner(auth0Id, courseId)).thenReturn(false);

        Jwt jwt = Jwt.withTokenValue("token")
                .header("alg", "none")
                .claim("sub", auth0Id)
                .build();

        when(authentication.getPrincipal()).thenReturn(jwt);

        mockMvc.perform(get("/api/progress/lessons/first")
                        .param("courseId", courseId.toString())
                        .principal(authentication))
                .andExpect(status().isForbidden());
    }

    @Test
    void getFirstLesson_shouldReturnNotFound_whenLessonMissing() throws Exception {
        when(userProgressService.isUserEnrolled(auth0Id, courseId)).thenReturn(true);
        when(courseService.isCourseOwner(auth0Id, courseId)).thenReturn(false);
        when(lessonService.getFirstLesson(courseId, userId)).thenReturn(Optional.empty());

        Jwt jwt = Jwt.withTokenValue("token")
                .header("alg", "none")
                .claim("sub", auth0Id)
                .build();

        when(authentication.getPrincipal()).thenReturn(jwt);

        mockMvc.perform(get("/api/progress/lessons/first")
                        .param("courseId", courseId.toString())
                        .principal(authentication))
                .andExpect(status().isNotFound());
    }

    @Test
    void getLessonByNumber_shouldReturnLesson_whenUserEnrolled() throws Exception {
        int lessonNumber = 1;
        when(userProgressService.isUserEnrolled(auth0Id, courseId)).thenReturn(true);
        when(courseService.isCourseOwner(auth0Id, courseId)).thenReturn(false);
        when(lessonService.getLessonByCourseIdAndLessonNumber(courseId, lessonNumber))
                .thenReturn(Optional.of(lessonDTO));

        Jwt jwt = Jwt.withTokenValue("token")
                .header("alg", "none")
                .claim("sub", auth0Id)
                .build();

        when(authentication.getPrincipal()).thenReturn(jwt);

        mockMvc.perform(get("/api/progress/lessons/{courseId}/number/{lessonNumber}", courseId, lessonNumber)
                        .principal(authentication))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.lessonName").value("Lesson 1"));
    }

    @Test
    void getLessonByNumber_shouldReturnForbidden_whenNotEnrolledOrOwner() throws Exception {
        int lessonNumber = 1;
        when(userProgressService.isUserEnrolled(auth0Id, courseId)).thenReturn(false);
        when(courseService.isCourseOwner(auth0Id, courseId)).thenReturn(false);

        Jwt jwt = Jwt.withTokenValue("token")
                .header("alg", "none")
                .claim("sub", auth0Id)
                .build();

        when(authentication.getPrincipal()).thenReturn(jwt);

        mockMvc.perform(get("/api/progress/lessons/{courseId}/number/{lessonNumber}", courseId, lessonNumber)
                        .principal(authentication))
                .andExpect(status().isForbidden());
    }

    @Test
    void getLessonByNumber_shouldReturnNotFound_whenLessonMissing() throws Exception {
        int lessonNumber = 1;
        when(userProgressService.isUserEnrolled(auth0Id, courseId)).thenReturn(true);
        when(courseService.isCourseOwner(auth0Id, courseId)).thenReturn(false);
        when(lessonService.getLessonByCourseIdAndLessonNumber(courseId, lessonNumber))
                .thenReturn(Optional.empty());

        Jwt jwt = Jwt.withTokenValue("token")
                .header("alg", "none")
                .claim("sub", auth0Id)
                .build();

        when(authentication.getPrincipal()).thenReturn(jwt);

        mockMvc.perform(get("/api/progress/lessons/{courseId}/number/{lessonNumber}", courseId, lessonNumber)
                        .principal(authentication))
                .andExpect(status().isNotFound());
    }

    @Test
    void getNextLesson_shouldReturnLesson_whenUserEnrolled() throws Exception {
        int userId = 1;
        int currentLessonNumber = 1;

        when(userProgressService.isUserEnrolled(auth0Id, courseId)).thenReturn(true);
        when(courseService.isCourseOwner(auth0Id, courseId)).thenReturn(false);

        when(userService.findByAuth0UserId(auth0Id))
                .thenReturn(new User(userId, "name", "surname", "password", "username",
                        LocalDateTime.now(), new HashSet<>(), true));

        when(lessonService.getNextLesson(courseId, currentLessonNumber, userId))
                .thenReturn(Optional.of(lessonDTO));

        Jwt jwt = Jwt.withTokenValue("token")
                .header("alg", "none")
                .claim("sub", auth0Id)
                .build();
        when(authentication.getPrincipal()).thenReturn(jwt);

        mockMvc.perform(get("/api/progress/lessons/next")
                        .param("courseId", String.valueOf(courseId))
                        .param("currentLessonNumber", String.valueOf(currentLessonNumber))
                        .principal(authentication))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.lessonName").value("Lesson 1"));
    }


    @Test
    void getNextLesson_shouldReturnForbidden_whenNotEnrolledOrOwner() throws Exception {
        int currentLessonNumber = 1;

        when(userProgressService.isUserEnrolled(auth0Id, courseId)).thenReturn(false);
        when(courseService.isCourseOwner(auth0Id, courseId)).thenReturn(false);

        when(userService.findByAuth0UserId(auth0Id))
                .thenReturn(new User(42, "name", "surname", "password", "username",
                        LocalDateTime.now(), new HashSet<>(), true));

        Jwt jwt = Jwt.withTokenValue("token")
                .header("alg", "none")
                .claim("sub", auth0Id)
                .build();
        when(authentication.getPrincipal()).thenReturn(jwt);

        mockMvc.perform(get("/api/progress/lessons/next")
                        .param("courseId", String.valueOf(courseId))
                        .param("currentLessonNumber", String.valueOf(currentLessonNumber))
                        .principal(authentication))
                .andExpect(status().isForbidden());
    }


    @Test
    void getNextLesson_shouldReturnNotFound_whenNoNextLesson() throws Exception {
        int currentLessonNumber = 1;
        when(userProgressService.isUserEnrolled(auth0Id, courseId)).thenReturn(true);
        when(courseService.isCourseOwner(auth0Id, courseId)).thenReturn(false);
        when(userService.findByAuth0UserId(auth0Id))
                .thenReturn(new User(42, "name", "surname", "password", "username",
                        LocalDateTime.now(), new HashSet<>(), true));
        when(lessonService.getNextLesson(courseId, currentLessonNumber, userId))
                .thenReturn(Optional.empty());

        Jwt jwt = Jwt.withTokenValue("token")
                .header("alg", "none")
                .claim("sub", auth0Id)
                .build();
        when(authentication.getPrincipal()).thenReturn(jwt);

        mockMvc.perform(get("/api/progress/lessons/next")
                        .param("courseId", courseId.toString())
                        .param("currentLessonNumber", String.valueOf(currentLessonNumber))
                        .principal(authentication))
                .andExpect(status().isNotFound());
    }

    @Test
    void getPreviousLesson_shouldReturnLesson_whenUserEnrolled() throws Exception {
        int currentLessonNumber = 2;
        when(userProgressService.isUserEnrolled(auth0Id, courseId)).thenReturn(true);
        when(courseService.isCourseOwner(auth0Id, courseId)).thenReturn(false);
        when(userService.findByAuth0UserId(auth0Id))
                .thenReturn(new User(42, "name", "surname", "password", "username",
                        LocalDateTime.now(), new HashSet<>(), true));

        when(lessonService.getPreviousLesson(courseId, currentLessonNumber, userId))
                .thenReturn(Optional.of(lessonDTO));

        Jwt jwt = Jwt.withTokenValue("token")
                .header("alg", "none")
                .claim("sub", auth0Id)
                .build();
        when(authentication.getPrincipal()).thenReturn(jwt);

        mockMvc.perform(get("/api/progress/lessons/previous")
                        .param("courseId", courseId.toString())
                        .param("currentLessonNumber", String.valueOf(currentLessonNumber))
                        .principal(authentication))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.lessonName").value("Lesson 1"));
    }

    @Test
    void getPreviousLesson_shouldReturnForbidden_whenNotEnrolledOrOwner() throws Exception {
        int currentLessonNumber = 2;
        when(userProgressService.isUserEnrolled(auth0Id, courseId)).thenReturn(false);
        when(courseService.isCourseOwner(auth0Id, courseId)).thenReturn(false);
        when(userService.findByAuth0UserId(auth0Id))
                .thenReturn(new User(42, "name", "surname", "password", "username",
                        LocalDateTime.now(), new HashSet<>(), true));
        Jwt jwt = Jwt.withTokenValue("token")
                .header("alg", "none")
                .claim("sub", auth0Id)
                .build();
        when(authentication.getPrincipal()).thenReturn(jwt);

        mockMvc.perform(get("/api/progress/lessons/previous")
                        .param("courseId", courseId.toString())
                        .param("currentLessonNumber", String.valueOf(currentLessonNumber))
                        .principal(authentication))
                .andExpect(status().isForbidden());
    }

    @Test
    void getPreviousLesson_shouldReturnNotFound_whenNoPreviousLesson() throws Exception {
        int currentLessonNumber = 2;
        when(userProgressService.isUserEnrolled(auth0Id, courseId)).thenReturn(true);
        when(courseService.isCourseOwner(auth0Id, courseId)).thenReturn(false);
        when(userService.findByAuth0UserId(auth0Id))
                .thenReturn(new User(42, "name", "surname", "password", "username",
                        LocalDateTime.now(), new HashSet<>(), true));

        when(lessonService.getPreviousLesson(courseId, currentLessonNumber, userId))
                .thenReturn(Optional.empty());

        Jwt jwt = Jwt.withTokenValue("token")
                .header("alg", "none")
                .claim("sub", auth0Id)
                .build();
        when(authentication.getPrincipal()).thenReturn(jwt);

        mockMvc.perform(get("/api/progress/lessons/previous")
                        .param("courseId", courseId.toString())
                        .param("currentLessonNumber", String.valueOf(currentLessonNumber))
                        .principal(authentication))
                .andExpect(status().isNotFound());
    }

    @Test
    void isEnrolled_shouldReturnTrue_whenUserIsEnrolled() throws Exception {
        when(userProgressService.isUserEnrolled(auth0Id, courseId)).thenReturn(true);

        Jwt jwt = Jwt.withTokenValue("token")
                .header("alg", "none")
                .claim("sub", auth0Id)
                .build();
        when(authentication.getPrincipal()).thenReturn(jwt);

        mockMvc.perform(get("/api/progress/isEnrolled")
                        .param("courseId", courseId.toString())
                        .principal(authentication))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.enrolled").value(true));
    }

    @Test
    void isEnrolled_shouldReturnFalse_whenUserIsNotEnrolled() throws Exception {
        when(userProgressService.isUserEnrolled(auth0Id, courseId)).thenReturn(false);

        Jwt jwt = Jwt.withTokenValue("token")
                .header("alg", "none")
                .claim("sub", auth0Id)
                .build();
        when(authentication.getPrincipal()).thenReturn(jwt);

        mockMvc.perform(get("/api/progress/isEnrolled")
                        .param("courseId", courseId.toString())
                        .principal(authentication))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.enrolled").value(false));
    }

    @Test
    void getLessonIdByCourseAndNumber_shouldReturnLessonId_whenFound() throws Exception {
        int lessonNumber = 2;
        int lessonId = 101;

        when(lessonService.findLessonIdByCourseAndNumberAndUser(String.valueOf(courseId), lessonNumber, auth0Id))
                .thenReturn(lessonId);

        Jwt jwt = Jwt.withTokenValue("token")
                .header("alg", "none")
                .claim("sub", auth0Id)
                .build();
        when(authentication.getPrincipal()).thenReturn(jwt);

        mockMvc.perform(get("/api/progress/getLessonId")
                        .param("courseId", courseId.toString())
                        .param("lessonNumber", String.valueOf(lessonNumber))
                        .principal(authentication))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.lessonId").value(lessonId));
    }

    @Test
    void getLessonIdByCourseAndNumber_shouldReturnNotFound_whenLessonMissing() throws Exception {
        int lessonNumber = 2;

        when(lessonService.findLessonIdByCourseAndNumberAndUser(String.valueOf(courseId), lessonNumber, auth0Id))
                .thenReturn(null);

        Jwt jwt = Jwt.withTokenValue("token")
                .header("alg", "none")
                .claim("sub", auth0Id)
                .build();
        when(authentication.getPrincipal()).thenReturn(jwt);

        mockMvc.perform(get("/api/progress/getLessonId")
                        .param("courseId", courseId.toString())
                        .param("lessonNumber", String.valueOf(lessonNumber))
                        .principal(authentication))
                .andExpect(status().isNotFound());
    }
}