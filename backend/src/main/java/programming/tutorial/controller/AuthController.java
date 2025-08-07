package programming.tutorial.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AuthController {
    @Value("${auth0.domain}")
    private String auth0Domain;

    @Value("${auth0.clientId}")
    private String clientId;

    @Value("${auth0.clientSecret}")
    private String clientSecret;

    @PostMapping("/auth/logout")
    public ResponseEntity<String> logout(HttpServletResponse response, HttpSession session) {
        if (session == null) {
            System.out.println("No session found");
        } else {
            session.invalidate();
            System.out.println("Session invalidated");
        }

        ResponseCookie accessTokenCookie = ResponseCookie.from("accessToken", "")
                .path("/")
                .maxAge(0)
                .httpOnly(true)
                .secure(false)
                .sameSite("Strict")
                .build();

        ResponseCookie refreshTokenCookie = ResponseCookie.from("refreshToken", "")
                .path("/")
                .maxAge(0)
                .httpOnly(true)
                .secure(false)
                .sameSite("Strict")
                .build();

        response.addHeader("Set-Cookie", accessTokenCookie.toString());
        response.addHeader("Set-Cookie", refreshTokenCookie.toString());

        System.out.println("Cleared cookies: accessToken and refreshToken");

        return ResponseEntity.ok("Logged out successfully");
    }
    @PostMapping("/auth/login")
    public ResponseEntity<String> login(@RequestBody Map<String, String> tokens, HttpServletResponse response) {
        String accessToken = tokens.get("accessToken");
        String refreshToken = tokens.get("refreshToken");

        ResponseCookie accessCookie = ResponseCookie.from("accessToken", accessToken)
                .httpOnly(true).secure(true).path("/").sameSite("Strict").maxAge(Duration.ofMinutes(15)).build();

        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true).secure(true).path("/").sameSite("Strict").maxAge(Duration.ofHours(1)).build();

        response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());

        return ResponseEntity.ok("Logged in, cookies set");
    }

    @PostMapping("/auth/refresh")
    public ResponseEntity<String> refreshToken(
            @CookieValue(name = "refreshToken", required = false) String refreshToken,
            HttpServletResponse response
    ) throws Exception {

        System.out.println("/refresh endpoint hit");
        System.out.println("Received refreshToken cookie: " + refreshToken);

        if (refreshToken == null) {
            System.out.println("No refresh token provided");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No refresh token");
        }

        HttpClient client = HttpClient.newHttpClient();
        String body = new ObjectMapper().writeValueAsString(Map.of(
                "grant_type", "refresh_token",
                "client_id", clientId,
                "client_secret", clientSecret,
                "refresh_token", refreshToken
        ));

        System.out.println("Sending request to Auth0 with refresh_token...");

        HttpRequest req = HttpRequest.newBuilder()
                .uri(URI.create("https://" + auth0Domain + "/oauth/token"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(body))
                .build();

        HttpResponse<String> auth0Resp = client.send(req, HttpResponse.BodyHandlers.ofString());

        System.out.println("Auth0 response status: " + auth0Resp.statusCode());
        System.out.println("Auth0 response body: " + auth0Resp.body());

        if (auth0Resp.statusCode() != 200) {
            System.out.println("Refresh token invalid");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Refresh token invalid");
        }

        Map<String, Object> respMap = new ObjectMapper().readValue(auth0Resp.body(), Map.class);
        String newAccessToken = (String) respMap.get("access_token");
        String newRefreshToken = (String) respMap.get("refresh_token");

        System.out.println("New accessToken: " + newAccessToken);
        System.out.println("New refreshToken: " + newRefreshToken);

        ResponseCookie accessCookie = ResponseCookie.from("accessToken", newAccessToken)
                .httpOnly(true).secure(true).path("/").sameSite("Strict").maxAge(Duration.ofMinutes(15)).build();
        response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());

        if (newRefreshToken != null) {
            ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", newRefreshToken)
                    .httpOnly(true).secure(true).path("/").sameSite("Strict").maxAge(Duration.ofHours(1)).build();
            response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());
            System.out.println("New cookies set: access + refresh");
        } else {
            System.out.println("No new refresh token returned from Auth0");
        }

        return ResponseEntity.ok("Token refreshed");
    }

}