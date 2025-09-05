package programming.tutorial.dto;

import programming.tutorial.domain.Badge;
import programming.tutorial.domain.User;

import java.time.LocalDateTime;
import java.util.UUID;

public class UserBadgeDTO {
    private UUID id;

    private User user;

    private BadgeDTO badge;

    private LocalDateTime awardedAt = LocalDateTime.now();

    private boolean revoked = false;

    private String progress;

    public UserBadgeDTO() {
    }

    public UserBadgeDTO(UUID id, BadgeDTO badgeDTO, LocalDateTime awardedAt, boolean revoked, String progress) {
        this.id = id;
        this.badge = badgeDTO;
        this.awardedAt = awardedAt;
        this.revoked = revoked;
        this.progress = progress;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public BadgeDTO getBadge() {
        return badge;
    }

    public void setBadge(BadgeDTO badge) {
        this.badge = badge;
    }

    public LocalDateTime getAwardedAt() {
        return awardedAt;
    }

    public void setAwardedAt(LocalDateTime awardedAt) {
        this.awardedAt = awardedAt;
    }

    public boolean isRevoked() {
        return revoked;
    }

    public void setRevoked(boolean revoked) {
        this.revoked = revoked;
    }

    public String getProgress() {
        return progress;
    }

    public void setProgress(String progress) {
        this.progress = progress;
    }
}
