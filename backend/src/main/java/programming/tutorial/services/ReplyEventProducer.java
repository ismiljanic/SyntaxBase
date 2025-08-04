package programming.tutorial.services;

import programming.tutorial.dto.ReplyCreatedEventDTO;

public interface ReplyEventProducer {
    void publishReplyCreatedEvent(ReplyCreatedEventDTO event);
}
