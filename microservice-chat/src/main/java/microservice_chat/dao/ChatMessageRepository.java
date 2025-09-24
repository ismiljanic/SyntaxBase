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

    @Query("SELECT m FROM ChatMessage m " +
            "WHERE ((m.fromUserId = :user1 AND m.toUserId = :user2) " +
            "   OR (m.fromUserId = :user2 AND m.toUserId = :user1)) " +
            "AND m.deleted = false")
    List<ChatMessage> findVisibleMessagesBetween(String user1, String user2);

    @Query("""
                SELECT c
                FROM ChatMessage c
                WHERE :userId MEMBER OF c.visibleTo
                ORDER BY c.sentAt DESC
            """)
    List<ChatMessage> findAllVisibleMessagesForUser(@Param("userId") String userId);
}