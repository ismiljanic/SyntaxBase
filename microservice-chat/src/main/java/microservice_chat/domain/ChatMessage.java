package microservice_chat.domain;

import jakarta.persistence.*;
import microservice_chat.dto.MessageType;
import org.springframework.beans.factory.annotation.Value;

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
    @Column(nullable = false)
    private String content;

    @Column(nullable = false)
    private Instant sentAt;

    @Enumerated(EnumType.STRING)
    private MessageType type;

    @Column(name = "deleted")
    private boolean deleted = false;

    @ElementCollection
    @CollectionTable(name = "chat_message_visibility", joinColumns = @JoinColumn(name = "message_id"))
    @Column(name = "user_id")
    private Set<String> visibleTo = new HashSet<>();

    public ChatMessage() {
    }

    public ChatMessage(UUID id, String fromUserId, String fromUserUsername, String toUserId, String toUserUsername, String content, Instant sentAt, MessageType type, boolean deleted, Set<String> visibleTo) {
        this.id = id;
        this.fromUserId = fromUserId;
        this.fromUserUsername = fromUserUsername;
        this.toUserId = toUserId;
        this.toUserUsername = toUserUsername;
        this.content = content;
        this.sentAt = sentAt;
        this.type = type;
        this.deleted = deleted;
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

    public Set<String> getVisibleTo() {
        return visibleTo;
    }

    public void setVisibleTo(Set<String> visibleTo) {
        this.visibleTo = visibleTo;
    }

    public boolean isDeleted() {
        return deleted;
    }

    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }
}