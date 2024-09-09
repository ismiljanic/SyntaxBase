package programming.tutorial.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import programming.tutorial.dao.UserRepository;
import programming.tutorial.domain.User;
import programming.tutorial.dto.UserDTO;
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
        // Create a UserDTO object from the request parameters
        UserDTO userDTO = new UserDTO();
        userDTO.setUsername(username);
        userDTO.setPassword(password);

        // Handle login logic
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
        System.out.println(responseBody);
        return ResponseEntity.ok(responseBody);
    }

}