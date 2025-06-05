package programming.tutorial.services.impl;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import programming.tutorial.dao.InstructorRequestRepository;
import programming.tutorial.dao.PostRepository;
import programming.tutorial.dao.UserRepository;
import programming.tutorial.domain.Course;
import programming.tutorial.domain.Role;
import programming.tutorial.domain.User;
import programming.tutorial.dto.*;
import programming.tutorial.services.UserService;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserServiceJpa implements UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private InstructorRequestRepository instructorRequestRepository;

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

    public void deleteUser(String auth0UserId, String password) {
        Optional<User> userOptional = userRepository.findByAuth0UserId(auth0UserId);
        if (userOptional.isEmpty()) {
            throw new RuntimeException("User not found.");
        }

        User user = userOptional.get();

        if (!password.equals(user.getPassword())) {
            throw new RuntimeException("Password is incorrect");
        }

        userRepository.delete(user);
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

    @Override
    public UserAccountDTO getUserAccountInformation(String auth0UserId) {
        User user = userRepository.findByAuth0UserId(auth0UserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<PostDTO> userPosts = postRepository.findByUserId(auth0UserId)
                .stream()
                .map(post -> new PostDTO(post.getId(), post.getContent(), post.getUserId(),
                        user.getUsername(), post.getCreatedAt()))
                .collect(Collectors.toList());

        List<PostDTO> deletedPosts = postRepository.findDeletedPostsByUserId(auth0UserId)
                .stream()
                .map(post -> new PostDTO(post.getId(), post.getContent(), post.getUserId(),
                        user.getUsername(), post.getCreatedAt()))
                .collect(Collectors.toList());

        UserAccountDTO userAccountDTO = new UserAccountDTO();
        userAccountDTO.setName(user.getName());
        userAccountDTO.setSurname(user.getSurname());
        userAccountDTO.setUsername(user.getUsername());
        userAccountDTO.setDateCreated(user.getDateCreated().toString());
        userAccountDTO.setUserPosts(userPosts);
        userAccountDTO.setDeletedPosts(deletedPosts);

        return userAccountDTO;
    }

    @Override
    public List<UserDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream().map(user -> {
            UserDTO dto = new UserDTO();
            dto.setId(user.getId());
            dto.setUsername(user.getUsername());
            dto.setRole(user.getRole());
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public Optional<UserIdDTO> getUserIdByAuth0Id(String auth0Id) {
        return userRepository.findByAuth0UserId(auth0Id)
                .map(user -> new UserIdDTO(user.getAuth0UserId()));
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

            userRepository.save(user);
            System.out.println("New Auth0 user created: " + user.getUsername());
        } else {
            user = existingUser.get();
            System.out.println("User already exists: " + user.getUsername());
        }

        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("email", user.getUsername());
        responseBody.put("role", user.getRole().toString());

        return ResponseEntity.ok(responseBody);
    }

    public User getOrCreateUserByAuth0Id(String auth0UserId) {
        return userRepository.findByAuth0UserId(auth0UserId)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setAuth0UserId(auth0UserId);
                    return userRepository.save(newUser);
                });
    }
}