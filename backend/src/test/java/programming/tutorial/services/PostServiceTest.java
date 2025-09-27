package programming.tutorial.services;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import programming.tutorial.dao.NotificationRepository;
import programming.tutorial.dao.PostRepository;
import programming.tutorial.dao.UserRepository;
import programming.tutorial.domain.Post;
import programming.tutorial.domain.Role;
import programming.tutorial.domain.User;
import programming.tutorial.dto.PostDTO;
import programming.tutorial.dto.ReplyCreatedEventDTO;
import programming.tutorial.services.impl.PostServiceJpa;
import programming.tutorial.services.impl.UserNotFoundException;

import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class PostServiceTest {

    @Mock
    private PostRepository postRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private NotificationRepository notificationRepository;
    @Mock
    private ReplyEventProducer replyEventProducer;
    @InjectMocks
    private PostServiceJpa postServiceJpa;
    @Mock
    private BadgeService badgeService;

    @Test
    void getAllPosts_shouldReturnPostsWithReplies() {
        Post mainPost = new Post();
        mainPost.setId(1);
        mainPost.setContent("Main post content");
        mainPost.setUserId("auth0|123");
        mainPost.setCreatedAt(new Date(1970, 1, 1));
        mainPost.setUpdatedAt(new Date(1970, 1, 1));
        mainPost.setCategory("General");

        Post replyPost = new Post();
        replyPost.setId(2);
        replyPost.setContent("Reply content");
        replyPost.setUserId("auth0|456");
        mainPost.setCreatedAt(new Date(1980, 1, 1));
        mainPost.setUpdatedAt(new Date(1980, 1, 1));
        replyPost.setCategory("General");
        replyPost.setParentPost(mainPost);

        User mainUser = new User();
        mainUser.setAuth0UserId("auth0|123");
        mainUser.setUsername("Alice");
        mainUser.setRole(Role.ADMIN);

        User replyUser = new User();
        replyUser.setAuth0UserId("auth0|456");
        replyUser.setUsername("Bob");
        replyUser.setRole(Role.USER);

        when(postRepository.findAllByParentPostIsNullAndDeletedFalse())
                .thenReturn(List.of(mainPost));
        when(postRepository.findAllByParentPostAndDeletedFalse(mainPost))
                .thenReturn(List.of(replyPost));
        when(userRepository.findByAuth0UserId("auth0|123"))
                .thenReturn(Optional.of(mainUser));
        when(userRepository.findByAuth0UserId("auth0|456"))
                .thenReturn(Optional.of(replyUser));

        List<PostDTO> result = postServiceJpa.getAllPosts();

        assertEquals(1, result.size());
        PostDTO mainDto = result.get(0);
        assertEquals("Main post content", mainDto.getContent());
        assertEquals("Alice", mainDto.getUsername());
        assertEquals(Role.ADMIN, mainDto.getUserRole());

        assertEquals(1, mainDto.getReplies().size());
        PostDTO replyDto = mainDto.getReplies().get(0);
        assertEquals("Reply content", replyDto.getContent());
        assertEquals("Bob", replyDto.getUsername());
        assertEquals(Role.USER, replyDto.getUserRole());

        verify(postRepository).findAllByParentPostIsNullAndDeletedFalse();
        verify(postRepository).findAllByParentPostAndDeletedFalse(mainPost);
        verify(userRepository).findByAuth0UserId("auth0|123");
        verify(userRepository).findByAuth0UserId("auth0|456");
    }

    @Test
    void getAllPosts_setsUnknownUserWhenUserNotFound() {
        Post post = new Post();
        post.setId(3);
        post.setContent("Post without user");
        post.setUserId("auth0|999");
        post.setCreatedAt(new Date(1980, 1, 1));
        post.setUpdatedAt(new Date(1980, 1, 1));

        when(postRepository.findAllByParentPostIsNullAndDeletedFalse())
                .thenReturn(List.of(post));
        when(postRepository.findAllByParentPostAndDeletedFalse(post))
                .thenReturn(List.of());
        when(userRepository.findByAuth0UserId("auth0|999"))
                .thenReturn(Optional.empty());

        List<PostDTO> result = postServiceJpa.getAllPosts();

        assertEquals(1, result.size());
        PostDTO dto = result.get(0);
        assertEquals("Unknown User", dto.getUsername());
        assertEquals(Role.USER, dto.getUserRole());
    }

    @Test
    void createPost_throwsWhenContentExceedsWordLimit() {
        String tooLong = String.join(" ", Collections.nCopies(1025, "word"));
        Post post = new Post();
        post.setContent(tooLong);

        RuntimeException exception = assertThrows(RuntimeException.class, () ->
                postServiceJpa.createPost(post));

        assertEquals("Post content exceeds the maximum length of 1024 words.", exception.getMessage());
        verifyNoInteractions(postRepository);
    }

    @Test
    void createPost_replyThrowsWhenParentNotFound() {
        Post reply = new Post();
        reply.setContent("Reply content");
        reply.setUserId("auth0|child");

        Post parentPost = new Post();
        parentPost.setId(99);
        reply.setParentPost(parentPost);

        Post savedReply = new Post();
        savedReply.setId(200);
        savedReply.setContent("Reply content");
        savedReply.setUserId("auth0|child");
        savedReply.setParentPost(parentPost);

        when(postRepository.save(any(Post.class))).thenReturn(savedReply);
        when(postRepository.findById(99)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> postServiceJpa.createPost(reply));
    }

    @Test
    void createPost_replyThrowsWhenUserNotFound() {
        Post parentPost = new Post();
        parentPost.setId(100);
        parentPost.setUserId("auth0|parent");

        Post reply = new Post();
        reply.setContent("Reply content");
        reply.setUserId("auth0|child");
        reply.setParentPost(parentPost);

        Post savedReply = new Post();
        savedReply.setId(200);
        savedReply.setUserId("auth0|child");
        savedReply.setContent("Reply content");
        savedReply.setParentPost(parentPost);

        when(postRepository.save(any(Post.class))).thenReturn(savedReply);
        when(postRepository.findById(100)).thenReturn(Optional.of(parentPost));
        when(userRepository.findByAuth0UserId("auth0|child")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> postServiceJpa.createPost(reply));
    }

    @Test
    void createPost_savesNormalPostSuccessfully() {
        Post post = new Post();
        post.setContent("Content");
        post.setUserId("auth0UserId");

        Post savedPost = new Post();
        savedPost.setId(1);
        savedPost.setContent("Content");
        savedPost.setUserId("auth0UserId");
        savedPost.setCreatedAt(new Date());

        when(postRepository.save(any(Post.class))).thenReturn(savedPost);

        Post result = postServiceJpa.createPost(post);

        assertNotNull(result);
        assertEquals(1, result.getId());
        assertEquals("Content", result.getContent());
        verify(postRepository).save(post);
        verifyNoInteractions(replyEventProducer);
        verify(badgeService).awardForumActivityBadge(eq("auth0UserId"), anyInt());
    }

    @Test
    void createPost_replyPostPublishesEvent() {
        Post parentPost = new Post();
        parentPost.setId(100);
        parentPost.setContent("Parent content");
        parentPost.setUserId("auth0|parent");

        Post reply = new Post();
        reply.setContent("Reply content");
        reply.setUserId("auth0|child");
        reply.setParentPost(parentPost);

        Post savedReply = new Post();
        savedReply.setId(200);
        savedReply.setContent("Reply content");
        savedReply.setUserId("auth0|child");
        savedReply.setParentPost(parentPost);

        User replyingUser = new User();
        replyingUser.setAuth0UserId("auth0|child");
        replyingUser.setUsername("child@example.com");

        User parentUser = new User();
        parentUser.setAuth0UserId("auth0|parent");
        parentUser.setUsername("parent@example.com");

        when(postRepository.save(any(Post.class))).thenReturn(savedReply);
        when(postRepository.findById(100)).thenReturn(Optional.of(parentPost));
        when(userRepository.findByAuth0UserId("auth0|child")).thenReturn(Optional.of(replyingUser));
        when(userRepository.findByAuth0UserId("auth0|parent")).thenReturn(Optional.of(parentUser));

        Post result = postServiceJpa.createPost(reply);

        assertNotNull(result);
        assertEquals(200, result.getId());
        verify(replyEventProducer).publishReplyCreatedEvent(any(ReplyCreatedEventDTO.class));
        verify(badgeService).awardForumActivityBadge(eq("auth0|child"), anyInt());
    }

    @Test
    void deletePost_throwsExceptionWhenPostNotFound() {
        when(postRepository.findById(1)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () ->
                postServiceJpa.deletePost(1, "auth0Id"));
    }

    @Test
    void deletePost_throwsExceptionWhenUserNotFound() {
        Post post = new Post();
        post.setId(1);
        post.setContent("Content");
        post.setUserId("auth0Id");

        when(postRepository.findById(post.getId())).thenReturn(Optional.of(post));
        when(userRepository.findByAuth0UserId(post.getUserId())).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () ->
                postServiceJpa.deletePost(1, "auth0Id"));
    }

    @Test
    void deletePost_throwsWhenPermissionDenied() {
        Post post = new Post();
        post.setId(1);
        post.setUserId("auth0|owner");

        User user = new User();
        user.setAuth0UserId("auth0|other");
        user.setRole(Role.USER);

        when(postRepository.findById(1)).thenReturn(Optional.of(post));
        when(userRepository.findByAuth0UserId("auth0|other")).thenReturn(Optional.of(user));

        assertThrows(SecurityException.class, () ->
                postServiceJpa.deletePost(1, "auth0|other"));

        user.setRole(Role.INSTRUCTOR);
        System.out.println("Test with INSTRUCTOR role");
        assertThrows(SecurityException.class, () ->
                postServiceJpa.deletePost(1, "auth0|other"));
        System.out.println("Passed");
    }

    @Test
    void deletePost_ownerDeletesPostAndReplies() {
        Post post = new Post();
        post.setId(1);
        post.setUserId("auth0|owner");

        User owner = new User();
        owner.setAuth0UserId("auth0|owner");
        owner.setRole(Role.USER);

        Post reply1 = new Post();
        reply1.setId(2);
        reply1.setParentPost(post);

        Post reply2 = new Post();
        reply2.setId(3);
        reply2.setParentPost(post);

        List<Post> replies = List.of(reply1, reply2);

        when(postRepository.findById(1)).thenReturn(Optional.of(post));
        when(userRepository.findByAuth0UserId("auth0|owner")).thenReturn(Optional.of(owner));
        when(postRepository.findAllByParentPost(post)).thenReturn(replies);

        postServiceJpa.deletePost(1, "auth0|owner");

        assertTrue(post.isDeleted());
        assertTrue(reply1.isDeleted());
        assertTrue(reply2.isDeleted());
        verify(postRepository).save(post);
        verify(postRepository).saveAll(replies);
    }

    @Test
    void deletePost_adminDeletesOthersPostAndReplies() {
        Post post = new Post();
        post.setId(1);
        post.setUserId("auth0|owner");

        User admin = new User();
        admin.setAuth0UserId("auth0|admin");
        admin.setRole(Role.ADMIN);

        Post reply = new Post();
        reply.setId(2);
        reply.setParentPost(post);

        when(postRepository.findById(1)).thenReturn(Optional.of(post));
        when(userRepository.findByAuth0UserId("auth0|admin")).thenReturn(Optional.of(admin));
        when(postRepository.findAllByParentPost(post)).thenReturn(List.of(reply));

        postServiceJpa.deletePost(1, "auth0|admin");

        assertTrue(post.isDeleted());
        assertTrue(reply.isDeleted());
        verify(postRepository).save(post);
        verify(postRepository).saveAll(List.of(reply));
    }

    @Test
    void getPost_throwsWhenNotFound() {
        when(postRepository.findById(1)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class,
                () -> postServiceJpa.getPost(1));
    }

    @Test
    void getPost_returnsPostWithUserDetails() {
        Post post = new Post();
        post.setId(1);
        post.setContent("Main post");
        post.setUserId("auth0|user");

        User user = new User();
        user.setAuth0UserId("auth0|user");
        user.setUsername("JohnDoe");
        user.setRole(Role.USER);

        when(postRepository.findById(1)).thenReturn(Optional.of(post));
        when(userRepository.findByAuth0UserId("auth0|user")).thenReturn(Optional.of(user));
        when(postRepository.findAllByParentPost(post)).thenReturn(Collections.emptyList());

        PostDTO dto = postServiceJpa.getPost(1);

        assertEquals(1, dto.getId());
        assertEquals("Main post", dto.getContent());
        assertEquals("JohnDoe", dto.getUsername());
        assertEquals(Role.USER, dto.getUserRole());
        assertTrue(dto.getReplies().isEmpty());
    }

    @Test
    void getPost_returnsPostWithUnknownUserWhenUserMissing() {
        Post post = new Post();
        post.setId(1);
        post.setContent("Main post");
        post.setUserId("auth0|missing");

        when(postRepository.findById(1)).thenReturn(Optional.of(post));
        when(userRepository.findByAuth0UserId("auth0|missing")).thenReturn(Optional.empty());
        when(postRepository.findAllByParentPost(post)).thenReturn(Collections.emptyList());

        PostDTO dto = postServiceJpa.getPost(1);

        assertEquals("Unknown User", dto.getUsername());
        assertEquals(Role.USER, dto.getUserRole());
    }

    @Test
    void getPost_includesRepliesWithUserAndFallback() {
        Post post = new Post();
        post.setId(1);
        post.setContent("Main post");
        post.setUserId("auth0|parent");

        User parentUser = new User();
        parentUser.setAuth0UserId("auth0|parent");
        parentUser.setUsername("ParentUser");
        parentUser.setRole(Role.ADMIN);

        Post reply1 = new Post();
        reply1.setId(2);
        reply1.setContent("Reply one");
        reply1.setUserId("auth0|reply1");

        User reply1User = new User();
        reply1User.setAuth0UserId("auth0|reply1");
        reply1User.setUsername("ReplyUser1");
        reply1User.setRole(Role.USER);

        Post reply2 = new Post();
        reply2.setId(3);
        reply2.setContent("Reply two");
        reply2.setUserId("auth0|missing");

        List<Post> replies = List.of(reply1, reply2);

        when(postRepository.findById(1)).thenReturn(Optional.of(post));
        when(userRepository.findByAuth0UserId("auth0|parent")).thenReturn(Optional.of(parentUser));
        when(postRepository.findAllByParentPost(post)).thenReturn(replies);
        when(userRepository.findByAuth0UserId("auth0|reply1")).thenReturn(Optional.of(reply1User));
        when(userRepository.findByAuth0UserId("auth0|missing")).thenReturn(Optional.empty());

        PostDTO dto = postServiceJpa.getPost(1);

        assertEquals("ParentUser", dto.getUsername());
        assertEquals(Role.ADMIN, dto.getUserRole());

        assertEquals(2, dto.getReplies().size());

        PostDTO r1 = dto.getReplies().get(0);
        assertEquals("ReplyUser1", r1.getUsername());
        assertEquals(Role.USER, r1.getUserRole());

        PostDTO r2 = dto.getReplies().get(1);
        assertEquals("Unknown User", r2.getUsername());
        assertEquals(Role.USER, r2.getUserRole());
    }

    @Test
    void softDeletePost_marksAsDeleted_whenNotAlreadyDeleted() {
        Post post = new Post();
        post.setId(1);
        post.setDeleted(false);

        when(postRepository.findById(1)).thenReturn(Optional.of(post));

        postServiceJpa.softDeletePost(1);

        assertTrue(post.isDeleted());
        verify(postRepository).save(post);
    }

    @Test
    void softDeletePost_doesNothing_whenAlreadyDeleted() {
        Post post = new Post();
        post.setId(1);
        post.setDeleted(true);

        when(postRepository.findById(1)).thenReturn(Optional.of(post));

        postServiceJpa.softDeletePost(1);

        verify(postRepository, never()).save(post);
    }

    @Test
    void softDeletePost_throwsWhenPostNotFound() {
        when(postRepository.findById(99)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> postServiceJpa.softDeletePost(99));
    }

    @Test
    void restorePost_marksAsNotDeleted_whenDeleted() {
        Post post = new Post();
        post.setId(1);
        post.setDeleted(true);

        when(postRepository.findById(1)).thenReturn(Optional.of(post));

        postServiceJpa.restorePost(1);

        assertFalse(post.isDeleted());
        verify(postRepository).save(post);
    }

    @Test
    void restorePost_doesNothing_whenNotDeleted() {
        Post post = new Post();
        post.setId(1);
        post.setDeleted(false);

        when(postRepository.findById(1)).thenReturn(Optional.of(post));

        postServiceJpa.restorePost(1);

        verify(postRepository, never()).save(post);
    }

    @Test
    void restorePost_throwsWhenPostNotFound() {
        when(postRepository.findById(77)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> postServiceJpa.restorePost(77));
    }

    @Test
    void updatePost_updatesContentAndTimestamp_whenUserAuthorized() {
        Post post = new Post();
        post.setId(1);
        post.setUserId("auth0|123");
        post.setContent("Old content");

        PostDTO dto = new PostDTO();
        dto.setContent("New content");

        when(postRepository.findById(1)).thenReturn(Optional.of(post));

        postServiceJpa.updatePost(1, dto, "auth0|123");

        assertEquals("New content", post.getContent());
        assertNotNull(post.getUpdatedAt());
        verify(postRepository).save(post);
    }

    @Test
    void updatePost_throwsSecurityException_whenUserNotAuthorized() {
        Post post = new Post();
        post.setId(1);
        post.setUserId("auth0|123");

        PostDTO dto = new PostDTO();
        dto.setContent("New content");

        when(postRepository.findById(1)).thenReturn(Optional.of(post));

        assertThrows(SecurityException.class,
                () -> postServiceJpa.updatePost(1, dto, "auth0|different"));
    }

    @Test
    void updatePost_throwsWhenPostNotFound() {
        PostDTO dto = new PostDTO();
        dto.setContent("Doesn’t matter");

        when(postRepository.findById(42)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class,
                () -> postServiceJpa.updatePost(42, dto, "auth0|user"));
    }
}
