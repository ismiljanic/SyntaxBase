package com.SyntaxBase.dto;

public class ReplyCreatedEventDTO {
    private Long postId;
    private String parentUserId;
    private Long replyId;
    private String replyUserId;
    private String replyContent;
    private String parentUserEmail;
    private String replierUserEmail;

    public Long getPostId() {
        return postId;
    }

    public void setPostId(Long postId) {
        this.postId = postId;
    }

    public String getParentUserId() {
        return parentUserId;
    }

    public void setParentUserId(String parentUserId) {
        this.parentUserId = parentUserId;
    }

    public Long getReplyId() {
        return replyId;
    }

    public void setReplyId(Long replyId) {
        this.replyId = replyId;
    }

    public String getReplyUserId() {
        return replyUserId;
    }

    public void setReplyUserId(String replyUserId) {
        this.replyUserId = replyUserId;
    }

    public String getReplyContent() {
        return replyContent;
    }

    public void setReplyContent(String replyContent) {
        this.replyContent = replyContent;
    }

    public String getParentUserEmail() {
        return parentUserEmail;
    }

    public void setParentUserEmail(String parentUserEmail) {
        this.parentUserEmail = parentUserEmail;
    }

    public String getReplierUserEmail() {
        return replierUserEmail;
    }

    public void setReplierUserEmail(String replierUserEmail) {
        this.replierUserEmail = replierUserEmail;
    }
}