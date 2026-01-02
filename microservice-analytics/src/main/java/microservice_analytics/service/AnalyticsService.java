package microservice_analytics.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import common.EventEnvelope;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@Service
public class AnalyticsService {

    private final JdbcTemplate jdbc;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public AnalyticsService(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public void ingest(EventEnvelope<?> event) {
        persistRawEvent(event);

        if ("CHAT_MESSAGE_SENT".equals(event.getEventType())) {
            projectChatMessage(event);
        }
    }

    private void persistRawEvent(EventEnvelope<?> event) {
        jdbc.update("""
                        INSERT INTO analytics_event
                        (id, event_type, source_service, occurred_at, payload)
                        VALUES (?, ?, ?, ?, ?::jsonb)
                        ON CONFLICT (id) DO NOTHING
                        """,
                UUID.fromString(event.getEventId()),
                event.getEventType(),
                event.getSourceService(),
                Timestamp.from(event.getOccurredAt()),
                toJson(event.getPayload())
        );
    }

    private void projectChatMessage(EventEnvelope<?> event) {
        Map<?, ?> payload = (Map<?, ?>) event.getPayload();

        double sentAtSeconds = Double.parseDouble(payload.get("sentAt").toString());
        Instant sentAt = Instant.ofEpochSecond(
                (long) sentAtSeconds,
                (long) ((sentAtSeconds % 1) * 1_000_000_000)
        );

        jdbc.update("""
                        INSERT INTO chat_message_fact
                        (message_id, from_user_id, to_user_id, sent_at)
                        VALUES (?, ?, ?, ?)
                        ON CONFLICT (message_id) DO NOTHING
                        """,
                payload.get("messageId").toString(),
                payload.get("fromUserId").toString(),
                payload.get("toUserId").toString(),
                Timestamp.from(sentAt)
        );

        jdbc.update("""
                INSERT INTO daily_chat_metrics (date, messages_sent)
                VALUES (CURRENT_DATE, 1)
                ON CONFLICT (date)
                DO UPDATE SET messages_sent = daily_chat_metrics.messages_sent + 1
                """);
    }

    private String toJson(Object payload) {
        try {
            return objectMapper.writeValueAsString(payload);
        } catch (Exception e) {
            throw new IllegalStateException("Payload serialization failed", e);
        }
    }
}