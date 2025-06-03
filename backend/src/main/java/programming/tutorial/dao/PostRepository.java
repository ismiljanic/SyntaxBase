package programming.tutorial.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import programming.tutorial.domain.Post;

import java.util.Arrays;
import java.util.List;
@Repository
public interface PostRepository extends JpaRepository<Post, Integer> {
    List<Post> findAllByParentPost(Post parentPost);

    public List<Post> findAllByParentPostId(Long parentPostId);

    List<Post> findAllByParentPostIsNull();

    List<Post> findByUserId(String userId);

    List<Post> findDeletedPostsByUserId(String userId);
    List<Post> findByUserIdAndDeletedFalse(String userId);

    List<Post> findByUserIdAndDeletedTrue(String userId);

}
