package programming.tutorial.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import programming.tutorial.dao.PostRepository;
import programming.tutorial.dao.UserRepository;
import programming.tutorial.domain.Post;
import programming.tutorial.domain.User;
import programming.tutorial.dto.PostDTO;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*")
public class PostController {

    @Autowired
    private PostRepository postRepository;
    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<PostDTO> getAllPosts() {
        return postRepository.findAll().stream()
                .map(post -> {
                    User user = userRepository.findById(post.getUserId()).orElse(null);
                    String username = user != null ? user.getUsername() : "Unknown User";
                    List<PostDTO> replies = postRepository.findAllByParentPost(post).stream()
                            .map(reply -> {
                                User replyUser = userRepository.findById(reply.getUserId()).orElse(null);
                                String replyUsername = replyUser != null ? replyUser.getUsername() : "Unknown User";
                                return new PostDTO(reply.getId(), reply.getContent(), reply.getUserId(), replyUsername, reply.getCreatedAt());
                            }).collect(Collectors.toList());

                    return new PostDTO(post.getId(), post.getContent(), post.getUserId(), username, post.getCreatedAt(), replies);
                })
                .collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<?> createPost(@RequestBody Post post) {
        Integer userId = post.getUserId();
        int wordCount = post.getContent().trim().isEmpty() ? 0 : post.getContent().trim().split("\\s+").length;

        if (wordCount > 1024) {
            return ResponseEntity.badRequest().body("Post content exceeds the maximum length of 1024 words.");
        }

        post.setCreatedAt(new Date());

        if (post.getParentPost() != null) {
            Integer parentPostId = post.getParentPost().getId();
            if (!postRepository.existsById(Long.valueOf(parentPostId))) {
                return ResponseEntity.badRequest().body("Parent post does not exist.");
            }
        }

        Post savedPost = postRepository.save(post);
        return ResponseEntity.ok(savedPost);
    }


    @PostMapping("/reply")
    public ResponseEntity<?> replyToPost(@RequestBody Post post, @RequestParam Long parentPostId) {
        Post parentPost = postRepository.findById(parentPostId).orElse(null);

        if (parentPost == null) {
            return ResponseEntity.badRequest().body("Parent post not found.");
        }

        post.setParentPost(parentPost);
        post.setCreatedAt(new Date());

        return ResponseEntity.ok(postRepository.save(post));
    }

}
