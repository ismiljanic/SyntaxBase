package programming.tutorial.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import programming.tutorial.domain.Post;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findAllByParentPost(Post parentPost);

    public List<Post> findAllByParentPostId(Long parentPostId);

}
