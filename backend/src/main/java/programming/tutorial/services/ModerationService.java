package programming.tutorial.services;

import programming.tutorial.moderation.ModerationResult;

public interface ModerationService {
    ModerationResult classify(String text);
}
