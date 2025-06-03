package programming.tutorial.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import programming.tutorial.dao.NotificationRepository;
import programming.tutorial.dao.PostRepository;
import programming.tutorial.dao.UserRepository;
import programming.tutorial.domain.Notification;
import programming.tutorial.domain.Post;
import programming.tutorial.domain.Role;
import programming.tutorial.domain.User;
import programming.tutorial.dto.NotificationDTO;
import programming.tutorial.dto.PostDTO;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class PostController {

    @Autowired
    private PostRepository postRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private NotificationRepository notificationRepository;

    @GetMapping
    public List<PostDTO> getAllPosts() {
        return postRepository.findAllByParentPostIsNull().stream()
                .map(post -> {
                    User user = userRepository.findByAuth0UserId(post.getUserId()).orElse(null);
                    String username = user != null ? user.getUsername() : "Unknown User";

                    List<PostDTO> replies = postRepository.findAllByParentPost(post).stream()
                            .map(reply -> {
                                User replyUser = userRepository.findByAuth0UserId(reply.getUserId()).orElse(null);
                                String replyUsername = replyUser != null ? replyUser.getUsername() : "Unknown User";
                                return new PostDTO(reply.getId(), reply.getContent(), reply.getUserId(), replyUsername, reply.getCreatedAt(), null); // Pass null for replies
                            }).collect(Collectors.toList());

                    return new PostDTO(post.getId(), post.getContent(), post.getUserId(), username, post.getCreatedAt(), replies);
                })
                .collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<?> createPost(@RequestBody Post post) {
        String userId = String.valueOf(post.getUserId());
        int wordCount = post.getContent().trim().isEmpty() ? 0 : post.getContent().trim().split("\\s+").length;

        if (wordCount > 1024) {
            return ResponseEntity.badRequest().body("Post content exceeds the maximum length of 1024 words.");
        }

        post.setCreatedAt(new Date());
        Post savedPost = postRepository.save(post);
        if (post.getParentPost() != null && post.getParentPost().getId() != null) {
            Post parentPost = postRepository.findById(post.getParentPost().getId()).orElse(null);
            if (parentPost == null) {
                return ResponseEntity.badRequest().body("Parent post does not exist.");
            }
            System.out.println(post.getId() + " " + parentPost.getId());
            if (!parentPost.getUserId().equals(userId)) {
                Notification notification = new Notification();
                notification.setUserId(parentPost.getUserId());
                notification.setPostId(parentPost.getId());
                notification.setReplyId(savedPost.getId());
                notification.setMessage(post.getContent());
                notification.setRead(false);
                notification.setCreatedAt(new Date());
                notificationRepository.save(notification);
            }
        }

        return ResponseEntity.ok(savedPost);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePost(@PathVariable Integer id, @AuthenticationPrincipal Jwt jwt) {
        String auth0UserId = jwt.getSubject();

        User user = userRepository.findByAuth0UserId(auth0UserId).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found.");
        }

        if (!postRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Post not found.");
        }

        Post postToDelete = postRepository.findById(id).orElse(null);
        if (postToDelete == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Post not found.");
        }

        if (!postToDelete.getUserId().equals(auth0UserId) && !user.getRole().equals(Role.ADMIN)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You do not have permission to delete this post.");
        }

        postRepository.delete(postToDelete);
        return ResponseEntity.ok("Post and its replies deleted successfully.");
    }

    @GetMapping("/notifications/{userId}")
    public ResponseEntity<List<NotificationDTO>> getNotifications(@PathVariable String userId) {
        List<Notification> notifications = notificationRepository.findByUserId(userId);
        List<NotificationDTO> notificationDTOs = notifications.stream().map(notification -> {
            User user = userRepository.findByAuth0UserId(notification.getUserId()).orElse(null);
            String username = user != null ? user.getUsername() : "Unknown User";
            return new NotificationDTO(notification.getId(), notification.getUserId(), notification.getPostId(),
                    notification.getReplyId(), notification.getMessage(),
                    notification.isRead(), notification.getCreatedAt(), username);
        }).collect(Collectors.toList());

        System.out.println("Notification DTOs: " + notificationDTOs);

        return ResponseEntity.ok(notificationDTOs);
    }

    @GetMapping("/{postId}")
    public ResponseEntity<PostDTO> getPost(@PathVariable Integer postId) {
        Post post = postRepository.findById(postId).orElse(null);
        if (post == null) {
            return ResponseEntity.notFound().build();
        }

        User user = userRepository.findByAuth0UserId(post.getUserId()).orElse(null);
        String username = user != null ? user.getUsername() : "Unknown User";

        List<PostDTO> replies = postRepository.findAllByParentPost(post).stream()
                .map(reply -> {
                    User replyUser = userRepository.findByAuth0UserId(reply.getUserId()).orElse(null);
                    String replyUsername = replyUser != null ? replyUser.getUsername() : "Unknown User";
                    return new PostDTO(reply.getId(), reply.getContent(), reply.getUserId(), replyUsername, reply.getCreatedAt());
                }).collect(Collectors.toList());

        PostDTO postDTO = new PostDTO(post.getId(), post.getContent(), post.getUserId(), username, post.getCreatedAt(), replies);
        return ResponseEntity.ok(postDTO);
    }

}