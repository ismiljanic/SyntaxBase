package programming.tutorial.services;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import programming.tutorial.dao.*;
import programming.tutorial.domain.*;
import programming.tutorial.dto.*;
import programming.tutorial.services.impl.EmailServiceJpa;
import programming.tutorial.services.impl.UserNotFoundException;
import programming.tutorial.services.impl.UserServiceJpa;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private UserBadgeRepository userBadgeRepository;
    @InjectMocks
    private UserServiceJpa userServiceJpa;
    @Mock
    private UserCourseRepository userCourseRepository;
    @Mock
    private LessonRepository lessonRepository;
    @Mock
    private PostRepository postRepository;
    @Mock
    private RatingRepository ratingRepository;
    @Mock
    private InstructorRequestRepository instructorRequestRepository;
    @Mock
    private CertificateRepository certificateRepository;
    @Mock
    private EmailServiceJpa emailServiceJpa;
    @Mock
    private BadgeService badgeService;
    @Mock
    private UserCourseService courseService;
    @InjectMocks
    private UserServiceJpa userService;

    @Test
    void addUser_whenUsernameExists_shouldReturnBadRequest() {
        UserDTO dto = new UserDTO();
        dto.setUsername("existingUser");

        when(userRepository.findByUsername("existingUser")).thenReturn(new User());

        ResponseEntity<?> response = userServiceJpa.addUser(dto);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Username already exists", response.getBody());

        verify(userRepository, never()).save(Mockito.<User>any());
    }


    @Test
    void addUser_whenUsernameDoesNotExist_shouldSaveUser() {
        UserDTO dto = new UserDTO();
        dto.setUsername("newUsername");
        dto.setPassword("password123");
        dto.setName("Ivan");
        dto.setSurname("Smiljanic");

        when(userRepository.findByUsername("newUsername")).thenReturn(null);
        when(userRepository.save(Mockito.<User>any())).thenAnswer(invocation -> {
            User u = invocation.getArgument(0);
            u.setId(1);
            return u;
        });

        ResponseEntity<?> response = userServiceJpa.addUser(dto);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assert body != null;
        assertEquals("user", body.get("userType"));
        assertEquals(1, body.get("id"));

        verify(userRepository, times(1)).save(Mockito.<User>any());
    }

    @Test
    void addUser_whenRepositoryThrowsException_shouldReturnServerError() {
        UserDTO dto = new UserDTO();
        dto.setUsername("failUser");

        when(userRepository.findByUsername("failUser")).thenThrow(new RuntimeException("DB error"));

        ResponseEntity<?> response = userServiceJpa.addUser(dto);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Error during registration", response.getBody());
    }

    @Test
    void findByUsername_shouldReturnUser_ifExists() {
        User user = new User();
        user.setUsername("username");

        when(userRepository.findByUsername("username")).thenReturn(user);

        Optional<User> result = userServiceJpa.findByUsername("username");

        assertTrue(result.isPresent());
        assertEquals("username", result.get().getUsername());
    }

    @Test
    void updateName_shouldUpdateAndSave() {
        User user = new User();
        user.setAuth0UserId("auth0Id");

        when(userRepository.findByAuth0UserId("auth0Id")).thenReturn(Optional.of(user));

        userServiceJpa.updateName("auth0Id", "new Name");

        assertEquals("new Name", user.getName());
        verify(userRepository).save(user);
    }

    @Test
    void updateSurname_shouldUpdateAndSave() {
        User user = new User();
        user.setAuth0UserId("auth0Id");

        when(userRepository.findByAuth0UserId("auth0Id")).thenReturn(Optional.of(user));

        userServiceJpa.updateSurname("auth0Id", "new Surname");

        assertEquals("new Surname", user.getSurname());
        verify(userRepository).save(user);
    }

    @Test
    void updateUsername_shouldUpdateAndSave() {
        User user = new User();
        user.setAuth0UserId("auth0Id");

        when(userRepository.findByAuth0UserId("auth0Id")).thenReturn(Optional.of(user));

        userServiceJpa.updateUsername("auth0Id", "new Username");

        assertEquals("new Username", user.getUsername());
        verify(userRepository).save(user);
    }

    @Test
    void deleteUser_shouldDeleteUser_ifExists() {
        User user = new User();

        when(userRepository.findByAuth0UserId("noAuth0Id")).thenReturn(Optional.of(user));

        userServiceJpa.deleteUser("noAuth0Id");

        verify(userRepository).delete(user);
    }

    @Test
    void deleteUser_shouldThrowException_ifNotFound() {
        when(userRepository.findByAuth0UserId("noAuth0Id")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> userServiceJpa.deleteUser("noAuth0Id"));
    }

    @Test
    void deleteUserAsAdmin_shouldDeleteExistingUser() {
        User user = new User();
        user.setAuth0UserId("auth0Id");

        when(userRepository.findByAuth0UserId("auth0Id")).thenReturn(Optional.of(user));

        userServiceJpa.deleteUserAsAdmin("auth0Id");

        verify(userRepository).delete(user);
    }

    @Test
    void deleteUserAsAdmin_shouldThrowIfUserNotFound() {
        when(userRepository.findByAuth0UserId("auth0Id")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> userServiceJpa.deleteUserAsAdmin("auth0Id"));
    }

    @Test
    void findByAuth0UserId_shouldReturnUser_whenUserExists() {
        User user = new User();
        user.setAuth0UserId("auth0Id");

        when(userRepository.findByAuth0UserId("auth0Id")).thenReturn(Optional.of(user));

        User result = userServiceJpa.findByAuth0UserId("auth0Id");

        assertEquals(user, result);
        verify(userRepository).findByAuth0UserId("auth0Id");
    }

    @Test
    void findByAuth0Id_shouldThrowException_whenUserDoesNotExist() {
        when(userRepository.findByAuth0UserId("someAuth0Id")).thenReturn(Optional.empty());

        UserNotFoundException exception = assertThrows(UserNotFoundException.class, () ->
                userServiceJpa.findByAuth0UserId("someAuth0Id"));

        assertTrue(exception.getMessage().contains("User not found with Auth0 ID"));
        verify(userRepository).findByAuth0UserId("someAuth0Id");
    }

    @Test
    void getUserAccountDTO_shouldReturnFullDTO_whenDataExists() {
        String auth0Id = "auth0Id";

        User user = new User();
        user.setId(1);
        user.setAuth0UserId(auth0Id);
        user.setUsername("username");
        user.setName("Ivan");
        user.setSurname("Smiljanic");
        user.setRole(Role.USER);
        user.setActive(true);
        user.setDateCreated(LocalDateTime.of(2023, 1, 1, 0, 0));

        when(userRepository.findByAuth0UserId("auth0Id")).thenReturn(Optional.of(user));

        Course course = new Course();
        course.setId(1);
        course.setCourseName("Course Name");
        course.setDescription("Some description");
        course.setLength(10);

        UserCourse userCourse = new UserCourse();
        userCourse.setCourse(course);

        when(userCourseRepository.findByUser_Auth0UserId("auth0Id")).thenReturn(List.of(userCourse));

        when(lessonRepository.countCompletedLessonsForUserAndCourse(course.getId(), user.getId()))
                .thenReturn(5L);

        Post post1 = new Post();
        post1.setId(1);
        post1.setUserId(auth0Id);
        post1.setContent("Post 1");
        post1.setCreatedAt(new Date(1970, 1, 1));
        post1.setDeleted(false);

        Post post2 = new Post();
        post2.setId(2);
        post2.setUserId(auth0Id);
        post2.setContent("Deleted post");
        post2.setCreatedAt(new Date(1970, 1, 1));
        post2.setDeleted(true);

        when(postRepository.findByUserId(auth0Id)).thenReturn(List.of(post1, post2));
        when(postRepository.findByUserIdAndDeletedTrue(auth0Id)).thenReturn(List.of(post2));

        Rating rating = new Rating();
        rating.setCourseId(Long.valueOf(course.getId()));
        rating.setRating(4);

        when(ratingRepository.findByAuth0UserId(auth0Id)).thenReturn(List.of(rating));

        UserAccountDTO dto = userServiceJpa.getUserAccountDTOByAuth0UserId(auth0Id);

        assertEquals("username", user.getUsername());
        assertEquals("Ivan", user.getName());
        assertEquals("Smiljanic", user.getSurname());
        assertEquals(Role.USER, user.getRole());
        assertTrue(user.isActive());
        assertEquals(2, dto.getUserPosts().size());
        assertEquals(1, dto.getDeletedPosts().size());
        assertEquals(1, dto.getCourses().size());

        CourseProgressDTO cp = dto.getCourses().get(0);
        assertEquals(1, cp.getCourseId());
        assertEquals(10, cp.getTotalLessons());
        assertEquals(5, cp.getCompletedLessons());
        assertEquals(50.0, cp.getProgress());
        assertEquals(4, cp.getRating());
    }

    @Test
    void getUserAccountDTOByAuth0UserId_shouldThrow_whenUserNotFound() {
        String auth0Id = "missingId";

        when(userRepository.findByAuth0UserId(auth0Id)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () ->
                userServiceJpa.getUserAccountDTOByAuth0UserId(auth0Id)
        );

        assertTrue(exception.getMessage().contains("User not found"));
        verify(userRepository).findByAuth0UserId(auth0Id);
    }

    @Test
    void upgradeTier_shouldUpdateTierAndSave_whenNewTierIsDifferent() {
        User user = new User();
        user.setAuth0UserId("auth0Id");
        user.setTier(Tier.FREE);

        when(userRepository.findByAuth0UserId("auth0Id")).thenReturn(Optional.of(user));

        userServiceJpa.upgradeTier("auth0Id", Tier.ULTIMATE);

        assertEquals(Tier.ULTIMATE, user.getTier());
        verify(userRepository).save(user);
    }

    @Test
    void upgradeTier_shouldThrow_whenUserNotFound() {
        String auth0Id = "missingId";

        when(userRepository.findByAuth0UserId(auth0Id)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () ->
                userServiceJpa.upgradeTier(auth0Id, Tier.PROFESSIONAL)
        );

        assertEquals("User not found", exception.getMessage());
    }

    @Test
    void upgradeTier_shouldThrow_whenTierIsSame() {
        String auth0Id = "auth0Id";
        User user = new User();
        user.setAuth0UserId(auth0Id);
        user.setTier(Tier.PROFESSIONAL);

        when(userRepository.findByAuth0UserId(auth0Id)).thenReturn(Optional.of(user));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                userServiceJpa.upgradeTier(auth0Id, Tier.PROFESSIONAL)
        );

        assertEquals("You are already on this tier.", ex.getMessage());
    }

    @Test
    void getUserActiveStatus_shouldReturnTrue_whenUserIsActive() {
        String auth0Id = "auth0Id";
        User user = new User();
        user.setAuth0UserId(auth0Id);
        user.setActive(true);

        when(userRepository.findByAuth0UserId(auth0Id)).thenReturn(Optional.of(user));

        boolean status = userServiceJpa.getUserActiveStatus(auth0Id);

        assertTrue(status);
    }

    @Test
    void getUserActiveStatus_shouldReturnFalse_whenUserIsInactive() {
        String auth0Id = "auth0Id";
        User user = new User();
        user.setAuth0UserId(auth0Id);
        user.setActive(false);

        when(userRepository.findByAuth0UserId(auth0Id)).thenReturn(Optional.of(user));

        boolean status = userServiceJpa.getUserActiveStatus(auth0Id);

        assertFalse(status);
    }

    @Test
    void getUserActiveStatus_shouldThrowException_whenUserNotFound() {
        String auth0Id = "auth0Id";

        when(userRepository.findByAuth0UserId(auth0Id)).thenReturn(Optional.empty());

        UserNotFoundException exception = assertThrows(UserNotFoundException.class, () ->
                userServiceJpa.getUserActiveStatus(auth0Id));

        assertEquals("User not found: " + auth0Id, exception.getMessage());
    }

    @Test
    void getUserAccountInformation_shouldReturnData_whenUserExists() {
        String auth0Id = "auth0Id";

        User user = new User();
        user.setAuth0UserId(auth0Id);
        user.setUsername("username");
        user.setName("Ivan");
        user.setSurname("Smiljanic");
        user.setDateCreated(LocalDateTime.of(2023, 8, 18, 12, 0));
        user.setRole(Role.USER);
        user.setTier(Tier.FREE);

        Course course = new Course();
        course.setId(1);
        course.setCourseName("Some course");
        course.setSystemCourse(true);

        Post post1 = new Post(1, "Hello World", auth0Id,
                new Date(70, 0, 1), null, null, false, "general", null);
        Post post2 = new Post(2, "Deleted post", auth0Id,
                new Date(70, 0, 1), null, null, true, "general", null);

        Certificate certificate = new Certificate();
        certificate.setId(UUID.randomUUID());
        certificate.setUser(user);
        certificate.setCourse(course);
        certificate.setIssuedAt(LocalDateTime.of(2023, 8, 19, 10, 0));
        certificate.setFileUrl("file.pdf");

        Badge badge = new Badge();
        badge.setId(UUID.randomUUID());
        badge.setName("First Post");
        badge.setDescription("Awarded for writing the first post");
        badge.setType("ACHIEVEMENT");
        badge.setCriteria("Write 1 post");
        badge.setPermanent(true);

        UserBadge userBadge = new UserBadge();
        userBadge.setId(UUID.randomUUID());
        userBadge.setBadge(badge);
        userBadge.setUser(user);
        userBadge.setAwardedAt(LocalDateTime.of(2023, 8, 20, 9, 0));
        userBadge.setRevoked(false);
        userBadge.setProgress("100");

        when(userRepository.findByAuth0UserId(auth0Id)).thenReturn(Optional.of(user));
        when(postRepository.findByUserId(auth0Id)).thenReturn(List.of(post1));
        when(postRepository.findDeletedPostsByUserId(auth0Id)).thenReturn(List.of(post2));
        when(certificateRepository.findByUser_Auth0UserId(auth0Id)).thenReturn(List.of(certificate));
        when(userBadgeRepository.findByUser(user)).thenReturn(List.of(userBadge));

        UserAccountDTO dto = userServiceJpa.getUserAccountInformation(auth0Id);

        assertEquals("Ivan", dto.getName());
        assertEquals("Smiljanic", dto.getSurname());
        assertEquals("username", dto.getUsername());
        assertEquals(Role.USER, dto.getRole());
        assertEquals(Tier.FREE, dto.getTier());

        assertEquals(1, dto.getUserPosts().size());
        assertEquals(post1.getId(), dto.getUserPosts().get(0).getId());

        assertEquals(1, dto.getDeletedPosts().size());
        assertEquals(post2.getId(), dto.getDeletedPosts().get(0).getId());

        assertEquals(1, dto.getCertificates().size());
        assertEquals(course.getCourseName(), dto.getCertificates().get(0).getCourseName());

        assertEquals(1, dto.getBadges().size());
        assertEquals(badge.getName(), dto.getBadges().get(0).getBadge().getName());
        assertEquals("100", dto.getBadges().get(0).getProgress());
    }

    @Test
    void getUserAccountInformation_shouldThrow_whenUserNotFound() {
        String auth0Id = "missingId";

        when(userRepository.findByAuth0UserId(auth0Id)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () ->
                userServiceJpa.getUserAccountInformation(auth0Id)
        );

        assertEquals("User not found", exception.getMessage());
    }

    @Test
    void getAllUsers_shouldReturnNonAdminUsers() {
        User user1 = new User();
        user1.setAuth0UserId("u1");
        user1.setUsername("user1");
        user1.setRole(Role.USER);
        user1.setActive(true);

        User admin = new User();
        admin.setAuth0UserId("a1");
        admin.setUsername("admin1");
        admin.setRole(Role.ADMIN);
        admin.setActive(true);

        when(userRepository.findAll()).thenReturn(List.of(user1, admin));

        List<UserDTO> dtos = userServiceJpa.getAllUsers();

        assertEquals(1, dtos.size());
        assertEquals("u1", dtos.get(0).getAuth0UserId());
        assertEquals("user1", dtos.get(0).getUsername());
        assertEquals(Role.USER, dtos.get(0).getRole());
    }

    @Test
    void getUserIdByAuth0Id_shouldReturnDTO_whenUserExists() {
        User user = new User();
        user.setAuth0UserId("auth0Id");

        when(userRepository.findByAuth0UserId("auth0Id")).thenReturn(Optional.of(user));

        Optional<UserIdDTO> result = userServiceJpa.getUserIdByAuth0Id("auth0Id");

        assertTrue(result.isPresent());
        assertEquals("auth0Id", result.get().getAuth0id());
    }

    @Test
    void getUserIdByAuth0Id_shouldReturnEmpty_whenUserNotFound() {
        when(userRepository.findByAuth0UserId("missing")).thenReturn(Optional.empty());

        Optional<UserIdDTO> result = userServiceJpa.getUserIdByAuth0Id("missing");

        assertTrue(result.isEmpty());
    }

    @Test
    void getUserId_shouldReturnId_whenUserExists() {
        User user = new User();
        user.setAuth0UserId("auth0Id");
        user.setId(123);

        when(userRepository.findByAuth0UserId("auth0Id")).thenReturn(Optional.of(user));

        Integer id = userServiceJpa.getUserId("auth0Id");

        assertEquals(123, id);
    }

    @Test
    void getUserId_shouldThrow_whenUserNotFound() {
        when(userRepository.findByAuth0UserId("missing")).thenReturn(Optional.empty());

        NoSuchElementException exception = assertThrows(NoSuchElementException.class,
                () -> userServiceJpa.getUserId("missing"));

        assertEquals("User not found with Auth0 ID: missing", exception.getMessage());
    }

    @Test
    void getUserRoleByAuth0Id_shouldReturnRole_whenUserExists() {
        User user = new User();
        user.setAuth0UserId("auth0Id");
        user.setRole(Role.USER);

        when(userRepository.findByAuth0UserId("auth0Id")).thenReturn(Optional.of(user));

        Optional<String> role = userServiceJpa.getUserRoleByAuth0Id("auth0Id");

        assertTrue(role.isPresent());
        assertEquals("USER", role.get());
    }

    @Test
    void getUserRoleByAuth0Id_shouldReturnEmpty_whenUserNotFound() {
        when(userRepository.findByAuth0UserId("missing")).thenReturn(Optional.empty());

        Optional<String> role = userServiceJpa.getUserRoleByAuth0Id("missing");

        assertTrue(role.isEmpty());
    }

    @Test
    void syncAuth0User_shouldCreateNewUser_whenUserDoesNotExist() {
        Auth0UserDTO dto = new Auth0UserDTO();
        dto.setEmail("test@example.com");
        dto.setName("Ivan");
        dto.setSurname("Smiljanic");

        when(userRepository.findByAuth0UserId("auth0Id")).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ResponseEntity<?> response = userServiceJpa.syncAuth0User(dto, "auth0Id");

        verify(userRepository).save(any(User.class));
        Map<String, Object> body = (Map<String, Object>) response.getBody();

        assertEquals("test@example.com", body.get("email"));
        assertEquals("USER", body.get("role"));
        assertEquals(true, body.get("active"));
    }

    @Test
    void syncAuth0User_shouldReturnExistingUser_whenUserExists() {
        User existing = new User();
        existing.setAuth0UserId("auth0Id");
        existing.setUsername("existing@example.com");
        existing.setRole(Role.USER);
        existing.setActive(true);

        when(userRepository.findByAuth0UserId("auth0Id")).thenReturn(Optional.of(existing));

        ResponseEntity<?> response = userServiceJpa.syncAuth0User(new Auth0UserDTO(), "auth0Id");

        verify(userRepository, never()).save(any());
        Map<String, Object> body = (Map<String, Object>) response.getBody();

        assertEquals("existing@example.com", body.get("email"));
    }

    @Test
    void setUserActiveStatus_shouldUpdateUserActive() {
        User user = new User();
        user.setAuth0UserId("auth0Id");
        user.setActive(false);

        when(userRepository.findByAuth0UserId("auth0Id")).thenReturn(Optional.of(user));

        userServiceJpa.setUserActiveStatus("auth0Id", true);

        assertTrue(user.isActive());
        verify(userRepository).save(user);
    }

    @Test
    void setUserActiveStatus_shouldThrow_whenUserNotFound() {
        when(userRepository.findByAuth0UserId("missing")).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> userServiceJpa.setUserActiveStatus("missing", true));

        assertEquals("User not found", exception.getMessage());
    }

    @Test
    void updateUserRoles_shouldUpdateRoleAndSendEmail_whenEmailExists() {
        User user = new User();
        user.setAuth0UserId("auth0Id");
        user.setUsername("testuser");

        InstructorRequest request = new InstructorRequest();
        request.setEmail("notify@example.com");

        when(userRepository.findByAuth0UserId("auth0Id")).thenReturn(Optional.of(user));
        when(instructorRequestRepository.findFirstByUserOrderByRequestDateDesc(user))
                .thenReturn(Optional.of(request));

        userServiceJpa.updateUserRoles("auth0Id", Role.INSTRUCTOR);

        assertEquals(Role.INSTRUCTOR, user.getRole());
        verify(userRepository).save(user);
        verify(emailServiceJpa).sendRoleChangeNotification("notify@example.com", "INSTRUCTOR", user.getName());
    }

    @Test
    void updateUserRoles_shouldUpdateRoleAndNotSendEmail_whenNoEmailFound() {
        User user = new User();
        user.setAuth0UserId("auth0Id");
        user.setUsername("testuser");

        when(userRepository.findByAuth0UserId("auth0Id")).thenReturn(Optional.of(user));
        when(instructorRequestRepository.findFirstByUserOrderByRequestDateDesc(user))
                .thenReturn(Optional.empty());

        userServiceJpa.updateUserRoles("auth0Id", Role.INSTRUCTOR);

        assertEquals(Role.INSTRUCTOR, user.getRole());
        verify(userRepository).save(user);
        verify(emailServiceJpa, never()).sendRoleChangeNotification(any(), any(), any());
    }

    @Test
    void updateUserRoles_shouldThrow_whenUserNotFound() {
        when(userRepository.findByAuth0UserId("missing")).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> userServiceJpa.updateUserRoles("missing", Role.INSTRUCTOR));

        assertEquals("User not found", exception.getMessage());
    }

    @Test
    void testGetUserProfile_success() {
        String username = "testuser";
        User mockUser = new User();
        mockUser.setId(1);
        mockUser.setUsername(username);
        mockUser.setAuth0UserId("auth0|12345");
        mockUser.setDateCreated(LocalDateTime.now());

        UserBadgeDTO badge = new UserBadgeDTO();
        CourseDTO course = new CourseDTO();
        PostDTO post = new PostDTO(1, "content", "auth0|12345", username, new Date(1970, 1, 1), false);

        when(userRepository.findByUsername(username)).thenReturn(mockUser);
        when(badgeService.getUserBadgesByUserId(mockUser.getAuth0UserId())).thenReturn(List.of(badge));
        when(courseService.getCoursesByUserId(mockUser.getAuth0UserId())).thenReturn(List.of(course));
        when(postRepository.findByUserId(mockUser.getAuth0UserId())).thenReturn(List.of(
                new Post(1, "content", mockUser.getAuth0UserId(), new Date(1970, 1, 1), null, null, false, "category", null)
        ));

        UserProfileDTO result = userService.getUserProfile(username);

        assertNotNull(result);
        assertEquals(mockUser, result.getUser());
        assertEquals(1, result.getBadges().size());
        assertEquals(1, result.getCourses().size());
        assertEquals(1, result.getPosts().size());
    }

    @Test
    void testGetUserProfile_userNotFound() {
        String username = "unknown";
        when(userRepository.findByUsername(username)).thenReturn(null);

        UserNotFoundException exception = assertThrows(UserNotFoundException.class, () -> {
            userService.getUserProfile(username);
        });

        assertEquals(username, exception.getMessage());
    }
}