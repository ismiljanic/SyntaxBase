package programming.tutorial.dto;

import programming.tutorial.domain.Post;
import programming.tutorial.domain.Role;

import java.util.*;

public class PostDTO {
    private Integer id;
    private String content;
    private String userId;
    private String username;
    private Date createdAt;
    private Date updatedAt;
    private List<PostDTO> replies;
    private String category;
    private Role userRole;
    private boolean deleted;
    private PostDTO parentPost;

    public PostDTO() {
    }

    public PostDTO(Integer id, String content, String userId, String username, Date createdAt, List<PostDTO> replies, String category, Role userRole, Date updatedAt) {
        this.id = id;
        this.content = content;
        this.userId = userId;
        this.username = username;
        this.createdAt = createdAt;
        this.replies = replies;
        this.category = category;
        this.userRole = userRole;
        this.updatedAt = updatedAt;
    }

    public PostDTO(Integer id, String content, String userId, String username, Date createdAt, boolean deleted) {
        this.id = id;
        this.content = content;
        this.userId = userId;
        this.username = username;
        this.createdAt = createdAt;
        this.deleted = deleted;
    }

    public PostDTO(Integer id, String content, String userId, Date createdAt, List<PostDTO> repliesDto, String category, Date updatedAt) {
        this.id = id;
        this.content = content;
        this.userId = userId;
        this.createdAt = createdAt;
        this.replies = repliesDto;
        this.category = category;
        this.updatedAt = updatedAt;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public List<PostDTO> getReplies() {
        return replies;
    }

    public void setReplies(List<PostDTO> replies) {
        this.replies = replies;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public boolean isDeleted() {
        return deleted;
    }

    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }

    public Role getUserRole() {
        return userRole;
    }

    public void setUserRole(Role userRole) {
        this.userRole = userRole;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }

    public PostDTO getParentPost() {
        return parentPost;
    }

    public void setParentPost(PostDTO parentPost) {
        this.parentPost = parentPost;
    }
}