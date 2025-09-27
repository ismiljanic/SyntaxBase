package programming.tutorial.services;

import org.springframework.stereotype.Service;
import programming.tutorial.domain.User;
import programming.tutorial.domain.UserBadge;
import programming.tutorial.dto.UserBadgeDTO;

import java.util.List;

public interface BadgeService {
    void awardCourseCompletionBadge(User user, int completedCourses);

    void awardForumActivityBadge(String userId, int postsCount);

    List<UserBadge> getUserBadges(String auth0UserId);

    List<UserBadgeDTO> getUserBadgesByUserId(String auth0UserId);
}
