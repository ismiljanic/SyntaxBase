package microservice_chat.controller;

import com.auth0.jwt.JWT;
import microservice_chat.dto.ChatSummaryDTO;
import microservice_chat.services.ChatMessageService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.oauth2.jwt.Jwt;
import shared.dto.ChatMessageDTO;

import java.nio.file.AccessDeniedException;
import java.security.Principal;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ChatControllerTest {

    private KafkaTemplate<String, ChatMessageDTO> kafkaTemplate;
    @Mock
    private ChatMessageService chatService;

    @InjectMocks
    private ChatController chatController;

    @BeforeEach
    void setUp() {
        kafkaTemplate = mock(KafkaTemplate.class);
//        chatService = mock(ChatMessageService.class);
//        chatController = new ChatController(kafkaTemplate, chatService);
//        MockitoAnnotations.openMocks(this);
    }

    @Test
    void sendMessage_withValidBearerToken_setsUserIdAndCallsService() throws Exception {
        ChatMessageDTO message = new ChatMessageDTO();
        String fakeUserId = "auth0|12345";
        String fakeToken = JWT.create()
                .withSubject(fakeUserId)
                .sign(com.auth0.jwt.algorithms.Algorithm.HMAC256("secret"));

        String authHeader = "Bearer " + fakeToken;

        chatController.sendMessage(message, authHeader);

        ArgumentCaptor<ChatMessageDTO> captor = ArgumentCaptor.forClass(ChatMessageDTO.class);
        verify(chatService).processMessage(captor.capture());

        ChatMessageDTO captured = captor.getValue();
        assertEquals(fakeUserId, captured.getFromUserId());
        assertNotNull(captured.getId(), "Message ID should be set");
        assertNotNull(captured.getSentAt(), "SentAt timestamp should be set");
    }

    @Test
    void sendMessage_missingAuthorizationHeader_throwsAccessDenied() {
        ChatMessageDTO message = new ChatMessageDTO();

        Exception ex = assertThrows(AccessDeniedException.class, () ->
                chatController.sendMessage(message, null));

        assertEquals("Missing Authorization header", ex.getMessage());
        verifyNoInteractions(chatService);
    }

    @Test
    void sendMessage_invalidAuthorizationHeader_throwsAccessDenied() {
        ChatMessageDTO message = new ChatMessageDTO();

        Exception ex = assertThrows(AccessDeniedException.class, () ->
                chatController.sendMessage(message, "InvalidHeader"));

        assertEquals("Missing Authorization header", ex.getMessage());
        verifyNoInteractions(chatService);
    }

    @Test
    void testGetMessages() {
        ChatMessageDTO msg1 = new ChatMessageDTO();
        msg1.setFromUserUsername("userA");
        msg1.setToUserUsername("userB");
        msg1.setContent("Hello!");

        ChatMessageDTO msg2 = new ChatMessageDTO();
        msg2.setFromUserUsername("userB");
        msg2.setToUserUsername("userA");
        msg2.setContent("Hi!");

        List<ChatMessageDTO> mockMessages = Arrays.asList(msg1, msg2);

        Principal principal = () -> "userA";

        when(chatService.getMessagesBetween(anyString(), anyString()))
                .thenReturn(mockMessages);

        List<ChatMessageDTO> result = chatController.getMessages("userA", "userB", () -> "userA");

        assertThat(result).isNotNull();
        assertThat(result).hasSize(2);
        assertThat(result.get(0).getContent()).isEqualTo("Hello!");
        verify(chatService, times(1)).getMessagesBetween(anyString(), anyString());

    }

    @Test
    void testGetChatSummaries() {
        String userId = "userA";

        ChatSummaryDTO summary1 = new ChatSummaryDTO();
        summary1.setOtherUsername("userB");
        summary1.setLastMessage("Last message");

        ChatSummaryDTO summary2 = new ChatSummaryDTO();
        summary2.setOtherUsername("userC");
        summary2.setLastMessage("Another message");

        List<ChatSummaryDTO> mockSummaries = Arrays.asList(summary1, summary2);

        Jwt jwt = mock(Jwt.class);
        when(jwt.getSubject()).thenReturn(userId);

        when(chatService.getChatSummariesForUser(anyString())).thenReturn(mockSummaries);

        when(jwt.getSubject()).thenReturn("userA");

        List<ChatSummaryDTO> result = chatController.getChatSummaries(jwt);

        assertThat(result).hasSize(2);
        verify(chatService, times(1)).getChatSummariesForUser(anyString());

    }

    @Test
    void testRemoveContact() {
        String otherUserId = "userB";
        Jwt jwt = mock(Jwt.class);
        when(jwt.getSubject()).thenReturn("userA");

        ResponseEntity<Void> response = chatController.removeContact(otherUserId, jwt);

        assertThat(response.getStatusCode().is2xxSuccessful()).isTrue();
        verify(chatService, times(1)).removeContact("userA", otherUserId);
    }

    @Test
    void testSoftDeleteMessage() throws Exception {
        UUID messageId = UUID.randomUUID();
        Jwt jwt = mock(Jwt.class);
        when(jwt.getSubject()).thenReturn("userA");

        ResponseEntity<Void> response = chatController.softDeleteMessage(messageId, jwt);

        assertThat(response.getStatusCode().is2xxSuccessful()).isTrue();
        verify(chatService, times(1)).softDeleteMessage("userA", messageId);
    }

    @Test
    void testEditMessage() throws Exception {
        UUID messageId = UUID.randomUUID();
        Jwt jwt = mock(Jwt.class);
        when(jwt.getSubject()).thenReturn("userA");

        Map<String, String> body = Map.of("content", "Updated content");

        ChatMessageDTO updatedDto = new ChatMessageDTO();
        updatedDto.setContent("Updated content");

        when(chatService.editMessage("userA", messageId, "Updated content"))
                .thenReturn(updatedDto);

        ResponseEntity<ChatMessageDTO> response = chatController.editMessage(messageId, body, jwt);

        assertThat(response.getStatusCode().is2xxSuccessful()).isTrue();
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getContent()).isEqualTo("Updated content");

        verify(chatService, times(1)).editMessage("userA", messageId, "Updated content");
    }
}