package microservice_chat.dao;

import microservice_chat.domain.ChatMessage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.time.Instant;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class ChatMessageRepositoryTest {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    private ChatMessage msg1;
    private ChatMessage msg2;

    @BeforeEach
    void setUp() {
        chatMessageRepository.deleteAll();

        msg1 = new ChatMessage();
        msg1.setId(UUID.randomUUID());
        msg1.setFromUserId("userA");
        msg1.setFromUserUsername("User A");
        msg1.setToUserId("userB");
        msg1.setToUserUsername("User B");
        msg1.setContent("Hello");
        msg1.setDeleted(false);
        msg1.setSentAt(Instant.now());

        msg2 = new ChatMessage();
        msg2.setId(UUID.randomUUID());
        msg2.setFromUserId("userB");
        msg2.setFromUserUsername("User B");
        msg2.setToUserId("userA");
        msg2.setToUserUsername("User A");
        msg2.setContent("Hi");
        msg2.setDeleted(false);
        msg2.setSentAt(Instant.now().plusSeconds(10));

        chatMessageRepository.save(msg1);
        chatMessageRepository.save(msg2);
    }

    @Test
    void testFindByFromUserIdAndToUserIdOrFromUserIdAndToUserId() {
        List<ChatMessage> messages = chatMessageRepository
                .findByFromUserIdAndToUserIdOrFromUserIdAndToUserId(
                        "userA", "userB", "userB", "userA"
                );

        assertThat(messages).hasSize(2)
                .extracting(ChatMessage::getContent)
                .containsExactlyInAnyOrder("Hello", "Hi");
    }

    @Test
    void testFindAllMessagesForUser() {
        List<ChatMessage> messages = chatMessageRepository.findAllMessagesForUser("userA");
        assertThat(messages).hasSize(2)
                .extracting(ChatMessage::getFromUserId)
                .contains("userA", "userB");
    }

    @Test
    void testFindVisibleMessagesBetween() {
        List<ChatMessage> messages = chatMessageRepository.findVisibleMessagesBetween("userA", "userB");
        assertThat(messages).hasSize(2)
                .extracting(ChatMessage::getContent)
                .containsExactlyInAnyOrder("Hello", "Hi");
    }

    @Test
    void testFindAllVisibleMessagesForUser() {
        msg1.setVisibleTo(Set.of("userA", "userB"));
        msg2.setVisibleTo(Set.of("userA"));
        chatMessageRepository.save(msg1);
        chatMessageRepository.save(msg2);

        List<ChatMessage> messages = chatMessageRepository.findAllVisibleMessagesForUser("userA");
        assertThat(messages).hasSize(2);
    }

    @Test
    void testDeleteInBatch() {
        chatMessageRepository.deleteAll(Set.of(msg1, msg2));
        List<ChatMessage> messages = chatMessageRepository.findAll();
        assertThat(messages).isEmpty();
    }
}