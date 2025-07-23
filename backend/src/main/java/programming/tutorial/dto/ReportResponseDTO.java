package programming.tutorial.dto;

import java.time.LocalDateTime;

public class ReportResponseDTO {

    private Integer id;
    private Integer postId;
    private String postContent;
    private String postUserId;
    private Integer parentPostId;
    private String reporterId;
    private String reason;
    private LocalDateTime createdAt;

    public ReportResponseDTO(Integer id, Integer postId, String postContent, String postUserId, Integer parentPostId, String reporterId, String reason, LocalDateTime createdAt) {
        this.id = id;
        this.postId = postId;
        this.postContent = postContent;
        this.postUserId = postUserId;
        this.parentPostId = parentPostId;
        this.reporterId = reporterId;
        this.reason = reason;
        this.createdAt = createdAt;
    }

    public ReportResponseDTO() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getPostId() {
        return postId;
    }

    public void setPostId(Integer postId) {
        this.postId = postId;
    }

    public String getPostContent() {
        return postContent;
    }

    public void setPostContent(String postContent) {
        this.postContent = postContent;
    }

    public String getReporterId() {
        return reporterId;
    }

    public void setReporterId(String reporterId) {
        this.reporterId = reporterId;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getPostUserId() {
        return postUserId;
    }

    public void setPostUserId(String postUserId) {
        this.postUserId = postUserId;
    }

    public Integer getParentPostId() {
        return parentPostId;
    }

    public void setParentPostId(Integer parentPostId) {
        this.parentPostId = parentPostId;
    }
}
