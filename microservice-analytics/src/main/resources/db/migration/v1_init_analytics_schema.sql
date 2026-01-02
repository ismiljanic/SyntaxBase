CREATE TABLE analytics_event (
    id VARCHAR(64) PRIMARY KEY,
    event_type VARCHAR(64) NOT NULL,
    source_service VARCHAR(64) NOT NULL,
    occurred_at TIMESTAMP NOT NULL,
    payload JSONB NOT NULL,
    received_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_event_type ON analytics_event(event_type);
CREATE INDEX idx_occurred_at ON analytics_event(occurred_at);

CREATE TABLE chat_message_fact (
    message_id VARCHAR(64) PRIMARY KEY,
    from_user_id VARCHAR NOT NULL,
    to_user_id VARCHAR NOT NULL,
    sent_at TIMESTAMP NOT NULL
);

CREATE INDEX idx_chat_sent_at ON chat_message_fact(sent_at);
CREATE INDEX idx_chat_from_user ON chat_message_fact(from_user_id);

CREATE TABLE daily_chat_metrics (
    date DATE PRIMARY KEY,
    messages_sent BIGINT NOT NULL
);