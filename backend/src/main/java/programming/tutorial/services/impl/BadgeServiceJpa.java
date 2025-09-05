package programming.tutorial.services.impl;

import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import programming.tutorial.dao.BadgeRepository;
import programming.tutorial.dao.UserBadgeRepository;
import programming.tutorial.dao.UserRepository;
import programming.tutorial.domain.User;
import programming.tutorial.domain.UserBadge;
import programming.tutorial.services.BadgeService;

import java.util.List;

@Service
public class BadgeServiceJpa implements BadgeService {

    @Autowired
    private BadgeRepository badgeRepository;

    @Autowired
    private UserBadgeRepository userBadgeRepository;

    @Autowired
    private UserRepository userRepository;

    boolean qualifies = false;

    private static final Logger logger = LoggerFactory.getLogger(BadgeServiceJpa.class);

    @Override
    public void awardCourseCompletionBadge(User user, int completedCourses) {
        logger.info("awardCourseCompletionBadge called for user: {}, completedCourses={}", user.getUsername(), completedCourses);

        badgeRepository.findAllByType("COURSE_COMPLETION")
                .stream()
                .filter(badge -> {
                    boolean qualifies = false;
                    try {
                        int requiredCourses = Integer.parseInt(badge.getCriteria().replaceAll("[^0-9]", ""));
                        qualifies = completedCourses >= requiredCourses;
                        logger.debug("Checking badge: {}, requiredCourses={}, qualifies={}", badge.getName(), requiredCourses, qualifies);
                    } catch (Exception e) {
                        logger.error("Failed to parse criteria for badge {}: {}", badge.getName(), badge.getCriteria(), e);
                    }
                    return qualifies;
                })
                .forEach(badge -> {
                    try {
                        if (!userBadgeRepository.existsByUserAndBadge(user, badge)) {
                            UserBadge userBadge = new UserBadge(user, badge);
                            userBadgeRepository.save(userBadge);
                            logger.info("Badge awarded: {}", badge.getName());
                        } else {
                            logger.debug("User already has badge: {}", badge.getName());
                        }
                    } catch (Exception e) {
                        logger.error("Failed to save badge for user {}", user.getUsername(), e);
                    }
                });
    }

    @Override
    public void awardForumActivityBadge(String auth0UserId, int postsCount) {
        User user = userRepository.findByAuth0UserId(auth0UserId).orElseThrow(() -> new RuntimeException("User not found"));

        badgeRepository.findAllByType("FORUM_ACTIVITY")
                .stream()
                .filter(badge -> {
                    try {
                        int requiredCount = Integer.parseInt(
                                badge.getCriteria().replaceAll("[^0-9]", "")
                        );
                        return postsCount >= requiredCount;
                    } catch (Exception e) {
                        return false;
                    }
                })
                .forEach(badge -> {
                    if (!userBadgeRepository.existsByUserAndBadge(user, badge)) {
                        userBadgeRepository.save(new UserBadge(user, badge));
                    }
                });
    }

    @Override
    @Transactional
    public List<UserBadge> getUserBadges(String auth0UserId) {
        User user = userRepository.findByAuth0UserId(auth0UserId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return userBadgeRepository.findByUser(user);
    }
}