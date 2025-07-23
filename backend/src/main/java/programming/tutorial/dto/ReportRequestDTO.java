package programming.tutorial.dto;

public class ReportRequestDTO {

    private Integer postId;
    private String reporterId;
    private String reason;

    public ReportRequestDTO(Integer postId, String reporterId, String reason) {
        this.postId = postId;
        this.reporterId = reporterId;
        this.reason = reason;
    }

    public ReportRequestDTO() {
    }

    public Integer getPostId() {
        return postId;
    }

    public void setPostId(Integer postId) {
        this.postId = postId;
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
}
