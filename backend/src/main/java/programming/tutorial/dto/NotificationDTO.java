package programming.tutorial.dto;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import org.springframework.data.annotation.Id;

import java.util.Date;

public class NotificationDTO {
    private Long id;

    private String userId;
    private Long postId;
    private Integer replyId;
    private String message;
    private boolean isRead;
    private Date createdAt;
    String username;
    private String replierUsername;
    private String parentUserEmail;

    public NotificationDTO() {
    }

    public NotificationDTO(Long id, String userId, Long postId, Integer replyId, String message, boolean isRead, Date createdAt) {
        this.id = id;
        this.userId = userId;
        this.postId = postId;
        this.replyId = replyId;
        this.message = message;
        this.isRead = isRead;
        this.createdAt = createdAt;
    }

    public NotificationDTO(long id, String userId, long postId, Integer replyId, String message, boolean isRead, Date createdAt, String username) {
        this.id = id;
        this.userId = userId;
        this.postId = postId;
        this.replyId = replyId;
        this.message = message;
        this.isRead = isRead;
        this.createdAt = createdAt;
        this.username = username;
    }

    public NotificationDTO(long id, String userId, long postId, Integer replyId, String message, boolean isRead, Date createdAt, String username, String replierUsername, String parentUserEmail) {
        this.id = id;
        this.userId = userId;
        this.postId = postId;
        this.replyId = replyId;
        this.message = message;
        this.isRead = isRead;
        this.createdAt = createdAt;
        this.username = username;
        this.replierUsername = replierUsername;
        this.parentUserEmail = parentUserEmail;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Long getPostId() {
        return postId;
    }

    public void setPostId(Long postId) {
        this.postId = postId;
    }

    public Integer getReplyId() {
        return replyId;
    }

    public void setReplyId(Integer replyId) {
        this.replyId = replyId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isRead() {
        return isRead;
    }

    public void setRead(boolean read) {
        isRead = read;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getReplierUsername() {
        return replierUsername;
    }

    public void setReplierUsername(String replierUsername) {
        this.replierUsername = replierUsername;
    }

    public String getParentUserEmail() {
        return parentUserEmail;
    }

    public void setParentUserEmail(String parentUserEmail) {
        this.parentUserEmail = parentUserEmail;
    }
}
