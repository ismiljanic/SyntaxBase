package programming.tutorial.services;

import programming.tutorial.domain.Post;
import programming.tutorial.dto.PostDTO;
import java.util.List;

public interface PostService {
    List<PostDTO> getAllPosts();
    Post createPost(Post post);
    void deletePost(Integer id, String requesterAuth0Id);
    PostDTO getPost(Integer postId);
}
