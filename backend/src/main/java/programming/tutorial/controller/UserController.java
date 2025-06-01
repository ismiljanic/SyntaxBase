package programming.tutorial.controller;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import programming.tutorial.dao.PostRepository;
import programming.tutorial.dao.UserRepository;
import programming.tutorial.domain.Role;
import programming.tutorial.domain.User;
import programming.tutorial.dto.*;
import programming.tutorial.services.UserService;
import programming.tutorial.services.impl.UserServiceJpa;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class UserController {
    @Autowired
    private UserServiceJpa userService;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    @GetMapping("/userInformation")
    public User getUserInformation(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            try {
                DecodedJWT decodedJWT = JWT.decode(token);
                String auth0UserId = decodedJWT.getSubject();
                System.out.println("Auth0 User ID: " + auth0UserId);

                return userService.findByAuth0UserId(auth0UserId);

            } catch (Exception e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid token", e);
            }
        }

        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing or invalid token");
    }
    @PostMapping("/sync-auth0")
    @Transactional
    public ResponseEntity<String> syncAuth0User(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody Auth0UserDTO auth0User
    ) {
        String auth0UserId = jwt.getSubject();

        Optional<User> existingUser = userRepository.findByAuth0UserId(auth0UserId);

        if (existingUser.isEmpty()) {
            User newUser = new User();
            newUser.setAuth0UserId(auth0UserId);
            newUser.setUsername(auth0User.getEmail());
            newUser.setName(auth0User.getName());
            newUser.setSurname(auth0User.getSurname());
            newUser.setPassword("");
            newUser.setDateCreated(LocalDateTime.now());
            newUser.setRole(Role.USER);

            userRepository.save(newUser);
            System.out.println("New Auth0 user created: " + newUser.getUsername());
            return ResponseEntity.ok("User created");
        } else {
            System.out.println("User already exists: " + existingUser.get().getUsername());
            return ResponseEntity.ok("User already exists");
        }
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

    @GetMapping("/accountInformation/{userId}")
    public ResponseEntity<UserAccountDTO> getUserAccountInformation(@PathVariable String userId) {
        try {
            String decodedUserId = URLDecoder.decode(userId, StandardCharsets.UTF_8);
            Optional<User> userOptional = userRepository.findByAuth0UserId(decodedUserId);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                List<PostDTO> userPosts = postRepository.findByUserId(user.getAuth0UserId())
                        .stream()
                        .map(post -> new PostDTO(post.getId(), post.getContent(), post.getUserId(),
                                user.getUsername(), post.getCreatedAt()))
                        .collect(Collectors.toList());

                List<PostDTO> deletedPosts = postRepository.findDeletedPostsByUserId(user.getAuth0UserId())
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

                return ResponseEntity.ok(userAccountDTO);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("/updateName")
    public ResponseEntity<String> updateName(@AuthenticationPrincipal Jwt jwt, @RequestBody UserUpdateRequest request) {
        try {
            String auth0UserId = jwt.getClaimAsString("sub");

            System.out.println("Auth0 User ID from token: " + auth0UserId);
            System.out.println("New Name: " + request.getName());

            userService.updateName(auth0UserId, request.getName());
            return ResponseEntity.ok("Name updated successfully");
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }


    @PutMapping("/updateSurname/{userId}")
    public ResponseEntity<String> updateSurname(@PathVariable String userId, @RequestBody UserUpdateRequest request) {
        try {
            userService.updateSurname(userId, request.getSurname());
            return ResponseEntity.ok("Surname updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PutMapping("/updateUsername/{userId}")
    public ResponseEntity<String> updateUsername(@PathVariable String userId, @RequestBody UserUpdateRequest request) {
        try {
            userService.updateUsername(userId, request.getUsername());
            return ResponseEntity.ok("Username updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

//    @PutMapping("/changePassword/{userId}")
//    public ResponseEntity<String> changePassword(@PathVariable String userId, @RequestBody ChangePasswordRequest request) {
//        try {
//            userService.changePassword(userId, request.getCurrentPassword(), request.getNewPassword());
//            return ResponseEntity.ok("Password changed successfully");
//        } catch (Exception e) {
//            System.out.println("Error: " + e.getMessage());
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
//        }
//    }


    @DeleteMapping("/deleteAccount/{userId}")
    public ResponseEntity<String> deleteAccount(@PathVariable String userId, @RequestBody PasswordRequest request,
                                                @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String decodedUserId = URLDecoder.decode(userId, StandardCharsets.UTF_8);
            System.out.println("Received DELETE request for userId: " + decodedUserId);
            System.out.println("Password received: " + request.getPassword());

            userService.deleteUser(decodedUserId, request.getPassword());
            return ResponseEntity.ok("Account deleted successfully");
        } catch (Exception e) {
            System.out.println("Error deleting account: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }


    @GetMapping("/allUsers")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<UserDTO> userDTOs = users.stream().map(user -> {
            UserDTO dto = new UserDTO();
            dto.setId(user.getId());
            dto.setUsername(user.getUsername());
            dto.setRole(user.getRole());
            return dto;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(userDTOs);
    }

    @GetMapping("/by-auth0-id/{auth0Id}")
    public ResponseEntity<?> getUserIdByAuth0Id(@PathVariable String auth0Id) {
        Optional<User> userOpt = userRepository.findByAuth0UserId(auth0Id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            return ResponseEntity.ok(new UserIdDTO(user.getAuth0UserId()));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found with Auth0 ID: " + auth0Id);
        }
    }
}