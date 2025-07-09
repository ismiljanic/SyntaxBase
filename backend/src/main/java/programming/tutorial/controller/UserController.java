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
import programming.tutorial.dao.InstructorRequestRepository;
import programming.tutorial.dao.PostRepository;
import programming.tutorial.dao.UserRepository;
import programming.tutorial.domain.InstructorRequest;
import programming.tutorial.domain.InstructorRequestStatus;
import programming.tutorial.domain.Role;
import programming.tutorial.domain.User;
import programming.tutorial.dto.*;
import programming.tutorial.services.UserService;
import programming.tutorial.services.impl.InstructorRequestServiceJpa;
import programming.tutorial.services.impl.UserServiceJpa;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.security.Principal;
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
    private InstructorRequestServiceJpa instructorRequestServiceJpa;

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
    public ResponseEntity<?> syncAuth0User(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody Auth0UserDTO auth0User
    ) {
        return userService.syncAuth0User(auth0User, jwt.getSubject());
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
            UserAccountDTO userAccountDTO = userService.getUserAccountInformation(decodedUserId);
            return ResponseEntity.ok(userAccountDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
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

    @DeleteMapping("/deleteAccount")
    public ResponseEntity<String> deleteOwnAccount(Principal principal) {
        try {
            String auth0UserId = principal.getName();
            userService.deleteUser(auth0UserId);
            return ResponseEntity.ok("Account deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting account: " + e.getMessage());
        }
    }


    @GetMapping("/allUsers")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/by-auth0-id/{auth0Id}")
    public ResponseEntity<?> getUserIdByAuth0Id(@PathVariable String auth0Id) {
        Optional<UserIdDTO> userIdDto = userService.getUserIdByAuth0Id(auth0Id);
        return userIdDto
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("User not found with Auth0 ID: " + auth0Id));
    }

    @PostMapping("/request-instructor")
    public ResponseEntity<?> requestInstructorRole(@RequestBody InstructorRequestDTO dto, Principal principal) {
        return instructorRequestServiceJpa.submitInstructorRequest(dto, principal.getName());
    }

    @GetMapping("/role/{auth0UserId}")
    public ResponseEntity<Map<String, String>> getUserRole(@PathVariable String auth0UserId) {
        Optional<String> roleOpt = userService.getUserRoleByAuth0Id(auth0UserId);
        return roleOpt
                .<ResponseEntity<Map<String, String>>>map(role -> ResponseEntity.ok(Map.of("role", role)))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
    }

}