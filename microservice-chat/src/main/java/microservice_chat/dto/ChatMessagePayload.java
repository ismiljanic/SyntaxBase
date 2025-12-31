package microservice_chat.dto;

import java.time.Instant;

public class ChatMessagePayload {
    private String messageId;
    private String fromUserId;
    private String toUserId;
    private Instant sentAt;

    public ChatMessagePayload(String messageId, String fromUserId, String toUserId, Instant sentAt) {
        this.messageId = messageId;
        this.fromUserId = fromUserId;
        this.toUserId = toUserId;
        this.sentAt = sentAt;
    }

    public String getMessageId() { return messageId; }
    public void setMessageId(String messageId) { this.messageId = messageId; }
    public String getFromUserId() { return fromUserId; }
    public void setFromUserId(String fromUserId) { this.fromUserId = fromUserId; }
    public String getToUserId() { return toUserId; }
    public void setToUserId(String toUserId) { this.toUserId = toUserId; }
    public Instant getSentAt() { return sentAt; }
    public void setSentAt(Instant sentAt) { this.sentAt = sentAt; }
}