package programming.tutorial.controller;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import programming.tutorial.config.TestSecurityConfig;
import programming.tutorial.domain.Tier;
import programming.tutorial.domain.User;
import programming.tutorial.domain.UserBadge;
import programming.tutorial.dto.*;
import programming.tutorial.services.BadgeService;
import programming.tutorial.services.impl.InstructorRequestServiceJpa;
import programming.tutorial.services.impl.UserServiceJpa;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.hamcrest.core.StringContains.containsString;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
@Import(TestSecurityConfig.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;
    @MockBean
    private UserServiceJpa userService;
    @MockBean
    private InstructorRequestServiceJpa instructorRequestServiceJpa;
    @Autowired
    private ObjectMapper objectMapper;
    private List<UserBadge> userBadges;

    @MockBean
    private BadgeService badgeService;

    @Test
    @WithMockUser
    void getUserInformation_shouldReturnUser_whenValidToken() throws Exception {
        String validToken = JWT.create()
                .withSubject("auth0|12345")
                .sign(Algorithm.none());

        User mockUser = new User();
        mockUser.setAuth0UserId("auth0|12345");

        when(userService.findByAuth0UserId("auth0|12345")).thenReturn(mockUser);

        mockMvc.perform(get("/api/users/userInformation")
                        .with(csrf())
                        .header("Authorization", "Bearer " + validToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.auth0UserId").value("auth0|12345"));
    }

    @Test
    @WithMockUser
    void getUserInformation_shouldReturnBadRequest_whenInvalidToken() throws Exception {
        String invalidToken = "not-a-valid-jwt";

        mockMvc.perform(get("/api/users/userInformation")
                        .with(csrf())
                        .header("Authorization", "Bearer " + invalidToken))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Invalid token"));
    }

    @Test
    @WithMockUser
    void getUserInformation_shouldReturnUnauthorized_whenNoToken() throws Exception {
        mockMvc.perform(get("/api/users/userInformation")
                        .with(csrf()))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Missing or invalid token"));
    }

    @Test
    void syncAuth0User_shouldReturnOk() throws Exception {
        Auth0UserDTO dto = new Auth0UserDTO();
        dto.setEmail("test@example.com");

        Jwt mockJwt = Jwt.withTokenValue("token")
                .subject("auth0|12345")
                .header("alg", "none")
                .build();

        when(userService.syncAuth0User(any(Auth0UserDTO.class), anyString()))
                .thenAnswer(invocation -> ResponseEntity.ok(Map.of("status", "success")));

        mockMvc.perform(post("/api/users/sync-auth0")
                        .with(csrf())
                        .with(jwt().jwt(mockJwt))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"));
    }

    @Test
    @WithMockUser
    void registerUser_shouldReturnOk_whenServiceReturnsOk() throws Exception {
        UserDTO userDTO = new UserDTO();
        userDTO.setEmail("newuser@example.com");
        userDTO.setName("New User");

        when(userService.addUser(any(UserDTO.class))).thenAnswer(invocation ->
                ResponseEntity.ok(42)
        );

        mockMvc.perform(post("/api/users/register")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(userDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userType").value("user"))
                .andExpect(jsonPath("$.id").value(42));
    }

    @Test
    @WithMockUser
    void registerUser_shouldReturnBadRequest_whenServiceReturnsBadRequest() throws Exception {
        UserDTO userDTO = new UserDTO();
        userDTO.setEmail("duplicate@example.com");

        when(userService.addUser(any(UserDTO.class))).thenAnswer(invocation ->
                ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email already exists")
        );

        mockMvc.perform(post("/api/users/register")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(userDTO)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Email already exists"));
    }

    @Test
    @WithMockUser
    void registerUser_shouldReturnInternalServerError_whenServiceReturnsOther() throws Exception {
        UserDTO userDTO = new UserDTO();

        when(userService.addUser(any(UserDTO.class))).thenAnswer(invocation ->
                ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Database down")
        );

        mockMvc.perform(post("/api/users/register")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(userDTO)))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string("Error during registration"));
    }

    @Test
    void getUserAccountInformation_shouldReturnOk_whenUserAccessesOwnAccount() throws Exception {
        String userId = "user1";
        UserAccountDTO dto = new UserAccountDTO();
        dto.setUsername("user1@example.com");

        when(userService.getUserAccountInformation(userId)).thenReturn(dto);

        mockMvc.perform(get("/api/users/accountInformation/{userId}", userId)
                        .with(jwt().jwt(jwt -> jwt.claim("sub", "user1"))
                                .authorities(new SimpleGrantedAuthority("ROLE_USER"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("user1@example.com"));
    }

    @Test
    void getUserAccountInformation_shouldReturnOk_whenAdminAccessesAnotherAccount() throws Exception {
        String userId = "user2";
        UserAccountDTO dto = new UserAccountDTO();
        dto.setUsername("user2@example.com");

        when(userService.getUserAccountInformation(userId)).thenReturn(dto);

        mockMvc.perform(get("/api/users/accountInformation/{userId}", userId)
                        .with(jwt().jwt(jwt -> jwt.claim("sub", "admin"))
                                .authorities(new SimpleGrantedAuthority("ROLE_ADMIN"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("user2@example.com"));
    }

    @Test
    @WithMockUser
    void getUserAccountInformation_shouldReturnForbidden_whenUserAccessesAnotherAccount() throws Exception {

        mockMvc.perform(get("/api/users/accountInformation/{userId}", "user2")
                        .with(jwt().jwt(jwt -> jwt.claim("sub", "user1"))
                                .authorities(new SimpleGrantedAuthority("ROLE_USER"))))
                .andExpect(status().isForbidden());

    }


    @Test
    @WithMockUser(username = "user1", roles = {"USER"})
    void getUserAccountInformation_shouldReturnNotFound_whenRuntimeException() throws Exception {
        String userId = "user1";

        when(userService.getUserAccountInformation(userId)).thenThrow(new RuntimeException("Not found"));

        mockMvc.perform(get("/api/users/accountInformation/{userId}", userId)
                        .with(jwt().jwt(jwt -> jwt.claim("sub", "user1")).authorities(new SimpleGrantedAuthority("ROLE_USER"))))
                .andExpect(status().isNotFound());
    }

    @Test
    void updateName_shouldReturnOk_whenValid() throws Exception {
        UserUpdateRequest request = new UserUpdateRequest();
        request.setName("New Name");

        mockMvc.perform(put("/api/users/updateName")
                        .with(csrf())
                        .with(jwt().jwt(jwt -> jwt.claim("sub", "auth0|123"))
                                .authorities(new SimpleGrantedAuthority("ROLE_USER")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().string("Name updated successfully"));

        verify(userService).updateName("auth0|123", "New Name");
    }

    @Test
    @WithMockUser
    void updateName_shouldReturnBadRequest_whenNameEmpty() throws Exception {
        UserUpdateRequest request = new UserUpdateRequest();
        request.setName("   ");

        mockMvc.perform(put("/api/users/updateName")
                        .with(jwt().jwt(jwt -> jwt.claim("sub", "auth0|123")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Name cannot be empty."));
    }

    @Test
    void updateName_shouldReturnForbidden_whenNotUserRole() throws Exception {
        UserUpdateRequest request = new UserUpdateRequest();
        request.setName("New Name");

        Authentication auth = Mockito.mock(Authentication.class);
        when(auth.getAuthorities()).thenAnswer(invocationOnMock ->
                List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))
        );

        mockMvc.perform(put("/api/users/updateName")
                        .with(jwt().jwt(jwt -> jwt.claim("sub", "auth0|123")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden())
                .andExpect(content().string("Access denied."));
    }


    @Test
    void updateSurname_shouldReturnOk() throws Exception {
        UserUpdateRequest request = new UserUpdateRequest();
        request.setSurname("NewSurname");

        mockMvc.perform(put("/api/users/updateSurname")
                        .with(jwt().jwt(jwt -> jwt.claim("sub", "auth0|123")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().string("Surname updated successfully"));

        verify(userService).updateSurname("auth0|123", "NewSurname");
    }

    @Test
    void updateUsername_shouldReturnOk() throws Exception {
        UserUpdateRequest request = new UserUpdateRequest();
        request.setUsername("newUsername");

        mockMvc.perform(put("/api/users/updateUsername")
                        .with(jwt().jwt(jwt -> jwt.claim("sub", "auth0|123")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().string("Username updated successfully"));

        verify(userService).updateUsername("auth0|123", "newUsername");
    }

    @Test
    void deleteOwnAccount_shouldReturnOk() throws Exception {
        mockMvc.perform(delete("/api/users/deleteAccount")
                        .with(jwt().jwt(jwt -> jwt.claim("sub", "auth0|123"))))
                .andExpect(status().isOk())
                .andExpect(content().string("Account deleted successfully"));

        verify(userService).deleteUser("auth0|123");
    }

    @Test
    void getAllUsers_shouldReturnList() throws Exception {
        UserDTO user1 = new UserDTO();
        user1.setEmail("user1@example.com");

        UserDTO user2 = new UserDTO();
        user2.setEmail("user2@example.com");

        when(userService.getAllUsers()).thenReturn(List.of(user1, user2));

        mockMvc.perform(get("/api/users/allUsers")
                        .with(jwt().jwt(jwt -> jwt.claim("sub", "auth0|123"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].email").value("user1@example.com"))
                .andExpect(jsonPath("$[1].email").value("user2@example.com"));
    }

    @Test
    void getUserIdByAuth0Id_shouldReturnOk_whenUserExists() throws Exception {
        String auth0Id = "auth0|12345";
        UserIdDTO dto = new UserIdDTO("auth0|123");

        when(userService.getUserIdByAuth0Id(auth0Id)).thenReturn(Optional.of(dto));

        mockMvc.perform(get("/api/users/by-auth0-id/{auth0Id}", auth0Id)
                        .with(jwt().jwt(jwt -> jwt.claim("sub", "auth0|12345"))))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser
    void getUserIdByAuth0Id_shouldReturnNotFound_whenUserDoesNotExist() throws Exception {
        String auth0Id = "auth0|nonexistent";

        when(userService.getUserIdByAuth0Id(auth0Id)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/users/by-auth0-id/{auth0Id}", auth0Id))
                .andExpect(status().isNotFound())
                .andExpect(content().string("User not found with Auth0 ID: " + auth0Id));
    }


    @Test
    @WithMockUser
    void requestInstructorRole_shouldReturnOk_whenRequestSuccessful() throws Exception {
        InstructorRequestDTO dto = new InstructorRequestDTO();
        dto.setCredentials("I want to teach");

        when(instructorRequestServiceJpa.submitInstructorRequest(dto, "auth0|123"))
                .thenAnswer(invocationOnMock -> ResponseEntity.ok(""));

        mockMvc.perform(post("/api/users/request-instructor")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(content().string(""));
    }


    @Test
    @WithMockUser
    void getUserRole_shouldReturnOk_whenRoleExists() throws Exception {
        String auth0Id = "auth0|12345";
        when(userService.getUserRoleByAuth0Id(auth0Id)).thenReturn(Optional.of("ROLE_USER"));

        mockMvc.perform(get("/api/users/role/{auth0UserId}", auth0Id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role").value("ROLE_USER"));
    }

    @Test
    @WithMockUser
    void getUserRole_shouldReturnNotFound_whenRoleDoesNotExist() throws Exception {
        String auth0Id = "auth0|nonexistent";
        when(userService.getUserRoleByAuth0Id(auth0Id)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/users/role/{auth0UserId}", auth0Id))
                .andExpect(status().isNotFound())
                .andExpect(content().string(""));
    }

    @Test
    @WithMockUser
    void upgradeTier_shouldReturnOk_whenValidTier() throws Exception {
        TierUpgradeRequestDTO request = new TierUpgradeRequestDTO();
        request.setNewTier("professional");

        Jwt mockJwt = Mockito.mock(Jwt.class);
        when(mockJwt.getSubject()).thenReturn("auth0|123");


        doNothing().when(userService).upgradeTier("auth0|123", Tier.PROFESSIONAL);

        mockMvc.perform(post("/api/users/upgrade-tier")
                        .with(csrf())
                        .with(jwt().jwt(jwt -> jwt.claim("sub", "auth0|123")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().string("Tier successfully upgraded to PROFESSIONAL"));
    }

    @Test
    @WithMockUser
    void upgradeTier_shouldReturnBadRequest_whenInvalidTier() throws Exception {
        TierUpgradeRequestDTO request = new TierUpgradeRequestDTO();
        request.setNewTier("invalidTier");

        Jwt mockJwt = Mockito.mock(Jwt.class);
        when(mockJwt.getSubject()).thenReturn("auth0|123");

        doThrow(new IllegalArgumentException("INVALID_TIER")).when(userService)
                .upgradeTier(eq("auth0|123"), any());

        mockMvc.perform(post("/api/users/upgrade-tier")
                        .with(csrf())
                        .with(jwt().jwt(jwt -> jwt.claim("sub", "auth0|123")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string(containsString("Invalid tier selection")));
    }

    @Test
    @WithMockUser
    void upgradeTier_shouldReturnInternalServerError_whenServiceThrows() throws Exception {
        TierUpgradeRequestDTO request = new TierUpgradeRequestDTO();
        request.setNewTier("ULTIMATE");

        Jwt mockJwt = Mockito.mock(Jwt.class);
        when(mockJwt.getSubject()).thenReturn("auth0|123");


        doThrow(new RuntimeException("Database down")).when(userService)
                .upgradeTier("auth0|123", Tier.ULTIMATE);

        mockMvc.perform(post("/api/users/upgrade-tier")
                        .with(csrf())
                        .with(jwt().jwt(jwt -> jwt.claim("sub", "auth0|123")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string(containsString("Upgrade failed")));
    }

    @Test
    @WithMockUser
    void getUserStatus_shouldReturnOk_whenUserIsActive() throws Exception {
        String auth0Id = "auth0|123";
        when(userService.getUserActiveStatus(auth0Id)).thenReturn(true);

        mockMvc.perform(get("/api/users/{auth0UserId}/status", auth0Id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.active").value(true));
    }

    @Test
    @WithMockUser
    void getUserStatus_shouldReturnOk_whenUserIsInactive() throws Exception {
        String auth0Id = "auth0|123";
        when(userService.getUserActiveStatus(auth0Id)).thenReturn(false);

        mockMvc.perform(get("/api/users/{auth0UserId}/status", auth0Id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.active").value(false));
    }

    @Test
    @WithMockUser
    void testGetUserBadges() throws Exception {
        userBadges = List.of(
                new UserBadge(null, null),
                new UserBadge(null, null)
        );
        when(badgeService.getUserBadges("auth0|123")).thenReturn(userBadges);

        mockMvc.perform(get("/api/users/badges")
                        .with(jwt().jwt(jwt -> jwt.claim("sub", "auth0|123"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(userBadges.size()));
    }
}