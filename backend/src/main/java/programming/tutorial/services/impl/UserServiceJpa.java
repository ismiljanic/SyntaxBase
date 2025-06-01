package programming.tutorial.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import programming.tutorial.dao.UserRepository;
import programming.tutorial.domain.Course;
import programming.tutorial.domain.Role;
import programming.tutorial.domain.User;
import programming.tutorial.dto.UserDTO;
import programming.tutorial.services.UserService;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@Service
public class UserServiceJpa implements UserService {
    @Autowired
    private UserRepository userRepository;

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

//    public void changePassword(String userId, String currentPassword, String newPassword) {
//        User user = userRepository.findByAuth0UserId(userId)
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        if (!currentPassword.equals(user.getPassword())) {
//            throw new RuntimeException("Current password is incorrect");
//        }
//
//        user.setPassword(newPassword);
//        userRepository.save(user);
//    }

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
    public User getOrCreateUserByAuth0Id(String auth0UserId) {
        return userRepository.findByAuth0UserId(auth0UserId)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setAuth0UserId(auth0UserId);
                    return userRepository.save(newUser);
                });
    }


}