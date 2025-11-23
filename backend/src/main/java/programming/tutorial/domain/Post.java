package programming.tutorial.domain;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;

@Entity
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 100000)
    private String content;

    @Column(name = "user_id")
    private String userId;

    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @ManyToOne
    @JoinColumn(name = "parent_post_id")
    private Post parentPost;

    @OneToMany(mappedBy = "parentPost", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Post> replies = new ArrayList<>();

    @Column(nullable = false)
    private boolean deleted = false;

    @Column(name = "category")
    private String category;

    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;

    @Column(name = "moderationLabel")
    private String moderationLabel;

    @Column(name = "moderationConfidence")
    private Double moderationConfidence;

    @Column(columnDefinition = "TEXT")
    private String moderationReasoning;
    @Column(name = "moderationTimestamp")
    private Date moderationTimestamp;


    public Post() {
    }

    public Post(Integer id, String content, String userId, Date createdAt, Post parentPost, List<Post> replies, boolean deleted, String category, Date updatedAt, String moderationLabel, Double moderationConfidence, String moderationReasoning, Date moderationTimestamp) {
        this.id = id;
        this.content = content;
        this.userId = userId;
        this.createdAt = createdAt;
        this.parentPost = parentPost;
        this.replies = replies;
        this.deleted = deleted;
        this.category = category;
        this.updatedAt = updatedAt;
        this.moderationLabel = moderationLabel;
        this.moderationConfidence = moderationConfidence;
        this.moderationReasoning = moderationReasoning;
        this.moderationTimestamp = moderationTimestamp;
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

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Post getParentPost() {
        return parentPost;
    }

    public void setParentPost(Post parentPost) {
        this.parentPost = parentPost;
    }

    public List<Post> getReplies() {
        return replies;
    }

    public void setReplies(List<Post> replies) {
        this.replies = replies;
    }

    public boolean isDeleted() {
        return deleted;
    }

    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getModerationLabel() {
        return moderationLabel;
    }

    public void setModerationLabel(String moderationLabel) {
        this.moderationLabel = moderationLabel;
    }

    public Double getModerationConfidence() {
        return moderationConfidence;
    }

    public void setModerationConfidence(Double moderationConfidence) {
        this.moderationConfidence = moderationConfidence;
    }

    public Date getModerationTimestamp() {
        return moderationTimestamp;
    }

    public void setModerationTimestamp(Date moderationTimestamp) {
        this.moderationTimestamp = moderationTimestamp;
    }

    public String getModerationReasoning() {
        return moderationReasoning;
    }

    public void setModerationReasoning(String moderationReasoning) {
        this.moderationReasoning = moderationReasoning;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Post post)) return false;
        return deleted == post.deleted && Objects.equals(id, post.id) && Objects.equals(content, post.content) && Objects.equals(userId, post.userId) && Objects.equals(createdAt, post.createdAt) && Objects.equals(parentPost, post.parentPost) && Objects.equals(replies, post.replies) && Objects.equals(category, post.category) && Objects.equals(updatedAt, post.updatedAt) && Objects.equals(moderationLabel, post.moderationLabel) && Objects.equals(moderationConfidence, post.moderationConfidence) && Objects.equals(moderationReasoning, post.moderationReasoning) && Objects.equals(moderationTimestamp, post.moderationTimestamp);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, content, userId, createdAt, parentPost, replies, deleted, category, updatedAt, moderationLabel, moderationConfidence, moderationReasoning, moderationTimestamp);
    }
}