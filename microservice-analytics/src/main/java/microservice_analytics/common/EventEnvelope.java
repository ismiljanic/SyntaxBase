package microservice_analytics.common;

import java.time.Instant;

public class EventEnvelope<T> {

    private String eventId;
    private String eventType;
    private String sourceService;
    private Instant occurredAt;
    private T payload;

    public EventEnvelope() {}

    public EventEnvelope(
            String eventId,
            String eventType,
            String sourceService,
            Instant occurredAt,
            T payload
    ) {
        this.eventId = eventId;
        this.eventType = eventType;
        this.sourceService = sourceService;
        this.occurredAt = occurredAt;
        this.payload = payload;
    }

    public String getEventId() {
        return eventId;
    }

    public void setEventId(String eventId) {
        this.eventId = eventId;
    }

    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    public String getSourceService() {
        return sourceService;
    }

    public void setSourceService(String sourceService) {
        this.sourceService = sourceService;
    }

    public Instant getOccurredAt() {
        return occurredAt;
    }

    public void setOccurredAt(Instant occurredAt) {
        this.occurredAt = occurredAt;
    }

    public T getPayload() {
        return payload;
    }

    public void setPayload(T payload) {
        this.payload = payload;
    }
}
