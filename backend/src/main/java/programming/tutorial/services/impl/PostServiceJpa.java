package programming.tutorial.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import programming.tutorial.dao.PostRepository;
import programming.tutorial.dao.UserRepository;
import programming.tutorial.domain.Post;
import programming.tutorial.domain.Role;
import programming.tutorial.domain.User;
import programming.tutorial.dto.PostDTO;
import programming.tutorial.services.NotificationService;
import programming.tutorial.services.PostService;
import org.springframework.security.oauth2.jwt.Jwt;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PostServiceJpa implements PostService {

    @Autowired
    private PostRepository postRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private NotificationService notificationService;

    @Override
    public List<PostDTO> getAllPosts() {
        return postRepository.findAllByParentPostIsNull().stream()
                .map(post -> {
                    User user = userRepository.findByAuth0UserId(post.getUserId()).orElse(null);
                    String username = user != null ? user.getUsername() : "Unknown User";

                    List<PostDTO> replies = postRepository.findAllByParentPost(post).stream()
                            .map(reply -> {
                                User replyUser = userRepository.findByAuth0UserId(reply.getUserId()).orElse(null);
                                String replyUsername = replyUser != null ? replyUser.getUsername() : "Unknown User";
                                return new PostDTO(reply.getId(), reply.getContent(), reply.getUserId(), replyUsername, reply.getCreatedAt(), null);
                            }).collect(Collectors.toList());

                    return new PostDTO(post.getId(), post.getContent(), post.getUserId(), username, post.getCreatedAt(), replies);
                })
                .collect(Collectors.toList());
    }

    @Override
    public Post createPost(Post post) {
        int wordCount = post.getContent().trim().isEmpty() ? 0 : post.getContent().trim().split("\\s+").length;

        if (wordCount > 1024) {
            throw new RuntimeException("Post content exceeds the maximum length of 1024 words.");
        }

        post.setCreatedAt(new Date());
        Post savedPost = postRepository.save(post);
        if (post.getParentPost() != null && post.getParentPost().getId() != null) {
            Post parentPost = postRepository.findById(post.getParentPost().getId()).orElse(null);
            if (parentPost == null) {
                throw new RuntimeException("Parent post does not exist.");
            }

            if (post.getParentPost() != null && post.getParentPost().getId() != null) {
                parentPost = postRepository.findById(post.getParentPost().getId())
                        .orElseThrow(() -> new IllegalArgumentException("Parent post not found."));
                notificationService.createReplyNotification(parentPost, savedPost);
            }
        }
        return savedPost;
    }

    @Override
    public void deletePost(Integer id, String requesterAuth0Id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post not found."));

        User user = userRepository.findByAuth0UserId(requesterAuth0Id)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        if (!post.getUserId().equals(requesterAuth0Id) && user.getRole() != Role.ADMIN) {
            throw new SecurityException("Permission denied.");
        }

        postRepository.delete(post);
    }

    @Override
    public PostDTO getPost(Integer postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found."));
        String username = getUsername(post.getUserId());

        List<PostDTO> replies = postRepository.findAllByParentPost(post).stream()
                .map(reply -> new PostDTO(
                        reply.getId(), reply.getContent(),
                        reply.getUserId(), getUsername(reply.getUserId()),
                        reply.getCreatedAt(), null))
                .collect(Collectors.toList());

        return new PostDTO(post.getId(), post.getContent(), post.getUserId(), username, post.getCreatedAt(), replies);
    }

    private String getUsername(String userId) {
        return userRepository.findByAuth0UserId(userId)
                .map(User::getUsername).orElse("Unknown User");
    }
}