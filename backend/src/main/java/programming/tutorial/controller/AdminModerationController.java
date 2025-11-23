package programming.tutorial.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import programming.tutorial.dto.PostDTO;
import programming.tutorial.services.PostService;

import java.util.List;

@RestController
@RequestMapping("/api/admin/moderation")
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AdminModerationController {

    @Autowired
    private final PostService postService;

    public AdminModerationController(PostService postService) {
        this.postService = postService;
    }

    @GetMapping("/posts")
    public ResponseEntity<List<PostDTO>> getModeratedPosts() {
        return ResponseEntity.ok(postService.getAllModeratedPosts());
    }

}
