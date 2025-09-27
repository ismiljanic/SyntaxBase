package microservice_chat.services;

import microservice_chat.dao.ChatMessageRepository;
import microservice_chat.domain.ChatMessage;
import microservice_chat.dto.ChatSummaryDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.kafka.core.KafkaTemplate;
import shared.dto.ChatMessageDTO;

import java.nio.file.AccessDeniedException;
import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ChatMessageServiceTest {
    private ChatMessageRepository repository;
    private KafkaTemplate<String, ChatMessageDTO> kafkaTemplate;
    private ChatMessageService chatMessageService;

    @BeforeEach
    void setUp() {
        repository = mock(ChatMessageRepository.class);
        kafkaTemplate = mock(KafkaTemplate.class);
        chatMessageService = new ChatMessageService(repository, kafkaTemplate);
    }

    @Test
    void processMessage_savesEntityAndSendsKafkaMessage() {
        ChatMessageDTO dto = new ChatMessageDTO();
        dto.setFromUserId("userA");
        dto.setFromUserUsername("User A");
        dto.setToUserId("userB");
        dto.setToUserUsername("User B");
        dto.setContent("Hello");
        dto.setSentAt(Instant.now());
        dto.setReplyToMessageId(UUID.randomUUID());

        chatMessageService.processMessage(dto);

        ArgumentCaptor<ChatMessage> entityCaptor = ArgumentCaptor.forClass(ChatMessage.class);
        verify(repository, times(1)).save(entityCaptor.capture());
        ChatMessage savedEntity = entityCaptor.getValue();

        assertThat(savedEntity.getFromUserId()).isEqualTo("userA");
        assertThat(savedEntity.getToUserId()).isEqualTo("userB");
        assertThat(savedEntity.getContent()).isEqualTo("Hello");
        assertThat(savedEntity.getVisibleTo()).containsExactlyInAnyOrder("userA", "userB");
        assertThat(savedEntity.getId()).isNotNull();

        ArgumentCaptor<ChatMessageDTO> kafkaCaptor = ArgumentCaptor.forClass(ChatMessageDTO.class);
        verify(kafkaTemplate, times(1)).send(eq("chat.messages"), eq("userB"), kafkaCaptor.capture());
        ChatMessageDTO kafkaMessage = kafkaCaptor.getValue();

        assertThat(kafkaMessage.getFromUserId()).isEqualTo("userA");
        assertThat(kafkaMessage.getToUserId()).isEqualTo("userB");
        assertThat(kafkaMessage.getContent()).isEqualTo("Hello");
        assertThat(kafkaMessage.getId()).isEqualTo(savedEntity.getId());
    }

    @Test
    void getMessagesBetween_returnsSortedDTOs() {
        ChatMessage msg1 = new ChatMessage();
        msg1.setId(UUID.randomUUID());
        msg1.setFromUserId("userA");
        msg1.setFromUserUsername("User A");
        msg1.setToUserId("userB");
        msg1.setToUserUsername("User B");
        msg1.setContent("Hello");
        msg1.setSentAt(Instant.now().plusSeconds(10));

        ChatMessage msg2 = new ChatMessage();
        msg2.setId(UUID.randomUUID());
        msg2.setFromUserId("userB");
        msg2.setFromUserUsername("User B");
        msg2.setToUserId("userA");
        msg2.setToUserUsername("User A");
        msg2.setContent("Hi");
        msg2.setSentAt(Instant.now());

        when(repository.findVisibleMessagesBetween("userA", "userB"))
                .thenReturn(Arrays.asList(msg1, msg2));

        List<ChatMessageDTO> result = chatMessageService.getMessagesBetween("userA", "userB");

        verify(repository, times(1)).findVisibleMessagesBetween("userA", "userB");

        assertThat(result).hasSize(2);
        assertThat(result.get(0).getContent()).isEqualTo("Hi");
        assertThat(result.get(1).getContent()).isEqualTo("Hello");

        assertThat(result.get(0).getFromUserId()).isEqualTo("userB");
        assertThat(result.get(1).getFromUserUsername()).isEqualTo("User A");
        assertThat(result.get(1).getId()).isEqualTo(msg1.getId());
    }

    @Test
    void getChatSummariesForUser_returnsLastMessagePerContactIgnoringDeleted() {
        String userId = "userA";

        ChatMessage msg1 = new ChatMessage();
        msg1.setId(UUID.randomUUID());
        msg1.setFromUserId("userA");
        msg1.setFromUserUsername("User A");
        msg1.setToUserId("userB");
        msg1.setToUserUsername("User B");
        msg1.setContent("Hello B");
        msg1.setSentAt(Instant.now().minusSeconds(60));
        msg1.setDeleted(false);

        ChatMessage msg2 = new ChatMessage();
        msg2.setId(UUID.randomUUID());
        msg2.setFromUserId("userB");
        msg2.setFromUserUsername("User B");
        msg2.setToUserId("userA");
        msg2.setToUserUsername("User A");
        msg2.setContent("Hi A");
        msg2.setSentAt(Instant.now());
        msg2.setDeleted(false);

        ChatMessage msg3 = new ChatMessage();
        msg3.setId(UUID.randomUUID());
        msg3.setFromUserId("userC");
        msg3.setFromUserUsername("User C");
        msg3.setToUserId("userA");
        msg3.setToUserUsername("User A");
        msg3.setContent("Hey A");
        msg3.setSentAt(Instant.now().minusSeconds(30));
        msg3.setDeleted(true);

        when(repository.findAllVisibleMessagesForUser(userId))
                .thenReturn(Arrays.asList(msg1, msg2, msg3));

        List<ChatSummaryDTO> summaries = chatMessageService.getChatSummariesForUser(userId);

        verify(repository, times(1)).findAllVisibleMessagesForUser(userId);

        assertThat(summaries).hasSize(1);

        ChatSummaryDTO summary = summaries.get(0);
        assertThat(summary.getOtherUserId()).isEqualTo("userB");
        assertThat(summary.getOtherUsername()).isEqualTo("User B");
        assertThat(summary.getLastMessage()).isEqualTo("Hi A");
        assertThat(summary.getLastSentAt()).isEqualTo(msg2.getSentAt());
    }

    @Test
    void removeContact_removesUserFromVisibleToAndSavesAll() {
        String currentUserId = "userA";
        String otherUserId = "userB";

        ChatMessage msg1 = new ChatMessage();
        msg1.setVisibleTo(new java.util.HashSet<>(Arrays.asList("userA", "userB")));

        ChatMessage msg2 = new ChatMessage();
        msg2.setVisibleTo(new java.util.HashSet<>(Arrays.asList("userA", "userB")));

        List<ChatMessage> messages = Arrays.asList(msg1, msg2);

        when(repository.findVisibleMessagesBetween(currentUserId, otherUserId))
                .thenReturn(messages);

        chatMessageService.removeContact(currentUserId, otherUserId);

        assertThat(msg1.getVisibleTo()).doesNotContain("userA");
        assertThat(msg2.getVisibleTo()).doesNotContain("userA");

        verify(repository, times(1)).saveAll(messages);
    }

    @Test
    void softDeleteMessage_deletesMessageAndSendsKafka() throws Exception {
        String userId = "userA";
        UUID messageId = UUID.randomUUID();

        ChatMessage message = new ChatMessage();
        message.setId(messageId);
        message.setFromUserId(userId);
        message.setToUserId("userB");

        when(repository.findById(messageId)).thenReturn(Optional.of(message));

        chatMessageService.softDeleteMessage(userId, messageId);

        assertThat(message.isDeleted()).isTrue();
        verify(repository, times(1)).save(message);

        verify(kafkaTemplate).send(eq("chat.messages"), eq("userB"), any(ChatMessageDTO.class));
        verify(kafkaTemplate).send(eq("chat.messages"), eq("userA"), any(ChatMessageDTO.class));
    }

    @Test
    void softDeleteMessage_throwsAccessDenied_forOtherUser() {
        String userId = "userA";
        UUID messageId = UUID.randomUUID();

        ChatMessage message = new ChatMessage();
        message.setFromUserId("userB");

        when(repository.findById(messageId)).thenReturn(Optional.of(message));

        assertThrows(AccessDeniedException.class,
                () -> chatMessageService.softDeleteMessage(userId, messageId));

        verify(repository, never()).save(any());
        verify(kafkaTemplate, never()).send(anyString(), anyString(), any());
    }

    @Test
    void editMessage_editsMessageAndSendsKafka() throws Exception {
        String userId = "userA";
        UUID messageId = UUID.randomUUID();
        String newContent = "Edited content";

        ChatMessage message = new ChatMessage();
        message.setId(messageId);
        message.setFromUserId(userId);
        message.setToUserId("userB");
        message.setContent("Old content");

        when(repository.findById(messageId)).thenReturn(Optional.of(message));

        ChatMessageDTO result = chatMessageService.editMessage(userId, messageId, newContent);

        assertThat(result.getContent()).isEqualTo(newContent);
        assertThat(message.isEdited()).isTrue();
        assertThat(message.getEditedAt()).isNotNull();
        verify(repository, times(1)).save(message);

        verify(kafkaTemplate).send(eq("chat.messages"), eq("userB"), any(ChatMessageDTO.class));
        verify(kafkaTemplate).send(eq("chat.messages"), eq("userA"), any(ChatMessageDTO.class));
    }

    @Test
    void editMessage_throwsAccessDenied_forOtherUser() {
        String userId = "userA";
        UUID messageId = UUID.randomUUID();

        ChatMessage message = new ChatMessage();
        message.setFromUserId("userB");

        when(repository.findById(messageId)).thenReturn(Optional.of(message));

        assertThrows(AccessDeniedException.class,
                () -> chatMessageService.editMessage(userId, messageId, "new content"));

        verify(repository, never()).save(any());
        verify(kafkaTemplate, never()).send(anyString(), anyString(), any());
    }
}