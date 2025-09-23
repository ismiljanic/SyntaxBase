package microservice_chat.dto;

import java.time.Instant;

public class ChatSummaryDTO {
    private String otherUserId;
    private String otherUsername;
    private String lastMessage;
    private Instant lastSentAt;

    public ChatSummaryDTO() {
    }

    public ChatSummaryDTO(String otherUserId, String otherUsername, String lastMessage, Instant lastSentAt) {
        this.otherUserId = otherUserId;
        this.otherUsername = otherUsername;
        this.lastMessage = lastMessage;
        this.lastSentAt = lastSentAt;
    }

    public String getOtherUserId() {
        return otherUserId;
    }

    public void setOtherUserId(String otherUserId) {
        this.otherUserId = otherUserId;
    }

    public String getOtherUsername() {
        return otherUsername;
    }

    public void setOtherUsername(String otherUsername) {
        this.otherUsername = otherUsername;
    }

    public String getLastMessage() {
        return lastMessage;
    }

    public void setLastMessage(String lastMessage) {
        this.lastMessage = lastMessage;
    }

    public Instant getLastSentAt() {
        return lastSentAt;
    }

    public void setLastSentAt(Instant lastSentAt) {
        this.lastSentAt = lastSentAt;
    }
}
