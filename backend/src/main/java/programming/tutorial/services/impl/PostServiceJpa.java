package programming.tutorial.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import programming.tutorial.dao.NotificationRepository;
import programming.tutorial.dao.PostRepository;
import programming.tutorial.dao.UserRepository;
import programming.tutorial.domain.Badge;
import programming.tutorial.domain.Post;
import programming.tutorial.domain.Role;
import programming.tutorial.domain.User;
import programming.tutorial.dto.PostDTO;
import programming.tutorial.dto.ReplyCreatedEventDTO;
import programming.tutorial.services.BadgeService;
import programming.tutorial.services.PostService;
import programming.tutorial.services.ReplyEventProducer;

import java.time.LocalDateTime;
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
    private NotificationRepository notificationRepository;
    @Autowired
    private ReplyEventProducer replyEventProducer;
    @Autowired
    private BadgeService badgeService;

    @Override
    public List<PostDTO> getAllPosts() {
        return postRepository.findAllByParentPostIsNullAndDeletedFalse()
                .stream()
                .map(post -> {
                    User user = userRepository.findByAuth0UserId(post.getUserId()).orElse(null);
                    String username = user != null ? user.getUsername() : "Unknown User";
                    Role userRole = user != null ? user.getRole() : Role.USER;
                    LocalDateTime userAccountDateCreatedAt = user != null ? user.getDateCreated() : LocalDateTime.now();

                    List<PostDTO> replies = postRepository.findAllByParentPostAndDeletedFalse(post).stream()
                            .map(reply -> {
                                User replyUser = userRepository.findByAuth0UserId(reply.getUserId()).orElse(null);
                                String replyUsername = replyUser != null ? replyUser.getUsername() : "Unknown User";
                                LocalDateTime replyUserDateCreated = replyUser != null ? replyUser.getDateCreated() : LocalDateTime.now();
                                Role replyUserRole = replyUser != null ? replyUser.getRole() : Role.USER;
                                return new PostDTO(
                                        reply.getId(),
                                        reply.getContent(),
                                        reply.getUserId(),
                                        replyUsername,
                                        reply.getCreatedAt(),
                                        null,
                                        reply.getCategory(),
                                        replyUserRole,
                                        reply.getUpdatedAt(),
                                        replyUserDateCreated
                                );
                            }).collect(Collectors.toList());

                    return new PostDTO(
                            post.getId(),
                            post.getContent(),
                            post.getUserId(),
                            username,
                            post.getCreatedAt(),
                            replies,
                            post.getCategory(),
                            userRole,
                            post.getUpdatedAt(),
                            userAccountDateCreatedAt
                    );
                })
                .collect(Collectors.toList());
    }

    @Override
    public Post createPost(Post post) {
        System.out.println("Creating post: " + post);

        int wordCount = post.getContent().trim().isEmpty() ? 0 : post.getContent().trim().split("\\s+").length;
        System.out.println("Word count: " + wordCount);

        if (wordCount > 1024) {
            System.out.println("Post content too long");
            throw new RuntimeException("Post content exceeds the maximum length of 1024 words.");
        }

        post.setCreatedAt(new Date());
        Post savedPost = postRepository.save(post);
        System.out.println("Post saved with ID: " + savedPost.getId());

        if (post.getParentPost() != null && post.getParentPost().getId() != null) {
            System.out.println("Post is a reply to post ID: " + post.getParentPost().getId());

            Post parentPost = postRepository.findById(post.getParentPost().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Parent post not found."));
            System.out.println("Parent post found: " + parentPost);

            User replyingUser = userRepository.findByAuth0UserId(savedPost.getUserId())
                    .orElseThrow(() -> new RuntimeException("Replying user not found"));

            User parentUser = userRepository.findByAuth0UserId(parentPost.getUserId())
                    .orElseThrow(() -> new RuntimeException("Parent user not found"));

            ReplyCreatedEventDTO event = new ReplyCreatedEventDTO();
            event.setPostId(Long.valueOf(parentPost.getId()));
            event.setParentUserId(parentPost.getUserId());
            event.setReplyId(Long.valueOf(savedPost.getId()));
            event.setReplyUserId(savedPost.getUserId());
            event.setReplyContent(savedPost.getContent());
            event.setReplierUserEmail(replyingUser.getUsername());
            event.setParentUserEmail(parentUser.getUsername());
            System.out.println("Publishing reply created event: " + event);
            replyEventProducer.publishReplyCreatedEvent(event);
        }

        int postsCount = postRepository.countByUserId(post.getUserId());

        badgeService.awardForumActivityBadge(post.getUserId(), postsCount);

        return savedPost;
    }

    @Override
    public void deletePost(Integer postId, String userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));

        User user = userRepository.findByAuth0UserId(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found."));

        if (!post.getUserId().equals(userId) && user.getRole() != Role.ADMIN) {
            throw new SecurityException("Permission denied.");
        }

        post.setDeleted(true);
        postRepository.save(post);

        List<Post> replies = postRepository.findAllByParentPost(post);
        for (Post reply : replies) {
            reply.setDeleted(true);
        }
        postRepository.saveAll(replies);
    }


    @Override
    public PostDTO getPost(Integer postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found."));
        User user = userRepository.findByAuth0UserId(post.getUserId()).orElse(null);
        String username = user != null ? user.getUsername() : "Unknown User";
        Role userRole = user != null ? user.getRole() : Role.USER;
        LocalDateTime userAccountDateCreatedAt = user != null ? user.getDateCreated() : LocalDateTime.now();

        List<PostDTO> replies = postRepository.findAllByParentPost(post).stream()
                .map(reply -> {
                    User replyUser = userRepository.findByAuth0UserId(reply.getUserId()).orElse(null);
                    String replyUsername = replyUser != null ? replyUser.getUsername() : "Unknown User";
                    LocalDateTime replyUserDateCreated = replyUser != null ? replyUser.getDateCreated() : LocalDateTime.now();
                    Role replyUserRole = replyUser != null ? replyUser.getRole() : Role.USER;
                    return new PostDTO(
                            reply.getId(),
                            reply.getContent(),
                            reply.getUserId(),
                            replyUsername,
                            reply.getCreatedAt(),
                            null,
                            reply.getCategory(),
                            replyUserRole,
                            reply.getUpdatedAt(),
                            replyUserDateCreated
                    );
                }).collect(Collectors.toList());

        return new PostDTO(
                post.getId(),
                post.getContent(),
                post.getUserId(),
                username,
                post.getCreatedAt(),
                replies,
                post.getCategory(),
                userRole,
                post.getUpdatedAt(),
                userAccountDateCreatedAt
        );
    }

    @Override
    public void softDeletePost(Integer postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));

        if (!post.isDeleted()) {
            post.setDeleted(true);
            postRepository.save(post);
        }
        System.out.println("Soft deleting post: " + postId);
    }

    @Override
    public void restorePost(Integer postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));

        if (post.isDeleted()) {
            post.setDeleted(false);
            postRepository.save(post);
        }
    }

    @Override
    public void updatePost(Integer id, PostDTO postDTO, String authenticatedUserId) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));

        if (!post.getUserId().equals(authenticatedUserId)) {
            throw new SecurityException("You are not authorized to edit this post");
        }

        post.setContent(postDTO.getContent());
        post.setUpdatedAt(new Date());
        postRepository.save(post);
    }


    private String getUsername(String userId) {
        return userRepository.findByAuth0UserId(userId)
                .map(User::getUsername).orElse("Unknown User");
    }
}