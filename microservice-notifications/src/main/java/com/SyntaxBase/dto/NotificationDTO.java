package com.SyntaxBase.dto;

import com.SyntaxBase.domain.Notification;

import java.util.Date;

public class NotificationDTO {
    private Integer id;

    private String userId;
    private Integer postId;
    private Integer replyId;
    private String message;
    private boolean isRead;
    private Date createdAt;

    String username;

    public NotificationDTO() {
    }

    public NotificationDTO(Integer id, String userId, Integer postId, Integer replyId, String message, boolean isRead, Date createdAt) {
        this.id = id;
        this.userId = userId;
        this.postId = postId;
        this.replyId = replyId;
        this.message = message;
        this.isRead = isRead;
        this.createdAt = createdAt;
    }

    public NotificationDTO(Integer id, String userId, Integer postId, Integer replyId, String message, boolean isRead, Date createdAt, String username) {
        this.id = id;
        this.userId = userId;
        this.postId = postId;
        this.replyId = replyId;
        this.message = message;
        this.isRead = isRead;
        this.createdAt = createdAt;
        this.username = username;
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

    public static NotificationDTO fromEntity(Notification notification) {
        NotificationDTO dto = new NotificationDTO();
        dto.setId(notification.getId());
        dto.setMessage(notification.getMessage());
        dto.setUserId(notification.getUserId());
        dto.setPostId(notification.getPostId());
        dto.setReplyId(notification.getReplyId());
        dto.setRead(notification.isRead());
        dto.setCreatedAt(notification.getCreatedAt());
        return dto;
    }
}