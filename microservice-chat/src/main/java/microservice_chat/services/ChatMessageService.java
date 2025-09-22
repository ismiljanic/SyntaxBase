package microservice_chat.services;

import jakarta.transaction.Transactional;
import microservice_chat.dao.ChatMessageRepository;
import microservice_chat.domain.ChatMessage;
import microservice_chat.dto.ChatMessageDTO;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ChatMessageService {

    private final ChatMessageRepository repository;
    private final KafkaTemplate<String, ChatMessageDTO> kafkaTemplate;

    public ChatMessageService(ChatMessageRepository repository, KafkaTemplate<String, ChatMessageDTO> kafkaTemplate) {
        this.repository = repository;
        this.kafkaTemplate = kafkaTemplate;
    }

    @Transactional
    public void processMessage(ChatMessageDTO dto) {
        ChatMessage entity = new ChatMessage();
        entity.setId(UUID.randomUUID());
        entity.setFromUserId(dto.getFromUserId());
        entity.setToUserId(dto.getToUserId());
        entity.setContent(dto.getContent());
        entity.setSentAt(dto.getSentAt());

        repository.save(entity);

        kafkaTemplate.send("chat.messages", dto.getToUserId(), dto);
    }

    public List<ChatMessageDTO> getMessagesBetween(String user1, String user2) {
        List<ChatMessage> messages = repository.findByFromUserIdAndToUserIdOrFromUserIdAndToUserId(
                user1, user2, user2, user1
        );

        messages.sort((m1, m2) -> m1.getSentAt().compareTo(m2.getSentAt()));

        return messages.stream().map(m -> {
            ChatMessageDTO dto = new ChatMessageDTO();
            dto.setId(m.getId());
            dto.setFromUserId(m.getFromUserId());
            dto.setToUserId(m.getToUserId());
            dto.setContent(m.getContent());
            dto.setSentAt(m.getSentAt());
            dto.setType(m.getType());
            return dto;
        }).collect(Collectors.toList());
    }
}
