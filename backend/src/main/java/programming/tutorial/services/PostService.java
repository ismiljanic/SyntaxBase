package programming.tutorial.services;

import org.springframework.stereotype.Service;
import programming.tutorial.domain.Post;
import programming.tutorial.dto.PostDTO;
import java.util.List;
@Service
public interface PostService {
    List<PostDTO> getAllPosts();
    Post createPost(Post post);
    void deletePost(Integer id, String requesterAuth0Id);
    PostDTO getPost(Integer postId);

    void softDeletePost(Integer postId);

    void restorePost(Integer postId);

    void updatePost(Integer id, PostDTO postDTO, String authenticatedUserId);
}
