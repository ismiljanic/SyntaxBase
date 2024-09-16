package programming.tutorial.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import programming.tutorial.dao.UserRepository;
import programming.tutorial.domain.User;
import programming.tutorial.dto.ChangePasswordRequest;
import programming.tutorial.dto.PasswordRequest;
import programming.tutorial.dto.UserDTO;
import programming.tutorial.dto.UserUpdateRequest;
import programming.tutorial.services.UserService;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/userInformation/{id}")
    public User getUserInformation(@PathVariable String id) {
        System.out.println("Fetching user information for ID: " + id);
        User user = userService.getUserById(id);
        if (user != null) {
            System.out.println("User found: " + user);
        } else {
            System.out.println("User not found with ID: " + id);
        }
        return user;
    }


    @RequestMapping(value = "/register", method = {RequestMethod.POST, RequestMethod.OPTIONS})
    ResponseEntity<?> registerUser(@RequestBody UserDTO userDTO) {
        ResponseEntity<?> responseEntity = userService.addUser(userDTO);
        if (responseEntity.getStatusCode() == HttpStatus.OK) {
            return ResponseEntity.ok(Map.of("userType", "user", "id", Objects.requireNonNull(responseEntity.getBody())));
        } else if (responseEntity.getStatusCode() == HttpStatus.BAD_REQUEST) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseEntity.getBody());
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error during registration");
        }
    }

    @PostMapping(value = "/login", consumes = "application/x-www-form-urlencoded", produces = "application/json")
    public ResponseEntity<?> loginUser(@RequestParam String username, @RequestParam String password) {
        UserDTO userDTO = new UserDTO();
        userDTO.setUsername(username);
        userDTO.setPassword(password);

        Optional<User> userOptional = Optional.ofNullable(userRepository.findByUsername(userDTO.getUsername()));
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body("Username does not exist");
        }

        User user = userOptional.get();
        if (!user.getPassword().equals(userDTO.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect password");
        }

        String userType = "user";
        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("id", user.getId());
        responseBody.put("type", userType);
        return ResponseEntity.ok(responseBody);
    }

    @GetMapping("/accountInformation/{userId}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long userId) {
        try {
            Optional<User> userOptional = userRepository.findById(Math.toIntExact(userId));
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                UserDTO userDTO = new UserDTO();
                userDTO.setName(user.getName());
                userDTO.setSurname(user.getSurname());
                userDTO.setUsername(user.getUsername());
                userDTO.setDateCreated(user.getDateCreated());
                return ResponseEntity.ok(userDTO);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("/updateName/{userId}")
    public ResponseEntity<String> updateName(@PathVariable Long userId, @RequestBody UserUpdateRequest request) {
        try {
            System.out.println("User ID: " + userId);
            System.out.println("New Name: " + request.getName());
            userService.updateName(userId, request.getName());
            return ResponseEntity.ok("Name updated successfully");
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PutMapping("/updateSurname/{userId}")
    public ResponseEntity<String> updateSurname(@PathVariable Long userId, @RequestBody UserUpdateRequest request) {
        try {
            userService.updateSurname(userId, request.getSurname());
            return ResponseEntity.ok("Surname updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PutMapping("/updateUsername/{userId}")
    public ResponseEntity<String> updateUsername(@PathVariable Long userId, @RequestBody UserUpdateRequest request) {
        try {
            userService.updateUsername(userId, request.getUsername());
            return ResponseEntity.ok("Username updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PutMapping("/changePassword/{userId}")
    public ResponseEntity<String> changePassword(@PathVariable Long userId, @RequestBody ChangePasswordRequest request) {
        try {
            userService.changePassword(userId, request.getCurrentPassword(), request.getNewPassword());
            return ResponseEntity.ok("Password changed successfully");
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }


    @DeleteMapping("/deleteAccount/{userId}")
    public ResponseEntity<String> deleteAccount(@PathVariable Long userId, @RequestBody PasswordRequest request) {
        try {
            System.out.println("Received DELETE request for userId: " + userId);
            System.out.println("Password received: " + request.getPassword());
            userService.deleteUser(userId, request.getPassword());
            return ResponseEntity.ok("Account deleted successfully");
        } catch (Exception e) {
            System.out.println("Error deleting account: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}