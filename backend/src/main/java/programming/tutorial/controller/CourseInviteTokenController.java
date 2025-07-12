package programming.tutorial.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import programming.tutorial.domain.InviteRequest;
import programming.tutorial.domain.InviteResponse;
import programming.tutorial.dto.CourseInviteAcceptRequestDTO;
import programming.tutorial.services.InviteService;

import java.security.Principal;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/invite")
public class CourseInviteTokenController {

    @Autowired
    private InviteService inviteService;

    @PostMapping("/accept")
    public ResponseEntity<?> acceptInvite(@RequestBody CourseInviteAcceptRequestDTO request, Principal principal) {
        String sender = principal.getName();
        try {
            InviteResponse response = inviteService.acceptInvite(request.getToken(), sender);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/send-invite")
    public ResponseEntity<?> sendInvite(@RequestBody InviteRequest inviteRequest, Principal principal) {
        String inviterUserId = principal.getName();
        try {
            inviteService.createAndSendInvite(inviteRequest.getEmail(), inviteRequest.getCourseId(), inviterUserId);
            return ResponseEntity.ok("Invite sent");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
