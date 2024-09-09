package programming.tutorial.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import programming.tutorial.dao.UserRepository;
import programming.tutorial.domain.User;
import programming.tutorial.dto.UserDTO;
import programming.tutorial.services.UserService;

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
    public Optional<User> findByUsername(String username) {
        return Optional.ofNullable(userRepository.findByUsername(username));
    }

}