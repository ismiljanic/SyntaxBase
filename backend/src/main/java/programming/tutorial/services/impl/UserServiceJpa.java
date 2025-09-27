package programming.tutorial.services.impl;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import programming.tutorial.dao.*;
import programming.tutorial.domain.*;
import programming.tutorial.dto.*;
import programming.tutorial.services.BadgeService;
import programming.tutorial.services.PostService;
import programming.tutorial.services.UserCourseService;
import programming.tutorial.services.UserService;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserServiceJpa implements UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private InstructorRequestRepository instructorRequestRepository;

    @Autowired
    private EmailServiceJpa emailService;

    @Autowired
    private PostService postService;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private RatingRepository ratingRepository;

    @Autowired
    private UserCourseRepository userCourseRepository;
    @Autowired
    private UserProgressRepository userProgressRepository;
    @Autowired
    private LessonFeedbackRepository lessonFeedbackRepository;
    @Autowired
    private CertificateRepository certificateRepository;
    @Autowired
    private UserBadgeRepository userBadgeRepository;
    @Autowired
    private BadgeService badgeService;
    @Autowired
    private UserCourseService courseService;

    @Override
    public ResponseEntity<?> addUser(@RequestBody UserDTO userDTO) {
        try {
            System.out.println("Received registration request: " + userDTO.toString());
            User existingUsernameUser = userRepository.findByUsername(userDTO.getUsername());

            if (existingUsernameUser != null) {
                System.out.println("Registration failed - Username already exists: " + userDTO.getUsername());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username already exists");
            }

            System.out.println("Creating new user with username: " + userDTO.getUsername());

            User user = new User();
            user.setUsername(userDTO.getUsername());
            user.setPassword(userDTO.getPassword());
            user.setName(userDTO.getName());
            user.setSurname(userDTO.getSurname());
            user.setDateCreated(LocalDateTime.now());
            user.setRole(Role.USER);
            user.setActive(true);
            System.out.println(user.toString());

            userRepository.save(user);

            String successMessage = "Registration successful for user " + userDTO.getUsername() + " with ID: " + user.getId();
            System.out.println(successMessage);

            return ResponseEntity.ok(Map.of("userType", "user", "id", user.getId()));
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Error during registration");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error during registration");
        }
    }

    @Override
    public Optional<User> findById(Integer userId) {
        return Optional.empty();
    }

    @Override
    public Optional<User> findByUsername(String username) {
        return Optional.ofNullable(userRepository.findByUsername(username));
    }

    public void updateName(String auth0UserId, String name) {
        User existingUser = userRepository.findByAuth0UserId(auth0UserId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        existingUser.setName(name);
        userRepository.save(existingUser);
    }

    public void updateSurname(String userId, String lastName) {
        User existingUser = userRepository.findByAuth0UserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        existingUser.setSurname(lastName);
        userRepository.save(existingUser);
    }

    public void updateUsername(String userId, String username) {
        User existingUser = userRepository.findByAuth0UserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        existingUser.setUsername(username);
        userRepository.save(existingUser);
    }

    public void deleteUser(String auth0UserId) {
        Optional<User> userOptional = userRepository.findByAuth0UserId(auth0UserId);
        if (userOptional.isEmpty()) {
            throw new RuntimeException("User not found.");
        }

        userRepository.delete(userOptional.get());
    }

    public void deleteUserAsAdmin(String auth0UserId) {
        Optional<User> userOptional = userRepository.findByAuth0UserId(auth0UserId);
        if (userOptional.isEmpty()) {
            throw new RuntimeException("User not found.");
        }

        userRepository.delete(userOptional.get());
    }

    public User findByAuth0UserId(String auth0Id) throws UserNotFoundException {
        System.out.println("Service layer: Fetching user by Auth0 ID: " + auth0Id);
        Optional<User> userOptional = userRepository.findByAuth0UserId(auth0Id);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            System.out.println("User found: " + user);
            return user;
        } else {
            System.out.println("User not found with Auth0 ID: " + auth0Id);
            throw new UserNotFoundException("User not found with Auth0 ID: " + auth0Id);
        }
    }

    public UserDTO getUserDTOByAuth0UserId(String auth0Id) throws UserNotFoundException {
        User user = findByAuth0UserId(auth0Id);
        return new UserDTO(user.getAuth0UserId(), user.getUsername(), user.getRole(), user.isActive());
    }

    public UserAccountDTO getUserAccountDTOByAuth0UserId(String auth0UserId) throws UserNotFoundException {
        User user = userRepository.findByAuth0UserId(auth0UserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<UserCourse> userCourses = userCourseRepository.findByUser_Auth0UserId(auth0UserId);

        UserAccountDTO dto = new UserAccountDTO();
        dto.setName(user.getName());
        dto.setSurname(user.getSurname());
        dto.setUsername(user.getUsername());
        dto.setDateCreated(user.getDateCreated().toString());
        dto.setRole(user.getRole());
        dto.setActive(user.isActive());

        List<PostDTO> allPosts = postRepository.findByUserId(auth0UserId)
                .stream()
                .map(post -> new PostDTO(post.getId(), post.getContent(), post.getUserId(),
                        user.getUsername(), post.getCreatedAt(), post.isDeleted()))
                .toList();

        List<PostDTO> deletedPosts = postRepository.findByUserIdAndDeletedTrue(auth0UserId)
                .stream()
                .map(post -> new PostDTO(post.getId(), post.getContent(), post.getUserId(),
                        user.getUsername(), post.getCreatedAt(), post.isDeleted()))
                .collect(Collectors.toList());


        dto.setUserPosts(allPosts);
        dto.setDeletedPosts(deletedPosts);

        List<Rating> ratings = ratingRepository.findByAuth0UserId(auth0UserId);
        Map<Long, Integer> ratingMap = ratings.stream()
                .collect(Collectors.toMap(
                        Rating::getCourseId,
                        Rating::getRating,
                        (existing, replacement) -> replacement
                ));

        List<CourseProgressDTO> courseDTOs = userCourses.stream().map(userCourse -> {
            Course course = userCourse.getCourse();
            Integer rating = ratingMap.get(Long.valueOf(course.getId()));

            CourseProgressDTO cp = new CourseProgressDTO();
            cp.setCourseId(course.getId());
            cp.setCourseName(course.getCourseName());
            cp.setDescription(course.getDescription());

            int totalLessons = course.getLength();
            Long completedLessons = lessonRepository.countCompletedLessonsForUserAndCourse(course.getId(), user.getId());
            double progress = totalLessons > 0 ? (completedLessons / (double) totalLessons) * 100 : 0;

            cp.setTotalLessons(totalLessons);
            cp.setCompletedLessons(completedLessons.intValue());
            cp.setProgress(progress);
            cp.setRating(rating);
            return cp;
        }).collect(Collectors.toList());

        dto.setCourses(courseDTOs);

        return dto;
    }

    @Override
    public void upgradeTier(String auth0Id, Tier newTier) {
        User user = userRepository.findByAuth0UserId(auth0Id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (newTier.ordinal() == user.getTier().ordinal()) {
            throw new IllegalArgumentException("You are already on this tier.");
        }

        user.setTier(newTier);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void removeUserFromCourse(String auth0UserId, Integer courseId) {
        List<UserCourse> userCourses = userCourseRepository.findByUser_Auth0UserIdAndCourseId(auth0UserId, courseId);

        if (userCourses.isEmpty()) {
            throw new RuntimeException("User is not enrolled in the specified course");
        }

        Integer userId = userRepository.findByAuth0UserId(auth0UserId)
                .orElseThrow(() -> new RuntimeException("User not found with auth0UserId: " + auth0UserId))
                .getId();

        userProgressRepository.deleteByUserIdAndCourseId(userId, courseId);

        lessonRepository.deleteByUserIdAndCourseId(userId, courseId);

        lessonFeedbackRepository.deleteByUserIdAndCourseId(userId, courseId);

        ratingRepository.deleteByAuth0UserIdAndCourseId(auth0UserId, courseId);

        userCourseRepository.deleteAll(userCourses);
    }


    @Override
    public boolean getUserActiveStatus(String auth0UserId) {
        return userRepository.findByAuth0UserId(auth0UserId)
                .map(User::isActive)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + auth0UserId));
    }


    @Override
    public UserAccountDTO getUserAccountInformation(String auth0UserId) {
        User user = userRepository.findByAuth0UserId(auth0UserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<PostDTO> userPosts = postRepository.findByUserId(auth0UserId)
                .stream()
                .map(post -> new PostDTO(post.getId(), post.getContent(), post.getUserId(),
                        user.getUsername(), post.getCreatedAt(), post.isDeleted()))
                .collect(Collectors.toList());

        List<PostDTO> deletedPosts = postRepository.findDeletedPostsByUserId(auth0UserId)
                .stream()
                .map(post -> new PostDTO(post.getId(), post.getContent(), post.getUserId(),
                        user.getUsername(), post.getCreatedAt(), post.isDeleted()))
                .collect(Collectors.toList());

        List<CertificateDTO> certificates = certificateRepository.findByUser_Auth0UserId(auth0UserId)
                .stream()
                .map(c -> new CertificateDTO(c.getId(), c.getCourse().getCourseName(), c.getIssuedAt(), c.getFileUrl()))
                .collect(Collectors.toList());

        List<UserBadgeDTO> badges = userBadgeRepository.findByUser(user)
                .stream()
                .map(ub -> new UserBadgeDTO(
                        ub.getId(),
                        new BadgeDTO(
                                ub.getBadge().getId(),
                                ub.getBadge().getName(),
                                ub.getBadge().getDescription(),
                                ub.getBadge().getType(),
                                ub.getBadge().getCriteria(),
                                ub.getBadge().isPermanent()
                        ),
                        ub.getAwardedAt(),
                        ub.isRevoked(),
                        ub.getProgress()
                ))
                .collect(Collectors.toList());

        UserAccountDTO userAccountDTO = new UserAccountDTO();
        userAccountDTO.setName(user.getName());
        userAccountDTO.setSurname(user.getSurname());
        userAccountDTO.setUsername(user.getUsername());
        userAccountDTO.setDateCreated(user.getDateCreated().toString());
        userAccountDTO.setUserPosts(userPosts);
        userAccountDTO.setDeletedPosts(deletedPosts);
        userAccountDTO.setRole(user.getRole());
        userAccountDTO.setTier(user.getTier());
        userAccountDTO.setCertificates(certificates);
        userAccountDTO.setBadges(badges);

        return userAccountDTO;
    }

    @Override
    public List<UserDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream().filter(user -> user.getRole() != Role.ADMIN).map(user -> {
            UserDTO dto = new UserDTO();
            dto.setAuth0UserId(user.getAuth0UserId());
            dto.setUsername(user.getUsername());
            dto.setRole(user.getRole());
            dto.setActive(user.isActive());
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public Optional<UserIdDTO> getUserIdByAuth0Id(String auth0Id) {
        return userRepository.findByAuth0UserId(auth0Id)
                .map(user -> new UserIdDTO(user.getAuth0UserId()));
    }

    @Override
    public Integer getUserId(String auth0Id) {
        return userRepository.findByAuth0UserId(auth0Id)
                .map(User::getId)
                .orElseThrow(() -> new NoSuchElementException("User not found with Auth0 ID: " + auth0Id));
    }

    @Override
    public Optional<String> getUserRoleByAuth0Id(String auth0UserId) {
        return userRepository.findByAuth0UserId(auth0UserId)
                .map(user -> user.getRole().name());
    }

    @Override
    @Transactional
    public ResponseEntity<?> syncAuth0User(Auth0UserDTO auth0User, String auth0UserId) {
        Optional<User> existingUser = userRepository.findByAuth0UserId(auth0UserId);
        User user;

        if (existingUser.isEmpty()) {
            user = new User();
            user.setAuth0UserId(auth0UserId);
            user.setUsername(auth0User.getEmail());
            user.setName(auth0User.getName());
            user.setSurname(auth0User.getSurname());
            user.setPassword("");
            user.setDateCreated(LocalDateTime.now());
            user.setRole(Role.USER);
            user.setActive(true);

            userRepository.save(user);
            System.out.println("New Auth0 user created: " + user.getUsername());
        } else {
            user = existingUser.get();
            System.out.println("User already exists: " + user.getUsername());
        }

        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("email", user.getUsername());
        responseBody.put("role", user.getRole().toString());
        responseBody.put("active", user.isActive());
        return ResponseEntity.ok(responseBody);
    }

    @Override
    public void setUserActiveStatus(String userId, boolean active) {
        User user = userRepository.findByAuth0UserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setActive(active);
        userRepository.save(user);
    }

    @Override
    public void updateUserRoles(String userId, Role role) {
        User user = userRepository.findByAuth0UserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setRole(role);
        userRepository.save(user);

        String email = instructorRequestRepository.findFirstByUserOrderByRequestDateDesc(user)
                .map(InstructorRequest::getEmail)
                .orElse(null);

        if (email != null) {
            emailService.sendRoleChangeNotification(email, role.name(), user.getName());
        } else {
            System.out.println("No email found for user " + user.getUsername() + " to send role change notification.");
        }
    }

    public User getOrCreateUserByAuth0Id(String auth0UserId) {
        return userRepository.findByAuth0UserId(auth0UserId)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setAuth0UserId(auth0UserId);
                    return userRepository.save(newUser);
                });
    }

    public UserProfileDTO getUserProfile(String username) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new UserNotFoundException(username);
        }

        List<UserBadgeDTO> badges = badgeService.getUserBadgesByUserId(user.getAuth0UserId());
        List<CourseDTO> courses = courseService.getCoursesByUserId(user.getAuth0UserId());
        List<PostDTO> posts = postRepository.findByUserId(user.getAuth0UserId())
                .stream()
                .map(post -> new PostDTO(post.getId(), post.getContent(), post.getUserId(),
                        user.getUsername(), post.getCreatedAt(), post.isDeleted()))
                .toList();

        return new UserProfileDTO(user, badges, courses, posts);
    }
}