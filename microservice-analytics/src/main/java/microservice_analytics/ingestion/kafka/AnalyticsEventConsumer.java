package microservice_analytics.ingestion.kafka;

import microservice_analytics.common.EventEnvelope;
import org.slf4j.Logger;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class AnalyticsEventConsumer {
    private static final Logger log = org.slf4j.LoggerFactory.getLogger(AnalyticsEventConsumer.class);

    @KafkaListener(
            topics = "chat-events",
            containerFactory = "kafkaListenerContainerFactory"
    )
    public void consume(EventEnvelope<?> event) {

        log.info(
                "Received event | type={} | source={} | at={}",
                event.getEventType(),
                event.getSourceService(),
                event.getOccurredAt()
        );
    }
}
