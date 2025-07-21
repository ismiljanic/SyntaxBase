package programming.tutorial.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import programming.tutorial.domain.Role;
import programming.tutorial.dto.UserAccountDTO;
import programming.tutorial.dto.UserDTO;
import programming.tutorial.services.PostService;
import programming.tutorial.services.UserService;
import programming.tutorial.services.impl.UserNotFoundException;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class UserAdminController {
    @Autowired
    private final UserService userService;
    @Autowired
    private PostService postService;

    public UserAdminController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers(
    ) {
        List<UserDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PutMapping("/{userId}/suspend")
    public ResponseEntity<?> suspendUser(@PathVariable String userId) {
        try {
            userService.setUserActiveStatus(userId, false);
            return ResponseEntity.ok("User suspended");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping("/{userId}/activate")
    public ResponseEntity<?> activateUser(@PathVariable String userId) {
        try {
            userService.setUserActiveStatus(userId, true);
            return ResponseEntity.ok("User activated");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping("/{userId}/roles")
    public ResponseEntity<?> updateUserRole(@PathVariable String userId, @RequestBody Role role) {
        try {
            userService.updateUserRoles(userId, role);
            return ResponseEntity.ok("User role updated");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/deleteAccount/{userId}")
    public ResponseEntity<String> deleteUserAsAdmin(
            @PathVariable String userId,
            @RequestHeader("Authorization") String authHeader,
            Principal principal) {
        try {
            String adminAuth0Id = principal.getName();
            System.out.println("Admin ID from token: " + adminAuth0Id);
            System.out.println("Target user to delete: " + userId);

            userService.deleteUserAsAdmin(userId);
            return ResponseEntity.ok("User deleted successfully");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting user: " + e.getMessage());
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserAccountDTO> getUserById(@PathVariable String userId) {
        try {
            UserAccountDTO userDto = userService.getUserAccountDTOByAuth0UserId(userId);
            return ResponseEntity.ok(userDto);
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("/posts/{postId}/delete")
    public ResponseEntity<String> softDeletePostAsAdmin(@PathVariable Integer postId) {
        try {
            postService.softDeletePost(postId);
            return ResponseEntity.ok("Post soft-deleted successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Post not found");
        }
    }

    @PutMapping("/posts/{postId}/restore")
    public ResponseEntity<String> restoreDeletedPost(@PathVariable Integer postId) {
        try {
            postService.restorePost(postId);
            return ResponseEntity.ok("Post restored");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Post not found");
        }
    }

    @DeleteMapping("/{userId}/courses/{courseId}")
    public ResponseEntity<String> removeUserFromCourse(
            @PathVariable String userId,
            @PathVariable Integer courseId) {
        try {
            userService.removeUserFromCourse(userId, courseId);
            return ResponseEntity.ok("User removed from course successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}