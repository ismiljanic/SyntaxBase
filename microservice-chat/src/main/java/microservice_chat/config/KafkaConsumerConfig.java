package microservice_chat.config;

import microservice_chat.dto.ChatMessageDTO;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.support.serializer.JsonDeserializer;

import java.util.Map;

@Configuration
@EnableKafka
public class KafkaConsumerConfig {

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, ChatMessageDTO> kafkaListenerContainerFactory(
            ConsumerFactory<String, ChatMessageDTO> consumerFactory) {
        ConcurrentKafkaListenerContainerFactory<String, ChatMessageDTO> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(consumerFactory);
        return factory;
    }

    @Bean
    public ConsumerFactory<String, ChatMessageDTO> consumerFactory() {
        JsonDeserializer<ChatMessageDTO> deserializer = new JsonDeserializer<>(ChatMessageDTO.class);
        deserializer.addTrustedPackages("microservice_chat.dto");
        return new org.springframework.kafka.core.DefaultKafkaConsumerFactory<>(
                Map.of(
                        "bootstrap.servers", "kafka:9092",
                        "group.id", "chat-service-group",
                        "key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer",
                        "value.deserializer", deserializer
                ),
                new org.apache.kafka.common.serialization.StringDeserializer(),
                deserializer
        );
    }
}
