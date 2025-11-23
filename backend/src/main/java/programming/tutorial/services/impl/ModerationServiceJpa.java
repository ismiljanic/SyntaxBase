package programming.tutorial.services.impl;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import programming.tutorial.moderation.ModerationRequest;
import programming.tutorial.moderation.ModerationResult;
import programming.tutorial.services.ModerationService;

@Service
public class ModerationServiceJpa implements ModerationService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final String moderationUrl = "http://localhost:8000/classify";

    public ModerationResult classify(String text) {
        try {
            return restTemplate.postForObject(
                    moderationUrl,
                    new ModerationRequest(text),
                    ModerationResult.class
            );
        } catch (Exception e) {
            ModerationResult fallback = new ModerationResult();
            fallback.setFinal_label("unknown");
            return fallback;
        }
    }
}
