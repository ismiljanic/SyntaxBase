package microservice_chat.domain;

import jakarta.persistence.*;
import shared.dto.MessageType;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "chat_messages")
public class ChatMessage {
    @Id
    private UUID id;
    @Column(nullable = false)
    private String fromUserId;
    @Column(nullable = false)
    private String fromUserUsername;
    @Column(nullable = false)
    private String toUserId;
    @Column(nullable = false)
    private String toUserUsername;
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;
    @Column(nullable = false)
    private Instant sentAt;
    @Enumerated(EnumType.STRING)
    private MessageType type;
    @Column(name = "deleted")
    private boolean deleted = false;
    @Column(name = "reply_to_message_id")
    private UUID replyToMessageId;
    @Column(name = "edited")
    private boolean edited = false;
    @Column(name = "edited_at")
    private Instant editedAt;

    @ElementCollection
    @CollectionTable(name = "chat_message_visibility", joinColumns = @JoinColumn(name = "message_id"))
    @Column(name = "user_id")
    private Set<String> visibleTo = new HashSet<>();

    public ChatMessage() {
    }

    public ChatMessage(UUID id, String fromUserId, String fromUserUsername, String toUserId, String toUserUsername, String content, Instant sentAt, MessageType type, boolean deleted, UUID replyToMessageId, boolean edited, Instant editedAt, Set<String> visibleTo) {
        this.id = id;
        this.fromUserId = fromUserId;
        this.fromUserUsername = fromUserUsername;
        this.toUserId = toUserId;
        this.toUserUsername = toUserUsername;
        this.content = content;
        this.sentAt = sentAt;
        this.type = type;
        this.deleted = deleted;
        this.replyToMessageId = replyToMessageId;
        this.edited = edited;
        this.editedAt = editedAt;
        this.visibleTo = visibleTo;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getFromUserId() {
        return fromUserId;
    }

    public void setFromUserId(String fromUserId) {
        this.fromUserId = fromUserId;
    }

    public String getFromUserUsername() {
        return fromUserUsername;
    }

    public void setFromUserUsername(String fromUserUsername) {
        this.fromUserUsername = fromUserUsername;
    }

    public String getToUserId() {
        return toUserId;
    }

    public void setToUserId(String toUserId) {
        this.toUserId = toUserId;
    }

    public String getToUserUsername() {
        return toUserUsername;
    }

    public void setToUserUsername(String toUserUsername) {
        this.toUserUsername = toUserUsername;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Instant getSentAt() {
        return sentAt;
    }

    public void setSentAt(Instant sentAt) {
        this.sentAt = sentAt;
    }

    public MessageType getType() {
        return type;
    }

    public void setType(MessageType type) {
        this.type = type;
    }

    public boolean isDeleted() {
        return deleted;
    }

    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }

    public UUID getReplyToMessageId() {
        return replyToMessageId;
    }

    public void setReplyToMessageId(UUID replyToMessageId) {
        this.replyToMessageId = replyToMessageId;
    }

    public boolean isEdited() {
        return edited;
    }

    public void setEdited(boolean edited) {
        this.edited = edited;
    }

    public Instant getEditedAt() {
        return editedAt;
    }

    public void setEditedAt(Instant editedAt) {
        this.editedAt = editedAt;
    }

    public Set<String> getVisibleTo() {
        return visibleTo;
    }

    public void setVisibleTo(Set<String> visibleTo) {
        this.visibleTo = visibleTo;
    }
}