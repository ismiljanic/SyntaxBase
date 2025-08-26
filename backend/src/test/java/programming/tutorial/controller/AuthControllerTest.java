package programming.tutorial.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import programming.tutorial.config.TestSecurityConfig;

import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@ContextConfiguration(classes = {AuthController.class, TestSecurityConfig.class})
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private HttpClient httpClient;

    private Map<String, String> loginTokens;

    @BeforeEach
    void setup() {
        loginTokens = Map.of(
                "accessToken", "access123",
                "refreshToken", "refresh123"
        );
    }

    @Test
    @WithMockUser
    void logout_shouldInvalidateSessionAndClearCookies() throws Exception {
        MvcResult result = mockMvc.perform(post("/api/auth/logout").with(csrf()))
                .andExpect(status().isOk())
                .andReturn();

        List<String> cookies = result.getResponse().getHeaders(HttpHeaders.SET_COOKIE);

        assertTrue(cookies.stream().anyMatch(c -> c.contains("accessToken=;")));
        assertTrue(cookies.stream().anyMatch(c -> c.contains("refreshToken=;")));
    }

    @Test
    @WithMockUser
    void login_shouldSetCookies() throws Exception {
        MvcResult result = mockMvc.perform(post("/api/auth/login")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginTokens)))
                .andExpect(status().isOk())
                .andExpect(content().string("Logged in, cookies set"))
                .andReturn();

        List<String> cookies = result.getResponse().getHeaders(HttpHeaders.SET_COOKIE);

        assertTrue(cookies.stream().anyMatch(c -> c.contains("accessToken=")));
        assertTrue(cookies.stream().anyMatch(c -> c.contains("refreshToken=")));
    }

    @Test
    @WithMockUser
    void refreshToken_shouldReturnUnauthorized_whenNoCookie() throws Exception {
        mockMvc.perform(post("/api/auth/refresh")
                        .with(csrf())
                )
                .andExpect(status().isUnauthorized())
                .andExpect(content().string("No refresh token"));
    }

    @Test
    @WithMockUser
    void refreshToken_shouldReturnUnauthorized_whenInvalidToken() throws Exception {
        HttpResponse<String> mockResponse = Mockito.mock(HttpResponse.class);
        when(mockResponse.statusCode()).thenReturn(401);
        when(mockResponse.body()).thenReturn("{\"error\":\"invalid_token\"}");
        when(httpClient.send(any(HttpRequest.class), any(HttpResponse.BodyHandler.class)))
                .thenReturn(mockResponse);

        mockMvc.perform(post("/api/auth/refresh")
                        .with(csrf())
                        .cookie(new Cookie("refreshToken", "invalidToken")))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string("Refresh token invalid"));
    }
}