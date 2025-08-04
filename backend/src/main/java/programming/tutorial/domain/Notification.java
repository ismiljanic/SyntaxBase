package programming.tutorial.domain;

import jakarta.persistence.*;

import java.util.Date;

@Entity
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String userId;
    private Integer postId;
    private Integer replyId;
    @Column(length = 100000)
    private String message;
    private boolean isRead;
    private Date createdAt;
    private String replierUserEmail;
    private String parentUserEmail;

    public Notification() {
    }

    public Notification(Integer id, String userId, Integer postId, Integer replyId, String message, boolean isRead, Date createdAt, String replierUserEmail, String parentUserEmail) {
        this.id = id;
        this.userId = userId;
        this.postId = postId;
        this.replyId = replyId;
        this.message = message;
        this.isRead = isRead;
        this.createdAt = createdAt;
        this.replierUserEmail = replierUserEmail;
        this.parentUserEmail = parentUserEmail;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Integer getPostId() {
        return postId;
    }

    public void setPostId(Integer postId) {
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

    public String getReplierUserEmail() {
        return replierUserEmail;
    }

    public void setReplierUserEmail(String replierUserEmail) {
        this.replierUserEmail = replierUserEmail;
    }

    public String getParentUserEmail() {
        return parentUserEmail;
    }

    public void setParentUserEmail(String parentUserEmail) {
        this.parentUserEmail = parentUserEmail;
    }
}
