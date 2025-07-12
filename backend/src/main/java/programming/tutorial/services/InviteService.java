package programming.tutorial.services;

import org.springframework.stereotype.Service;
import programming.tutorial.domain.*;

@Service
public interface InviteService {

    InviteResponse acceptInvite(String token, String username);

    String generateInviteToken(Long courseId, Long lessonId, String invitedByUserId, String email);

    void createAndSendInvite(String email, Long courseId, String inviterUserId);

}
