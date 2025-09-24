package microservice_chat.services;

import jakarta.transaction.Transactional;
import microservice_chat.dao.ChatMessageRepository;
import microservice_chat.domain.ChatMessage;
import microservice_chat.dto.ChatMessageDTO;
import microservice_chat.dto.ChatSummaryDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ChatMessageService {
    private static final Logger logger = LoggerFactory.getLogger(ChatMessageService.class);

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
        entity.setFromUserUsername(dto.getFromUserUsername());
        entity.setToUserId(dto.getToUserId());
        entity.setToUserUsername(dto.getToUserUsername());
        entity.setContent(dto.getContent());
        entity.setSentAt(dto.getSentAt());
        entity.getVisibleTo().add(dto.getFromUserId());
        entity.getVisibleTo().add(dto.getToUserId());

        repository.save(entity);

        ChatMessageDTO dtoOut = new ChatMessageDTO();
        dtoOut.setId(entity.getId());
        dtoOut.setFromUserId(entity.getFromUserId());
        dtoOut.setFromUserUsername(entity.getFromUserUsername());
        dtoOut.setToUserId(entity.getToUserId());
        dtoOut.setToUserUsername(entity.getToUserUsername());
        dtoOut.setContent(entity.getContent());
        dtoOut.setSentAt(entity.getSentAt());
        dtoOut.setDeleted(entity.isDeleted());

        kafkaTemplate.send("chat.messages", dtoOut.getToUserId(), dtoOut);
    }

    public List<ChatMessageDTO> getMessagesBetween(String user1, String user2) {
        List<ChatMessage> messages = repository.findVisibleMessagesBetween(user1, user2);

        messages.sort((m1, m2) -> m1.getSentAt().compareTo(m2.getSentAt()));

        return messages.stream().map(m -> {
            ChatMessageDTO dto = new ChatMessageDTO();
            dto.setId(m.getId());
            dto.setFromUserId(m.getFromUserId());
            dto.setFromUserUsername(m.getFromUserUsername());
            dto.setToUserId(m.getToUserId());
            dto.setToUserUsername(m.getToUserUsername());
            dto.setContent(m.getContent());
            dto.setSentAt(m.getSentAt());
            dto.setType(m.getType());
            return dto;
        }).collect(Collectors.toList());
    }

    public List<ChatSummaryDTO> getChatSummariesForUser(String userId) {
        List<ChatMessage> allMessages = repository.findAllVisibleMessagesForUser(userId);

        Map<String, ChatMessage> lastMessagePerContact = new LinkedHashMap<>();

        for (ChatMessage msg : allMessages) {
            String otherUserId = msg.getFromUserId().equals(userId) ? msg.getToUserId() : msg.getFromUserId();

            lastMessagePerContact.putIfAbsent(otherUserId, msg);
        }

        return lastMessagePerContact.entrySet().stream()
                .map(entry -> {
                    ChatMessage lastMsg = entry.getValue();
                    String otherUserId = entry.getKey();
                    String otherUsername = lastMsg.getFromUserId().equals(userId)
                            ? lastMsg.getToUserUsername()
                            : lastMsg.getFromUserUsername();

                    return new ChatSummaryDTO(
                            otherUserId,
                            otherUsername,
                            lastMsg.getContent(),
                            lastMsg.getSentAt()
                    );
                })
                .toList();
    }

    @Transactional
    public void removeContact(String currentUserId, String otherUserId) {
        logger.info("Remove contact hit");
        List<ChatMessage> messages = repository.findVisibleMessagesBetween(currentUserId, otherUserId);
        for (ChatMessage msg : messages) {
            msg.getVisibleTo().remove(currentUserId);
        }
        logger.info("Removing messages successfully and saving messages {}", messages);
        repository.saveAll(messages);
    }

    public void softDeleteMessage(String userId, UUID messageId) throws AccessDeniedException {
        logger.info("Deleting messageId: {}", messageId);

        ChatMessage message = repository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));
        if (!message.getFromUserId().equals(userId)) {
            throw new AccessDeniedException("Cannot delete others' messages");
        }
        message.setDeleted(true);
        repository.save(message);

        //To display deleted messages in real-time
        ChatMessageDTO dto = new ChatMessageDTO();
        dto.setId(message.getId());
        dto.setFromUserId(message.getFromUserId());
        dto.setToUserId(message.getToUserId());
        dto.setDeleted(true);
        kafkaTemplate.send("chat.messages", dto.getToUserId(), dto);
        kafkaTemplate.send("chat.messages", dto.getFromUserId(), dto);
    }
}
