package programming.tutorial.dao;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.test.context.ActiveProfiles;
import programming.tutorial.domain.Post;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = Replace.ANY)
@ActiveProfiles("test")
class PostRepositoryTest {

    @Autowired
    private PostRepository postRepository;

    private Post parentPost;
    private Post childPost1;
    private Post childPost2;
    private Post deletedPost;

    @BeforeEach
    void setup() {
        parentPost = new Post();
        parentPost.setUserId("user1");
        parentPost.setDeleted(false);
        postRepository.save(parentPost);

        childPost1 = new Post();
        childPost1.setUserId("user1");
        childPost1.setParentPost(parentPost);
        childPost1.setDeleted(false);
        postRepository.save(childPost1);

        childPost2 = new Post();
        childPost2.setUserId("user2");
        childPost2.setParentPost(parentPost);
        childPost2.setDeleted(false);
        postRepository.save(childPost2);

        deletedPost = new Post();
        deletedPost.setUserId("user1");
        deletedPost.setDeleted(true);
        postRepository.save(deletedPost);
    }

    @Test
    void testFindAllByParentPost() {
        List<Post> children = postRepository.findAllByParentPost(parentPost);
        assertThat(children).containsExactlyInAnyOrder(childPost1, childPost2);
    }

    @Test
    void testFindAllByParentPostId() {
        List<Post> children = postRepository.findAllByParentPostId(parentPost.getId().longValue());
        assertThat(children).containsExactlyInAnyOrder(childPost1, childPost2);
    }

    @Test
    void testFindAllByParentPostIsNull() {
        List<Post> topLevel = postRepository.findAllByParentPostIsNull();
        assertThat(topLevel).contains(parentPost);
        assertThat(topLevel).doesNotContain(childPost1, childPost2);
    }

    @Test
    void testFindByUserId() {
        List<Post> userPosts = postRepository.findByUserId("user1");
        assertThat(userPosts).containsExactlyInAnyOrder(parentPost, childPost1, deletedPost);
    }

    @Test
    void testFindDeletedPostsByUserId() {
        List<Post> deleted = postRepository.findDeletedPostsByUserId("user1");
        assertThat(deleted).contains(deletedPost);
    }

    @Test
    void testFindByUserIdAndDeletedFalse() {
        List<Post> activePosts = postRepository.findByUserIdAndDeletedFalse("user1");
        assertThat(activePosts).containsExactlyInAnyOrder(parentPost, childPost1);
    }

    @Test
    void testFindByUserIdAndDeletedTrue() {
        List<Post> deletedPosts = postRepository.findByUserIdAndDeletedTrue("user1");
        assertThat(deletedPosts).contains(deletedPost);
    }

    @Test
    void testFindAllByParentPostIsNullAndDeletedFalse() {
        List<Post> topLevelActive = postRepository.findAllByParentPostIsNullAndDeletedFalse();
        assertThat(topLevelActive).containsExactly(parentPost);
        assertThat(topLevelActive).doesNotContain(deletedPost);
    }

    @Test
    void testFindAllByParentPostAndDeletedFalse() {
        List<Post> childrenActive = postRepository.findAllByParentPostAndDeletedFalse(parentPost);
        assertThat(childrenActive).containsExactlyInAnyOrder(childPost1, childPost2);
        assertThat(childrenActive).doesNotContain(deletedPost);
    }
}