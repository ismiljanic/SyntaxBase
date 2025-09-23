package microservice_chat.dao;

import microservice_chat.domain.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, UUID> {
    List<ChatMessage> findByFromUserIdAndToUserIdOrFromUserIdAndToUserId(
            String from1, String to1, String from2, String to2
    );

    @Query("""
                SELECT c
                FROM ChatMessage c
                WHERE c.fromUserId = :userId OR c.toUserId = :userId
                ORDER BY c.sentAt DESC
            """)
    List<ChatMessage> findAllMessagesForUser(@Param("userId") String userId);
}