package programming.tutorial.dto;

import java.util.Date;
import java.util.List;

public class PostDTO {
    private Integer id;
    private String content;
    private Integer userId;
    private String username;
    private Date createdAt;
    private List<PostDTO> replies;
    private String category;

    public PostDTO(Integer id, String content, Integer userId, String username, Date createdAt, List<PostDTO> replies) {
        this.id = id;
        this.content = content;
        this.userId = userId;
        this.username = username;
        this.createdAt = createdAt;
        this.replies = replies;
    }

    public PostDTO(Integer id, String content, Integer userId, String username, Date createdAt) {
        this.id = id;
        this.content = content;
        this.userId = userId;
        this.username = username;
        this.createdAt = createdAt;
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

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
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
}